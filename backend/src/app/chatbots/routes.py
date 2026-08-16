from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlmodel import Session, select, func
from typing import List
from uuid import UUID
from app.core.db import get_session
from app.api.deps import get_current_user
from app.schemas.models import Chatbot, ChatbotCreate, ChatbotUpdate, ChatbotRead, ChatbotDatasets, User, Dataset, DatasetDocuments, Document, DocumentChunk, ChatRequest
from app.core.billing import verify_plan_limits, increment_usage
from app.core.ai import get_ai_response
from app.core.endpoints import Endpoints
from app.core.chunking import process_chatbot_documents

from app.core.constants import CHATBOT_STATUS_ACTIVE, CHATBOT_STATUS_CREATING, CHATBOT_STATUS_FAILED, ACTIVITY_TYPE_CHATBOT_CREATED, SYSTEM_PROMPT_TEMPLATE
import re
from urllib.parse import urlparse

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

    if not chatbot_in.dataset_ids and not chatbot_in.document_ids:
        raise HTTPException(
            status_code=400,
            detail="Pick at least one file or collection for this agent to learn from."
        )

    try:
        # Everything below builds a single transaction and commits once at the
        # end. Validate before writing so a rejected request leaves nothing
        # behind — an early commit here used to strand half-built chatbots.

        # 1. Validate domains up front
        # Accepts a valid host or origin (e.g. https://example.com, localhost:3000).
        # Domains and IPs with optional port only — no wildcards.
        domain_regex = re.compile(
            r'^(?:https?:\/\/)?' # scheme
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}|' # domain
            r'localhost|' # localhost
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ip
            r'(?::\d+)?' # port
            r'(?:\/?)$', re.IGNORECASE)

        domains = [d.strip() for d in chatbot_in.allowed_domains.split(",") if d.strip()]
        for domain in domains:
            if not domain_regex.match(domain) or domain == "*":
                raise HTTPException(status_code=400, detail=f"Invalid domain format: {domain}")

        # 2. Resolve the knowledge this agent will be trained on
        linked_dataset_ids = []
        for ds_id in chatbot_in.dataset_ids:
            ds = session.get(Dataset, ds_id)
            if ds and ds.user_id == current_user.id:
                linked_dataset_ids.append(ds_id)

        if chatbot_in.document_ids:
            owned_doc_ids = session.exec(
                select(Document.id).where(
                    Document.id.in_(chatbot_in.document_ids),
                    Document.user_id == current_user.id,
                )
            ).all()
            if owned_doc_ids:
                # Collections are an implementation detail for callers who just
                # picked files — build one for them in the same transaction.
                auto_dataset = Dataset(
                    name=f"{chatbot_in.name} knowledge",
                    user_id=current_user.id
                )
                session.add(auto_dataset)
                # Link tables declare foreign_key but no ORM Relationship, so
                # SQLAlchemy can't infer insert order and may emit the link row
                # first. Flush the parent (same transaction, not a commit).
                session.flush()
                for doc_id in owned_doc_ids:
                    session.add(DatasetDocuments(
                        dataset_id=auto_dataset.id,
                        document_id=doc_id
                    ))
                linked_dataset_ids.append(auto_dataset.id)

        if not linked_dataset_ids:
            raise HTTPException(
                status_code=400,
                detail="None of the selected files or collections could be found."
            )

        # 3. Create the chatbot and everything hanging off it
        default_prompt = SYSTEM_PROMPT_TEMPLATE.format(name=chatbot_in.name)

        # Personalize welcome message if using default
        welcome_msg = chatbot_in.welcome_message
        if not welcome_msg or welcome_msg.strip() == "Hi! How can I help you today?":
            welcome_msg = f"Hi! I am {chatbot_in.name}. How can I help you today?"

        new_chatbot = Chatbot(
            name=chatbot_in.name,
            user_id=current_user.id,
            system_prompt=chatbot_in.system_prompt or default_prompt,
            temperature=chatbot_in.temperature,
            welcome_message=welcome_msg,
        )
        session.add(new_chatbot)
        session.flush()  # parent must exist before its origins/dataset links

        from app.schemas.models import ChatbotAllowedOrigin
        for domain in domains:
            session.add(ChatbotAllowedOrigin(chatbot_id=new_chatbot.id, domain=domain))

        for ds_id in linked_dataset_ids:
            session.add(ChatbotDatasets(chatbot_id=new_chatbot.id, dataset_id=ds_id))

        from app.schemas.models import RecentActivity
        session.add(RecentActivity(
            user_id=current_user.id,
            activity_type=ACTIVITY_TYPE_CHATBOT_CREATED,
            details=f"Created chatbot: {new_chatbot.name}"
        ))

        session.commit()
        session.refresh(new_chatbot)

        # Trigger background chunking
        background_tasks.add_task(process_chatbot_documents, new_chatbot.id)

        return new_chatbot
    except HTTPException:
        session.rollback()
        raise
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create chatbot. Please try again later."
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
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI Assistant encountered an error. Please try again later."
        )
    
    # 4. Increment usage
    increment_usage(usage, session, token_count=token_count)
    
    return {"response": response, "usage_count": usage.message_count, "token_usage": token_count}

@router.patch(Endpoints.CHATBOTS_BY_ID, response_model=ChatbotRead)
def update_chatbot(
    chatbot_id: UUID,
    chatbot_in: ChatbotUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    chatbot = session.get(Chatbot, chatbot_id)
    if not chatbot or chatbot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Chatbot not found")
        
    update_data = chatbot_in.model_dump(exclude_unset=True)
    
    # Handle datasets update
    if "dataset_ids" in update_data:
        dataset_ids = update_data.pop("dataset_ids")
        # Clear existing links
        stmt = select(ChatbotDatasets).where(ChatbotDatasets.chatbot_id == chatbot.id)
        existing_links = session.exec(stmt).all()
        for link in existing_links:
            session.delete(link)
        
        # Add new links
        for ds_id in dataset_ids:
            ds = session.get(Dataset, ds_id)
            if not ds or ds.user_id != current_user.id:
                continue
            link = ChatbotDatasets(chatbot_id=chatbot.id, dataset_id=ds_id)
            session.add(link)
            
    # Handle allowed domains update
    if "allowed_domains" in update_data:
        allowed_domains_str = update_data.pop("allowed_domains")
        # Clear existing domains
        from app.schemas.models import ChatbotAllowedOrigin
        stmt = select(ChatbotAllowedOrigin).where(ChatbotAllowedOrigin.chatbot_id == chatbot.id)
        existing_origins = session.exec(stmt).all()
        for origin in existing_origins:
            session.delete(origin)
            
        # Add new domains
        domain_regex = re.compile(
            r'^(?:https?:\/\/)?' # scheme
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}|' # domain
            r'localhost|' # localhost
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ip
            r'(?::\d+)?' # port
            r'(?:\/?)$', re.IGNORECASE)
            
        domains = [d.strip() for d in allowed_domains_str.split(",") if d.strip()]
        for domain in domains:
            if not domain_regex.match(domain) or domain == "*":
                raise HTTPException(status_code=400, detail=f"Invalid domain format: {domain}")
            origin = ChatbotAllowedOrigin(chatbot_id=chatbot.id, domain=domain)
            session.add(origin)

    # Update other fields
    for key, value in update_data.items():
        setattr(chatbot, key, value)
        
    chatbot.updated_at = datetime.utcnow()
    session.add(chatbot)
    session.commit()
    session.refresh(chatbot)
    
    # Add activity
    from app.schemas.models import RecentActivity, ACTIVITY_TYPE_CHATBOT_CREATED
    activity = RecentActivity(
        user_id=current_user.id,
        activity_type=ACTIVITY_TYPE_CHATBOT_CREATED, # Using this for now
        details=f"Updated chatbot: {chatbot.name}"
    )
    session.add(activity)
    session.commit()
    
    # Return with chunk count
    count_stmt = (
        select(func.count(DocumentChunk.id))
        .join(DatasetDocuments, DocumentChunk.document_id == DatasetDocuments.document_id)
        .join(ChatbotDatasets, DatasetDocuments.dataset_id == ChatbotDatasets.dataset_id)
        .where(ChatbotDatasets.chatbot_id == chatbot.id)
    )
    chunk_count = session.exec(count_stmt).one_or_none() or 0
    
    cb_dict = chatbot.model_dump()
    cb_dict["chunk_count"] = chunk_count
    return ChatbotRead(**cb_dict)

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
