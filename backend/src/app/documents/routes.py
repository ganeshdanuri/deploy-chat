from fastapi import APIRouter

router = APIRouter(prefix="/documents")

@router.get("/")
def get_documents():
    return {"message": "Documents"}