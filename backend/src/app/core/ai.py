import os
from typing import List, Optional
from uuid import UUID
from sqlmodel import Session, select
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from app.schemas.models import Chatbot, Dataset, DatasetDocuments, DocumentContent, PlatformAPIKey

def get_chatbot_context(session: Session, chatbot_id: UUID) -> str:
    """Retrieves all document content linked to a chatbot."""
    # 1. Get all datasets linked to this chatbot
    # This assumes chatbot_datasets table is used correctly
    from app.schemas.models import ChatbotDatasets
    
    dataset_ids_stmt = select(ChatbotDatasets.dataset_id).where(ChatbotDatasets.chatbot_id == chatbot_id)
    dataset_ids = session.exec(dataset_ids_stmt).all()
    
    if not dataset_ids:
        return ""
        
    # 2. Get all documents in these datasets
    doc_ids_stmt = select(DatasetDocuments.document_id).where(DatasetDocuments.dataset_id.in_(dataset_ids))
    doc_ids = session.exec(doc_ids_stmt).all()
    
    if not doc_ids:
        return ""
        
    # 3. Get all content for these documents
    content_stmt = select(DocumentContent.markdown_content).where(DocumentContent.document_id.in_(doc_ids))
    contents = session.exec(content_stmt).all()
    
    return "\n\n".join(contents)

async def get_ai_response(
    session: Session, 
    chatbot: Chatbot, 
    user_message: str,
    temperature: float = 0.7
) -> str:
    """Calls Gemini via Pydantic AI with document context."""
    
    # 1. Get Platform API Key for Gemini
    key_stmt = select(PlatformAPIKey.api_key).where(
        PlatformAPIKey.provider == "google",
        PlatformAPIKey.is_active == True
    )
    api_key = session.exec(key_stmt).first()
    
    if not api_key:
        return "Error: AI Service configuration missing (Platform API Key not found)."

    # 2. Build Context
    context = get_chatbot_context(session, chatbot.id)
    
    # 3. Initialize Agent
    model = GeminiModel('gemini-1.5-flash', api_key=api_key)
    
    system_prompt = chatbot.system_prompt
    if context:
        system_prompt += f"\n\nContext based on uploaded documents:\n{context}"
    else:
        system_prompt += "\n\nNote: No specific document context was found for this chatbot."

    agent = Agent(
        model,
        system_prompt=system_prompt,
    )

    # 4. Run Agent
    # Pydantic AI handles the call and returns a result
    # We pass temperature via the model if supported, or just use defaults for now
    # Note: gemini-1.5-flash is used here.
    result = await agent.run(user_message)
    
    return result.data
