from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.api.deps import get_current_user
from app.core.db import get_session
from app.schemas.models import User, UserAPIKey, UserAPIKeyCreate, UserAPIKeyRead
from app.core.endpoints import Endpoints
from typing import List
from uuid import UUID
from datetime import datetime

router = APIRouter(prefix=Endpoints.API_KEYS_PREFIX)

@router.post(Endpoints.API_KEYS_BASE, response_model=UserAPIKeyRead)
async def create_api_key(
    key_in: UserAPIKeyCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new API key for the current user.
    """
    db_key = UserAPIKey(
        user_id=current_user.id,
        provider=key_in.provider,
        api_key=key_in.api_key,
        is_active=True
    )
    session.add(db_key)
    session.commit()
    session.refresh(db_key)
    return db_key

@router.get(Endpoints.API_KEYS_BASE, response_model=List[UserAPIKeyRead])
async def list_api_keys(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    List all API keys for the current user.
    """
    statement = select(UserAPIKey).where(UserAPIKey.user_id == current_user.id)
    results = session.exec(statement).all()
    return results

@router.delete(Endpoints.API_KEYS_BY_ID)
async def delete_api_key(
    key_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete an API key.
    """
    statement = select(UserAPIKey).where(UserAPIKey.id == key_id, UserAPIKey.user_id == current_user.id)
    db_key = session.exec(statement).first()
    if not db_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    session.delete(db_key)
    session.commit()
    return {"status": "success"}
