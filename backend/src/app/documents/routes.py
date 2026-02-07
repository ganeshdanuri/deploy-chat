from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID
from app.core.db import get_session
from app.schemas.models import Document, DocumentContent, User
from app.services.converter import convert_to_markdown

router = APIRouter(prefix="/documents")

@router.get("/")
def get_documents(session: Session = Depends(get_session)):
    statement = select(Document)
    results = session.exec(statement).all()
    return results

@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    # For now, we take the first user from DB as the owner since auth is simple
    statement = select(User)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found to assign document to")
    
    try:
        content_bytes = await file.read()
        
        # 1. Convert to markdown
        markdown_text = convert_to_markdown(content_bytes, file.filename)
        
        # 2. Save Document record
        new_doc = Document(
            name=file.filename,
            user_id=user.id
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
        session.commit()
        
        return {
            "id": new_doc.id,
            "name": new_doc.name,
            "message": "File uploaded and converted successfully"
        }
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")