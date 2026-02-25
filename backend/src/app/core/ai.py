from uuid import UUID
from sqlmodel import Session, select
from dataclasses import dataclass
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.providers.google_gla import GoogleGLAProvider
from pydantic_ai.messages import ModelRequest, ModelResponse, UserPromptPart, TextPart
from app.schemas.models import Chatbot, DatasetDocuments, DocumentContent, PlatformAPIKey, ChatMessageItem

from app.core.chunking import generate_embedding
from app.schemas.models import ChatbotDatasets, DocumentChunk
from app.core.constants import DEFAULT_AI_MODEL, ROLE_USER

@dataclass
class ChatbotDependencies:
    session: Session
    chatbot_id: UUID
    api_key: str

async def get_chatbot_context(session: Session, chatbot_id: UUID, user_message: str, api_key: str) -> str:
    """Retrieves relevant document chunks using vector similarity search."""
    # 1. Generate query embedding
    query_embedding = await generate_embedding(user_message, api_key)
    if not query_embedding:
        return ""
        
    # 2. Get all datasets linked to this chatbot
    dataset_ids_stmt = select(ChatbotDatasets.dataset_id).where(ChatbotDatasets.chatbot_id == chatbot_id)
    dataset_ids = session.exec(dataset_ids_stmt).all()
    
    if not dataset_ids:
        return ""
        
    # 3. Get all documents in these datasets
    doc_ids_stmt = select(DatasetDocuments.document_id).where(DatasetDocuments.dataset_id.in_(dataset_ids))
    doc_ids = session.exec(doc_ids_stmt).all()
    
    if not doc_ids:
        return ""
        
    # Deduplicate doc_ids
    doc_ids = list(set(doc_ids))
        
    # 4. Search document chunks using pgvector (cosine distance)
    try:
        stmt = (
            select(DocumentChunk)
            .where(DocumentChunk.document_id.in_(doc_ids))
            .order_by(DocumentChunk.embedding.cosine_distance(query_embedding))
            .limit(5)  # Get top 5 most relevant chunks
        )
        chunks = session.exec(stmt).all()
        
        if chunks:
            return "\n\n".join([f"--- Context Segment ---\n{chunk.content}" for chunk in chunks])
    except Exception as e:
        # Log error or fallback
        pass
        
    # Fallback to fetching all raw content if no chunks exist (e.g., chunking is still processing)
    content_stmt = select(DocumentContent.markdown_content).where(DocumentContent.document_id.in_(doc_ids))
    contents = session.exec(content_stmt).all()
    
    fallback_text = "\n\n".join(contents)
    
    # Preemptively prevent Context Window overflow on Gemini
    if len(fallback_text) > 15000:
        return fallback_text[:15000] + "\n\n...[Context truncated due to size limits. Additional data omitted.]"
        
    return fallback_text
    
class GoogleAIWrapper:
    """Wrapper for Google Gemini models via Pydantic AI."""
    def __init__(self, api_key: str, model_name: str = DEFAULT_AI_MODEL):
        self.api_key = api_key
        self.model_name = model_name
        self.provider = GoogleGLAProvider(api_key=api_key)
        self.model = GeminiModel(self.model_name, provider=self.provider)

    async def run(
        self, 
        system_prompt: str, 
        user_message: str, 
        temperature: float = 0.7, 
        deps: ChatbotDependencies = None,
        message_history: list = None
    ) -> tuple[str, int]:
        """Runs the agent with the given system prompt and user message."""
        # Setup model settings (e.g., temperature)
        from pydantic_ai.models import ModelSettings
        settings = ModelSettings(temperature=temperature)
        
        agent = Agent(self.model, system_prompt=system_prompt, model_settings=settings, deps_type=ChatbotDependencies)
        
        if deps:
            @agent.tool
            async def search_documents(ctx: RunContext[ChatbotDependencies], query: str) -> str:
                """Consult your internal specialized knowledge to find precise details for answering the user's request. 
                Use this whenever the query requires specific expertise or factual data."""
                return await get_chatbot_context(ctx.deps.session, ctx.deps.chatbot_id, query, ctx.deps.api_key)
        
        result = await agent.run(user_message, deps=deps, message_history=message_history)
        
        # Calculate tokens if available, otherwise estimate
        # Note: PydanticAI might not expose exact token counts for all models/providers easily yet
        # For now, we'll try to get it if available, or just default to 0
        token_count = 0
        try:
             if hasattr(result, 'usage'):
                 # Attempt to sum prompt + completion tokens
                 usage = result.usage()
                 token_count = usage.total_tokens if usage else 0
        except Exception:
             # Usage tracking is optional, don't fail the request if it breaks
             pass

        # Extract response content
        # Note: AgentRunResult attributes vary by version. 
        # Check 'data' (standard), then 'output' (annotation hint), then 'response' (introspection hint).
        if hasattr(result, 'data'):
             return result.data, token_count
             
        if hasattr(result, 'output'):
             # output might be the direct result
             return str(result.output), token_count
             
        if hasattr(result, 'response'):
             # response usually holds the provider's response object
             resp = result.response
             # If it's an object with .text (like Google's), use that
             if hasattr(resp, 'text'):
                  return resp.text, token_count
             return str(resp), token_count
             
        # Fallback
        return str(result), token_count

async def get_ai_response(
    session: Session, 
    chatbot: Chatbot, 
    user_message: str,
    history: list[ChatMessageItem] = None,
    temperature: float = 0.7
) -> tuple[str, int]:
    """Calls AI via wrapper with document context."""
    
    # 1. Get Platform API Key for Gemini
    key_stmt = select(PlatformAPIKey.api_key).where(
        PlatformAPIKey.provider == "google",
        PlatformAPIKey.is_active
    )
    api_key = session.exec(key_stmt).first()
    
    if not api_key:
        return "Error: AI Service configuration missing (Platform API Key not found).", 0

    # 2. Setup Prompt (clean, no raw context appended)
    system_prompt = chatbot.system_prompt

    # 3. Create Dependencies and Use Wrapper
    deps = ChatbotDependencies(
        session=session,
        chatbot_id=chatbot.id,
        api_key=api_key
    )
    
    message_history = []
    if history:
        for item in history:
            if item.role in [ROLE_USER, "human"]:
                message_history.append(ModelRequest(parts=[UserPromptPart(content=item.content)]))
            else:
                message_history.append(ModelResponse(parts=[TextPart(content=item.content)]))
    
    ai_wrapper = GoogleAIWrapper(api_key=api_key, model_name=DEFAULT_AI_MODEL)
    return await ai_wrapper.run(
        system_prompt, 
        user_message, 
        temperature=temperature, 
        deps=deps,
        message_history=message_history
    )
