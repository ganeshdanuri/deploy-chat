from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session, select
from pydantic import BaseModel
from app.core.db import get_session
from app.schemas.models import Chatbot, User
from app.core.billing import verify_plan_limits, increment_usage
from app.core.constants import ROLE_USER, ROLE_ASSISTANT
from app.core.ai import get_ai_response
from app.core.endpoints import Endpoints

router = APIRouter(prefix=Endpoints.WIDGET_PREFIX)


from typing import List
from urllib.parse import urlparse
from app.schemas.models import ChatMessageItem, ChatbotAllowedOrigin

def verify_widget_origin(session: Session, chatbot: Chatbot, request: Request):
    """
    Validates that the request origin/referer matches one of the chatbot's allowed domains.
    If no domains are allowed, or '*' is allowed, skips validation.
    """
    allowed_db = session.exec(select(ChatbotAllowedOrigin).where(ChatbotAllowedOrigin.chatbot_id == chatbot.id)).all()
    if not allowed_db:
        return

    allowed = [d.domain.strip().lower() for d in allowed_db]
    if "*" in allowed:
        return
        
    origin = request.headers.get("origin") or request.headers.get("referer")
    if not origin:
        raise HTTPException(status_code=403, detail="Origin not provided or allowed")
        
    parsed_origin = urlparse(origin).netloc.lower() or origin.lower()
    
    # Remove port if present
    if ":" in parsed_origin:
        parsed_origin = parsed_origin.split(":")[0]
    
    for domain in allowed:
        # Check exact block, subdomain, or prefix matching depending on logic
        domain_clean = domain.split("://")[-1].split("/")[0].split(":")[0] # Remove http:// and paths/ports
        if parsed_origin == domain_clean or parsed_origin.endswith(f".{domain_clean}"):
            return
            
    raise HTTPException(status_code=403, detail="Origin not allowed")

class WidgetChatRequest(BaseModel):
    message: str
    session_id: str = None
    history: List[ChatMessageItem] = []


@router.post(Endpoints.WIDGET_CHAT)
async def widget_chat(
    request: Request,
    embed_token: str,
    body: WidgetChatRequest,
    session: Session = Depends(get_session),
):
    """
    Public endpoint for the embeddable chat widget.
    No user authentication required — only the embed_token is needed.
    The token is tied to the chatbot and its owner for usage tracking.
    """
    # 1. Look up chatbot by embed_token
    statement = select(Chatbot).where(Chatbot.embed_token == embed_token)
    chatbot = session.exec(statement).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    # 2. Check Domain Whitelisting
    verify_widget_origin(session, chatbot, request)

    # 3. Load the owner user for billing/usage purposes
    owner = session.get(User, chatbot.user_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Chatbot owner not found")

    # 4. Verify usage limits on the owner's plan
    usage = verify_plan_limits(owner, session)

    # 5. Get AI response
    try:
        response, token_count = await get_ai_response(
            session, chatbot, body.message, history=body.history, temperature=chatbot.temperature
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI Assistant is temporarily unavailable. Please try again later.",
        )

    # 6. Track usage against the owner
    increment_usage(usage, session, token_count=token_count)

    # 7. Log to ChatSession and ChatMessage
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
