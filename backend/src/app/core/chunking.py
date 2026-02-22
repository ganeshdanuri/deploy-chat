from uuid import UUID
import httpx
import logging
from sqlmodel import Session, select
from app.core.db import engine
from app.schemas.models import ChatbotDatasets, DatasetDocuments, DocumentContent, DocumentChunk, PlatformAPIKey, Chatbot
from app.core.constants import GEMINI_TEXT_EMBEDDING_MODEL, CHUNK_MAX_LENGTH, CHUNK_OVERLAP, CHATBOT_STATUS_ACTIVE, CHATBOT_STATUS_FAILED

async def generate_embedding(text: str, api_key: str) -> list[float]:
    url = f"https://generativelanguage.googleapis.com/v1beta/{GEMINI_TEXT_EMBEDDING_MODEL}:embedContent?key={api_key}"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                url,
                json={
                    "model": GEMINI_TEXT_EMBEDDING_MODEL,
                    "content": {
                        "parts": [{"text": text}]
                    },
                    "outputDimensionality": 768
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            return data["embedding"]["values"]
        except Exception as e:
            logging.error(f"Error generating embedding: {e}")
            return []

def get_chunks(text: str, max_length: int = CHUNK_MAX_LENGTH, overlap: int = CHUNK_OVERLAP) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + max_length, len(text))
        if end < len(text):
            last_newline = text.rfind('\n', start, end)
            if last_newline != -1 and last_newline > start + max_length // 2:
                end = last_newline + 1
            else:
                last_space = text.rfind(' ', start, end)
                if last_space != -1 and last_space > start + max_length // 2:
                    end = last_space + 1
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
            
        if end >= len(text):
            break
            
        start = end - overlap
        if start < 0 or start >= end:
            start = end
    return chunks

async def process_chatbot_documents(chatbot_id: UUID):
    try:
        with Session(engine) as session:
            key_stmt = select(PlatformAPIKey.api_key).where(
                PlatformAPIKey.provider == "google",
                PlatformAPIKey.is_active
            )
            api_key = session.exec(key_stmt).first()
            if not api_key:
                logging.error("No active Google API key found for chunking.")
                chatbot = session.get(Chatbot, chatbot_id)
                if chatbot:
                    chatbot.status = CHATBOT_STATUS_FAILED
                    session.add(chatbot)
                    session.commit()
                return
    
            dataset_ids_stmt = select(ChatbotDatasets.dataset_id).where(ChatbotDatasets.chatbot_id == chatbot_id)
            dataset_ids = session.exec(dataset_ids_stmt).all()
            
            if dataset_ids:
                doc_ids_stmt = select(DatasetDocuments.document_id).where(DatasetDocuments.dataset_id.in_(dataset_ids))
                doc_ids = session.exec(doc_ids_stmt).all()
                
                if doc_ids:
                    # Avoid duplicated documents within the same processing batch
                    unique_doc_ids = list(set(doc_ids))
                    
                    for doc_id in unique_doc_ids:
                        existing_chunks_stmt = select(DocumentChunk.chunk_index).where(DocumentChunk.document_id == doc_id)
                        existing_indices = session.exec(existing_chunks_stmt).all()
                        existing_indices_set = set(existing_indices)
                            
                        contents = session.exec(select(DocumentContent).where(DocumentContent.document_id == doc_id)).all()
                        if not contents:
                            continue
                        
                        doc_was_updated = False
                        for content in contents:
                            text = content.markdown_content
                            chunks = get_chunks(text)
                            for index, chunk_text in enumerate(chunks):
                                if index in existing_indices_set:
                                    continue
                                
                                embedding = await generate_embedding(chunk_text, api_key)
                                if embedding:
                                    doc_chunk = DocumentChunk(
                                        document_id=doc_id,
                                        chunk_index=index,
                                        content=chunk_text,
                                        embedding=embedding,
                                        embedding_model=GEMINI_TEXT_EMBEDDING_MODEL
                                    )
                                    session.add(doc_chunk)
            
            # Update chatbot status to active once ALL document chunks are successfully added to the session
            chatbot = session.get(Chatbot, chatbot_id)
            if chatbot:
                chatbot.status = CHATBOT_STATUS_ACTIVE
                session.add(chatbot)
                
            # Final atomic commit: either everything succeeds, or nothing is saved/activated
            session.commit()
    except Exception as e:
        logging.error(f"Error in process_chatbot_documents: {e}")
        with Session(engine) as session:
            chatbot = session.get(Chatbot, chatbot_id)
            if chatbot:
                chatbot.status = CHATBOT_STATUS_FAILED
                session.add(chatbot)
                session.commit()
