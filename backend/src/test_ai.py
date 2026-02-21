import asyncio
from app.core.ai import GoogleAIWrapper
from sqlmodel import Session, select
from app.core.db import engine
from app.schemas.models import PlatformAPIKey

async def test():
    with Session(engine) as session:
        key_stmt = select(PlatformAPIKey.api_key).where(
            PlatformAPIKey.provider == "google",
            PlatformAPIKey.is_active
        )
        api_key = session.exec(key_stmt).first()
        if not api_key:
            print("API Key not found")
            return

    wrapper = GoogleAIWrapper(api_key=api_key, model_name="gemini-2.5-flash")
    try:
        response, tokens = await wrapper.run("You are a helpful assistant.", "Hello!")
        print(f"Response: {response}")
        print(f"Tokens: {tokens}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
