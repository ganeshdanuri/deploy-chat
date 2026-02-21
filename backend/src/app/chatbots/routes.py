from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from uuid import UUID
from app.core.db import get_session
from app.api.deps import get_current_user
from app.schemas.models import Chatbot, ChatbotCreate, ChatbotRead, ChatbotDatasets, User, Dataset
from app.core.billing import verify_plan_limits, increment_usage
from app.core.ai import get_ai_response
from app.core.endpoints import Endpoints

router = APIRouter(prefix=Endpoints.CHATBOTS_PREFIX)

@router.get(Endpoints.CHATBOTS_BASE, response_model=List[ChatbotRead])
def get_chatbots(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Chatbot).where(Chatbot.user_id == current_user.id)
    results = session.exec(statement).all()
    return results

@router.post(Endpoints.CHATBOTS_BASE, response_model=ChatbotRead)
def create_chatbot(
    chatbot_in: ChatbotCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        # 1. Create Chatbot record
        new_chatbot = Chatbot(
            name=chatbot_in.name,
            user_id=current_user.id,
            system_prompt=chatbot_in.system_prompt or f"You are {chatbot_in.name}, a helpful AI assistant. Be polite, concise, and professional.",
            temperature=chatbot_in.temperature or 0.7,
            welcome_message=chatbot_in.welcome_message or "Hi! How can I help you today?",
        )
        session.add(new_chatbot)
        session.commit()
        session.refresh(new_chatbot)
        
        # 2. Link datasets
        for ds_id in chatbot_in.dataset_ids:
            # Verify dataset exists and belongs to user
            ds = session.get(Dataset, ds_id)
            if not ds or ds.user_id != current_user.id:
                continue
                
            link = ChatbotDatasets(
                chatbot_id=new_chatbot.id,
                dataset_id=ds_id
            )
            session.add(link)
            
        from app.schemas.models import RecentActivity
        activity = RecentActivity(
            user_id=current_user.id,
            activity_type="chatbot_created",
            details=f"Created chatbot: {new_chatbot.name}"
        )
        session.add(activity)

        session.commit()
        session.refresh(new_chatbot)
        return new_chatbot
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create chatbot: {str(e)}"
        )

@router.post(Endpoints.CHATBOTS_CHAT)
async def chatbot_chat(
    chatbot_id: UUID,
    message: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 1. Verify access
    chatbot = session.get(Chatbot, chatbot_id)
    if not chatbot or chatbot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Chatbot not found")
        
    # 2. Verify usage limits
    usage = verify_plan_limits(current_user, session)
    
    # 3. Get Real AI Response
    try:
        response, token_count = await get_ai_response(session, chatbot, message, temperature=chatbot.temperature)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Agent failed: {str(e)}"
        )
    
    # 4. Increment usage
    increment_usage(usage, session, token_count=token_count)
    
    return {"response": response, "usage_count": usage.message_count, "token_usage": token_count}

@router.delete(Endpoints.CHATBOTS_BY_ID)
def delete_chatbot(
    chatbot_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    chatbot = session.get(Chatbot, chatbot_id)
    if not chatbot or chatbot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    # Delete links first
    statement = select(ChatbotDatasets).where(ChatbotDatasets.chatbot_id == chatbot_id)
    links = session.exec(statement).all()
    for link in links:
        session.delete(link)
        
    session.delete(chatbot)
    session.commit()
    return {"message": "Chatbot deleted successfully"}
