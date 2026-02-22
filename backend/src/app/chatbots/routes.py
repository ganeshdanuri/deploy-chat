from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlmodel import Session, select, func
from typing import List
from uuid import UUID
from app.core.db import get_session
from app.api.deps import get_current_user
from app.schemas.models import Chatbot, ChatbotCreate, ChatbotRead, ChatbotDatasets, User, Dataset, DatasetDocuments, DocumentChunk, ChatRequest
from app.core.billing import verify_plan_limits, increment_usage
from app.core.ai import get_ai_response
from app.core.endpoints import Endpoints
from app.core.chunking import process_chatbot_documents

from app.core.constants import CHATBOT_STATUS_ACTIVE, CHATBOT_STATUS_CREATING, CHATBOT_STATUS_FAILED, ACTIVITY_TYPE_CHATBOT_CREATED

router = APIRouter(prefix=Endpoints.CHATBOTS_PREFIX)

@router.get(Endpoints.CHATBOTS_BASE, response_model=List[ChatbotRead])
def get_chatbots(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Chatbot).where(Chatbot.user_id == current_user.id)
    chatbots = session.exec(statement).all()
    
    results = []
    for cb in chatbots:
        count_stmt = (
            select(func.count(DocumentChunk.id))
            .join(DatasetDocuments, DocumentChunk.document_id == DatasetDocuments.document_id)
            .join(ChatbotDatasets, DatasetDocuments.dataset_id == ChatbotDatasets.dataset_id)
            .where(ChatbotDatasets.chatbot_id == cb.id)
        )
        chunk_count = session.exec(count_stmt).one_or_none() or 0
        
        cb_dict = cb.model_dump()
        cb_dict["chunk_count"] = chunk_count
        results.append(ChatbotRead(**cb_dict))
        
    return results

@router.post(Endpoints.CHATBOTS_BASE, response_model=ChatbotRead)
def create_chatbot(
    chatbot_in: ChatbotCreate,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if not chatbot_in.welcome_message.strip() or not chatbot_in.allowed_domains.strip():
        raise HTTPException(status_code=400, detail="All fields must be provided and cannot be empty.")
        
    try:
        # 1. Create Chatbot record
        new_chatbot = Chatbot(
            name=chatbot_in.name,
            user_id=current_user.id,
            system_prompt=f"You are {chatbot_in.name}, a helpful AI assistant. Be polite, concise, and professional.",
            temperature=chatbot_in.temperature,
            welcome_message=chatbot_in.welcome_message,
        )
        session.add(new_chatbot)
        session.commit()
        session.refresh(new_chatbot)
        
        # Insert allowed domains
        if chatbot_in.allowed_domains:
            from app.schemas.models import ChatbotAllowedOrigin
            domains = [d.strip() for d in chatbot_in.allowed_domains.split(",") if d.strip()]
            for domain in domains:
                origin = ChatbotAllowedOrigin(chatbot_id=new_chatbot.id, domain=domain)
                session.add(origin)
        
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
            activity_type=ACTIVITY_TYPE_CHATBOT_CREATED,
            details=f"Created chatbot: {new_chatbot.name}"
        )
        session.add(activity)

        session.commit()
        session.refresh(new_chatbot)
        
        # Trigger background chunking
        background_tasks.add_task(process_chatbot_documents, new_chatbot.id)
        
        return new_chatbot
    except HTTPException:
        session.rollback()
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create chatbot: {str(e)}"
        )

@router.post(Endpoints.CHATBOTS_RESUME)
def resume_chatbot_creation(
    chatbot_id: UUID,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    chatbot = session.get(Chatbot, chatbot_id)
    if not chatbot or chatbot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Chatbot not found")
        
    if chatbot.status == CHATBOT_STATUS_ACTIVE:
        raise HTTPException(status_code=400, detail="Chatbot is already active")
        
    chatbot.status = CHATBOT_STATUS_CREATING
    session.add(chatbot)
    session.commit()
    
    background_tasks.add_task(process_chatbot_documents, chatbot.id)
    return {"message": "Resumed chatbot creation"}

@router.post(Endpoints.CHATBOTS_CHAT)
async def chatbot_chat(
    chatbot_id: UUID,
    request: ChatRequest,
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
        response, token_count = await get_ai_response(
            session, chatbot, request.message, history=request.history, temperature=chatbot.temperature
        )
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
    
    # Delete the chatbot (ChatbotDatasets, ChatSessions, and UsageTracking will be cascaded by DB)
    session.delete(chatbot)
    session.commit()
    return {"message": "Chatbot deleted successfully"}
