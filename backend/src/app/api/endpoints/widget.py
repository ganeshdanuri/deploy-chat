import hmac
import hashlib
import time
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session, select
from pydantic import BaseModel, Field as PydField
from app.core.db import get_session
from app.schemas.models import Chatbot, User
from app.core.billing import verify_plan_limits, increment_usage
from app.core.constants import ROLE_USER, ROLE_ASSISTANT
from app.core.ai import get_ai_response
from app.core.endpoints import Endpoints
from app.core.limiter import limiter

router = APIRouter(prefix=Endpoints.WIDGET_PREFIX)


def _chatbot_key(request: Request) -> str:
    """
    Rate-limit key scoped to the agent rather than the caller.

    The per-IP limits below are trivially sidestepped by spreading traffic
    across addresses. This one bounds how fast any single agent can be driven
    no matter where the requests come from, which is what actually caps the
    owner's exposure to token spend.
    """
    # embed_token is a PATH param (/widget/{embed_token}/chat). Reading it from
    # query_params yields None for every request, which silently collapses this
    # into one global bucket shared by all agents.
    token = request.path_params.get("embed_token") or request.query_params.get("embed_token")
    return f"chatbot:{token or 'unknown'}"

from typing import List
from urllib.parse import urlparse
from app.schemas.models import ChatMessageItem, ChatbotAllowedOrigin


def verify_widget_origin(session: Session, chatbot: Chatbot, request: Request):
    allowed_db = session.exec(select(ChatbotAllowedOrigin).where(ChatbotAllowedOrigin.chatbot_id == chatbot.id)).all()
    # Fail closed. An agent with no configured origins previously accepted
    # requests from anywhere, which is the opposite of what "no origins" means.
    if not allowed_db:
        raise HTTPException(
            status_code=403,
            detail="This agent has no allowed domains configured.",
        )

    allowed = [d.domain.strip().lower() for d in allowed_db]
    if "*" in allowed:
        return

    origin = request.headers.get("origin") or request.headers.get("referer")
    if not origin:
        raise HTTPException(status_code=403, detail="Origin not provided or allowed")

    parsed_origin = urlparse(origin).netloc.lower() or origin.lower()
    if ":" in parsed_origin:
        parsed_origin = parsed_origin.split(":")[0]

    for domain in allowed:
        domain_clean = domain.split("://")[-1].split("/")[0].split(":")[0]
        if parsed_origin == domain_clean or parsed_origin.endswith(f".{domain_clean}"):
            return

    raise HTTPException(status_code=403, detail="Origin not allowed")


def _make_widget_token(signing_secret: str, session_id: str, bucket: int) -> str:
    message = f"{session_id}:{bucket}".encode()
    return hmac.new(signing_secret.encode(), message, hashlib.sha256).hexdigest()


def generate_widget_token(signing_secret: str, session_id: str) -> str:
    bucket = int(time.time()) // 3600
    return _make_widget_token(signing_secret, session_id, bucket)


def verify_widget_token(signing_secret: str, session_id: str, token: str) -> bool:
    """Accepts tokens from the current hour or the previous hour to handle bucket boundaries."""
    current_bucket = int(time.time()) // 3600
    for bucket in (current_bucket, current_bucket - 1):
        expected = _make_widget_token(signing_secret, session_id, bucket)
        if hmac.compare_digest(expected, token):
            return True
    return False


MAX_MESSAGE_CHARS = 4000


class WidgetChatRequest(BaseModel):
    # Unbounded input is a direct spend amplifier: one request can carry
    # megabytes straight into a paid model call.
    message: str = PydField(..., min_length=1, max_length=MAX_MESSAGE_CHARS)
    session_id: str = PydField(None, max_length=200)
    widget_token: str = PydField(..., max_length=200)
    # NOTE: `history` is deliberately NOT accepted. It used to come from the
    # client and was replayed to the model as genuine assistant turns, which let
    # anyone forge a conversation where the agent had already agreed to ignore
    # its instructions. History is now rebuilt server-side from ChatMessage.


MAX_HISTORY_TURNS = 20


def _load_session_history(session: Session, chatbot_id, session_token: str | None) -> List[ChatMessageItem]:
    """
    Server-authoritative conversation history.

    Scoped by chatbot_id as well as session token so a token harvested from one
    agent can't replay another agent's transcript. Capped so a long-running
    session can't grow the prompt without bound.
    """
    if not session_token:
        return []

    from app.schemas.models import ChatSession, ChatMessage

    chat_session = session.exec(
        select(ChatSession).where(
            ChatSession.session_token == session_token,
            ChatSession.chatbot_id == chatbot_id,
        )
    ).first()
    if not chat_session:
        return []

    rows = session.exec(
        select(ChatMessage)
        .where(ChatMessage.session_id == chat_session.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(MAX_HISTORY_TURNS)
    ).all()

    return [ChatMessageItem(role=m.role, content=m.content) for m in reversed(rows)]


@router.get(Endpoints.WIDGET_INIT)
@limiter.limit("20/minute")
@limiter.limit("300/hour", key_func=_chatbot_key)
def widget_init(
    embed_token: str,
    session_id: str,
    request: Request,
    session: Session = Depends(get_session),
):
    """
    Called by the widget on first open. Validates origin and returns a short-lived
    HMAC token. The token must be included in every subsequent /chat request.
    The signing_secret never leaves the server.
    """
    statement = select(Chatbot).where(Chatbot.embed_token == embed_token)
    chatbot = session.exec(statement).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    verify_widget_origin(session, chatbot, request)

    widget_token = generate_widget_token(chatbot.signing_secret, session_id)
    return {"widget_token": widget_token}


@router.post(Endpoints.WIDGET_CHAT)
@limiter.limit("10/minute")
@limiter.limit("200/hour", key_func=_chatbot_key)
async def widget_chat(
    request: Request,
    embed_token: str,
    body: WidgetChatRequest,
    session: Session = Depends(get_session),
):
    # 1. Look up chatbot by embed_token
    statement = select(Chatbot).where(Chatbot.embed_token == embed_token)
    chatbot = session.exec(statement).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    # 2. Origin check
    verify_widget_origin(session, chatbot, request)

    # 3. HMAC token verification — prevents server-side spoofing
    if not body.widget_token or not verify_widget_token(
        chatbot.signing_secret, body.session_id or "", body.widget_token
    ):
        raise HTTPException(status_code=403, detail="Invalid or expired widget token")

    # 4. Load owner for billing
    owner = session.get(User, chatbot.user_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Chatbot owner not found")

    # 5. Verify usage limits
    usage = verify_plan_limits(owner, session)

    # 5b. Rebuild history from what the server actually recorded for this
    # session, so a caller can't dictate what the assistant "previously said".
    history = _load_session_history(session, chatbot.id, body.session_id)

    # 6. Get AI response
    try:
        response, token_count = await get_ai_response(
            session, chatbot, body.message, history=history, temperature=chatbot.temperature
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI Assistant is temporarily unavailable. Please try again later.",
        )

    # 7. Track usage
    increment_usage(usage, session, token_count=token_count)

    # 8. Log session and messages
    from app.schemas.models import ChatSession, ChatMessage
    if body.session_id:
        chat_session = session.exec(select(ChatSession).where(ChatSession.session_token == body.session_id)).first()
        if not chat_session:
            client_ip = request.client.host if request.client else None
            chat_session = ChatSession(chatbot_id=chatbot.id, session_token=body.session_id, ip_address=client_ip)
            session.add(chat_session)
            session.commit()
            session.refresh(chat_session)

        user_msg = ChatMessage(session_id=chat_session.id, role=ROLE_USER, content=body.message)
        bot_msg = ChatMessage(session_id=chat_session.id, role=ROLE_ASSISTANT, content=response)
        session.add(user_msg)
        session.add(bot_msg)
        session.commit()

    return {
        "response": response,
        "chatbot_name": chatbot.name,
    }


@router.get(Endpoints.WIDGET_INFO)
@limiter.limit("30/minute")
@limiter.limit("600/hour", key_func=_chatbot_key)
def widget_info(
    request: Request,
    embed_token: str,
    session: Session = Depends(get_session),
):
    """Returns public chatbot metadata for the widget to display (name, greeting, etc.)."""
    statement = select(Chatbot).where(Chatbot.embed_token == embed_token)
    chatbot = session.exec(statement).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    verify_widget_origin(session, chatbot, request)

    return {
        "name": chatbot.name,
        "greeting": chatbot.welcome_message,
    }
