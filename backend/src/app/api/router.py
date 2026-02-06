from fastapi import APIRouter
from app.documents.routes import router as documents_router

api_router = APIRouter(prefix="/api")

api_router.include_router(documents_router, tags=["documents"])
