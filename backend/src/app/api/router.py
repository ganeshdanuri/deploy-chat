from fastapi import APIRouter
from app.documents.routes import router as documents_router
from app.api.endpoints.auth import router as auth_router

api_router = APIRouter(prefix="/api")

api_router.include_router(documents_router, tags=["documents"])
api_router.include_router(auth_router, tags=["auth"])
