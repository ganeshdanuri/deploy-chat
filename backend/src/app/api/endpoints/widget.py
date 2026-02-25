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
from app.schemas.models import ChatMessageItem

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
    origin = request.headers.get("origin") or request.headers.get("referer")
    
    from app.schemas.models import ChatbotAllowedOrigin
    allowed_db = session.exec(select(ChatbotAllowedOrigin).where(ChatbotAllowedOrigin.chatbot_id == chatbot.id)).all()
    
    if allowed_db:
        allowed = [d.domain.strip() for d in allowed_db]
        if "*" not in allowed:
            parsed_origin = ""
            if origin:
                from urllib.parse import urlparse
                # urlparse("http://example.com").netloc -> "example.com"
                parsed_origin = urlparse(origin).netloc or origin
            
            # very basic check
            if parsed_origin not in allowed and origin not in allowed:
                raise HTTPException(status_code=403, detail="Origin not allowed")

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
    embed_token: str,
    session: Session = Depends(get_session),
):
    """Returns public chatbot metadata for the widget to display (name, greeting, etc.)."""
    statement = select(Chatbot).where(Chatbot.embed_token == embed_token)
    chatbot = session.exec(statement).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    return {
        "name": chatbot.name,
        "greeting": chatbot.welcome_message,
    }
