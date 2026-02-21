from uuid import UUID
from sqlmodel import Session, select
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.providers.google_gla import GoogleGLAProvider
from app.schemas.models import Chatbot, DatasetDocuments, DocumentContent, PlatformAPIKey

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
    
class GoogleAIWrapper:
    """Wrapper for Google Gemini models via Pydantic AI."""
    def __init__(self, api_key: str, model_name: str = "gemini-2.0-flash"):
        self.api_key = api_key
        self.model_name = model_name
        self.provider = GoogleGLAProvider(api_key=api_key)
        self.model = GeminiModel(self.model_name, provider=self.provider)

    async def run(self, system_prompt: str, user_message: str, temperature: float = 0.7) -> tuple[str, int]:
        """Runs the agent with the given system prompt and user message."""
        # Setup model settings (e.g., temperature)
        from pydantic_ai.models import ModelSettings
        settings = ModelSettings(temperature=temperature)
        
        agent = Agent(self.model, system_prompt=system_prompt, model_settings=settings)
        result = await agent.run(user_message)
        
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

    # 2. Build Context
    context = get_chatbot_context(session, chatbot.id)
    
    # 3. Setup Prompt
    system_prompt = chatbot.system_prompt
    if context:
        system_prompt += f"\n\nContext based on uploaded documents:\n{context}"
    else:
        system_prompt += "\n\nNote: No specific document context was found for this chatbot."

    # 4. Use Wrapper
    ai_wrapper = GoogleAIWrapper(api_key=api_key, model_name="gemini-2.5-flash")
    return await ai_wrapper.run(system_prompt, user_message, temperature=temperature)
