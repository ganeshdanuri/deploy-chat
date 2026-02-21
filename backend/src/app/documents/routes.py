from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from app.core.db import get_session
from app.api.deps import get_current_user
from app.schemas.models import Document, DocumentContent, User, DocumentRead
from app.services.converter import convert_to_markdown
from app.core.endpoints import Endpoints

router = APIRouter(prefix=Endpoints.DOCUMENTS_PREFIX)

@router.get(Endpoints.DOCUMENTS_BASE, response_model=List[DocumentRead])
def get_documents(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Document).where(Document.user_id == current_user.id)
    results = session.exec(statement).all()
    return results

@router.post(Endpoints.DOCUMENTS_BASE)
async def upload_documents(
    files: List[UploadFile] = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    from app.core.constants import MAX_DOCUMENT_SIZE_MB
    max_bytes = MAX_DOCUMENT_SIZE_MB * 1024 * 1024
    
    uploaded_docs = []
    
    for file in files:
        try:
            # Check file size
            content_bytes = await file.read()
            if len(content_bytes) > max_bytes:
                raise HTTPException(
                    status_code=status.HTTP_413_PAYLOAD_TOO_LARGE,
                    detail=f"File {file.filename} exceeds maximum size of {MAX_DOCUMENT_SIZE_MB}MB"
                )
            
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
            
            uploaded_docs.append({
                "id": new_doc.id,
                "name": new_doc.name
            })
            
        except HTTPException as he:
            raise he
        except Exception as e:
            session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"Failed to process document {file.filename}: {str(e)}"
            )
            
    return {
        "documents": uploaded_docs,
        "message": f"{len(uploaded_docs)} files uploaded and converted successfully"
    }