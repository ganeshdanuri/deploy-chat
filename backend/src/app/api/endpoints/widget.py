from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from app.core.db import get_session
from app.schemas.models import Chatbot, User
from app.core.billing import verify_plan_limits, increment_usage
from app.core.ai import get_ai_response
from app.core.endpoints import Endpoints

router = APIRouter(prefix=Endpoints.WIDGET_PREFIX)


class WidgetChatRequest(BaseModel):
    message: str


@router.post(Endpoints.WIDGET_CHAT)
async def widget_chat(
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

    # 2. Load the owner user for billing/usage purposes
    owner = session.get(User, chatbot.user_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Chatbot owner not found")

    # 3. Verify usage limits on the owner's plan
    usage = verify_plan_limits(owner, session)

    # 4. Get AI response
    try:
        response, token_count = await get_ai_response(
            session, chatbot, body.message, temperature=chatbot.temperature
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Agent failed: {str(e)}",
        )

    # 5. Track usage against the owner
    increment_usage(usage, session, token_count=token_count)

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
