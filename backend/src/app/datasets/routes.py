from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from uuid import UUID
from app.core.db import get_session
from app.api.deps import get_current_user
from app.schemas.models import Dataset, DatasetCreate, DatasetUpdate, DatasetRead, DatasetDocuments, User, Document
from app.core.endpoints import Endpoints
from app.core.constants import ACTIVITY_TYPE_DATASET_CREATED

router = APIRouter(prefix=Endpoints.DATASETS_PREFIX)

@router.get(Endpoints.DATASETS_BASE, response_model=List[DatasetRead])
def get_datasets(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Dataset).where(Dataset.user_id == current_user.id)
    results = session.exec(statement).all()
    return results

@router.post(Endpoints.DATASETS_BASE, response_model=DatasetRead)
def create_dataset(
    dataset_in: DatasetCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        # 1. Create Dataset record
        new_dataset = Dataset(
            name=dataset_in.name,
            user_id=current_user.id
        )
        session.add(new_dataset)
        session.commit()
        session.refresh(new_dataset)
        
        # 2. Link documents
        for doc_id in dataset_in.document_ids:
            # Verify document exists and belongs to user
            doc = session.get(Document, doc_id)
            if not doc or doc.user_id != current_user.id:
                continue
                
            link = DatasetDocuments(
                dataset_id=new_dataset.id,
                document_id=doc_id
            )
            session.add(link)
            
        from app.schemas.models import RecentActivity
        activity = RecentActivity(
            user_id=current_user.id,
            activity_type=ACTIVITY_TYPE_DATASET_CREATED,
            details=f"Created dataset: {new_dataset.name}"
        )
        session.add(activity)

        session.commit()
        session.refresh(new_dataset)
        return new_dataset
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create dataset. Please try again later."
        )

@router.patch(Endpoints.DATASETS_BY_ID, response_model=DatasetRead)
def update_dataset(
    dataset_id: UUID,
    dataset_in: DatasetUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    dataset = session.get(Dataset, dataset_id)
    if not dataset or dataset.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    update_data = dataset_in.model_dump(exclude_unset=True)
    
    # Handle documents update
    if "document_ids" in update_data:
        document_ids = update_data.pop("document_ids")
        # Clear existing links
        stmt = select(DatasetDocuments).where(DatasetDocuments.dataset_id == dataset.id)
        existing_links = session.exec(stmt).all()
        for link in existing_links:
            session.delete(link)
        
        # Add new links
        for doc_id in document_ids:
            doc = session.get(Document, doc_id)
            if not doc or doc.user_id != current_user.id:
                continue
            link = DatasetDocuments(dataset_id=dataset.id, document_id=doc_id)
            session.add(link)

    # Update other fields
    for key, value in update_data.items():
        setattr(dataset, key, value)
        
    from datetime import datetime
    dataset.updated_at = datetime.utcnow()
    session.add(dataset)
    session.commit()
    session.refresh(dataset)
    return dataset

@router.delete(Endpoints.DATASETS_BY_ID)

def delete_dataset(
    dataset_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    dataset = session.get(Dataset, dataset_id)
    if not dataset or dataset.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Delete the dataset (DatasetDocuments and ChatbotDatasets link will be cascaded by DB)
    session.delete(dataset)
    session.commit()
    return {"message": "Dataset deleted successfully"}
