from fastapi import APIRouter
from app.documents.routes import router as documents_router
from app.datasets.routes import router as datasets_router
from app.chatbots.routes import router as chatbots_router
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.usage import router as usage_router

api_router = APIRouter(prefix="/api")

api_router.include_router(documents_router, tags=["documents"])
api_router.include_router(datasets_router, tags=["datasets"])
api_router.include_router(chatbots_router, tags=["chatbots"])
api_router.include_router(auth_router, tags=["auth"])
api_router.include_router(usage_router, tags=["usage"])
