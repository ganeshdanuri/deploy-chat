from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from uuid import UUID
from app.core.db import get_session
from app.api.deps import get_current_user
from app.schemas.models import Chatbot, ChatbotCreate, ChatbotRead, ChatbotDatasets, User, Dataset

router = APIRouter(prefix="/chatbots")

@router.get("/", response_model=List[ChatbotRead])
def get_chatbots(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Chatbot).where(Chatbot.user_id == current_user.id)
    results = session.exec(statement).all()
    return results

@router.post("/", response_model=ChatbotRead)
def create_chatbot(
    chatbot_in: ChatbotCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        # 1. Create Chatbot record
        new_chatbot = Chatbot(
            name=chatbot_in.name,
            user_id=current_user.id
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
            
        session.commit()
        session.refresh(new_chatbot)
        return new_chatbot
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create chatbot: {str(e)}"
        )

@router.delete("/{chatbot_id}")
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
