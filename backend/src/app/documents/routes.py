from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from app.core.db import get_session
from app.api.deps import get_current_user
from app.schemas.models import Document, DocumentContent, User, DocumentRead
from app.services.converter import convert_to_markdown

router = APIRouter(prefix="/documents")

@router.get("/", response_model=List[DocumentRead])
def get_documents(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Document).where(Document.user_id == current_user.id)
    results = session.exec(statement).all()
    return results

@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        content_bytes = await file.read()
        
        # 1. Convert to markdown
        markdown_text = convert_to_markdown(content_bytes, file.filename)
        
        # 2. Save Document record (linked to current_user)
        new_doc = Document(
            name=file.filename,
            user_id=current_user.id
        )
        session.add(new_doc)
        session.commit()
        session.refresh(new_doc)
        
        # 3. Save DocumentContent record
        new_content = DocumentContent(
            document_id=new_doc.id,
            markdown_content=markdown_text
        )
        session.add(new_content)
        
        from app.schemas.models import RecentActivity
        activity = RecentActivity(
            user_id=current_user.id,
            activity_type="document_added",
            details=f"Added document: {new_doc.name}"
        )
        session.add(activity)
        session.commit()
        
        return {
            "id": new_doc.id,
            "name": new_doc.name,
            "message": "File uploaded and converted successfully"
        }
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to process document: {str(e)}"
        )