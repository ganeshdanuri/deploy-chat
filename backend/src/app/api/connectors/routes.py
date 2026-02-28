from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlmodel import Session, select
from typing import List, Optional
from uuid import UUID
from app.core.db import get_session
from app.api.deps import get_current_user
from app.schemas.models import Connector, User, Document
from app.services.notion import NotionService

router = APIRouter()

@router.get("/", response_model=List[Connector])
def get_connectors(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Connector).where(Connector.user_id == current_user.id)
    return session.exec(statement).all()

@router.post("/")
async def create_connector(
    name: str = Body(...),
    type: str = Body(...), # 'notion'
    config: dict = Body(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    new_connector = Connector(
        name=name,
        type=type,
        config=config,
        user_id=current_user.id
    )
    session.add(new_connector)
    session.commit()
    session.refresh(new_connector)
    
    # Trigger initial sync? Maybe async in background
    # await NotionService.sync_connector(new_connector.id)
    
    return new_connector

@router.get("/{connector_id}")
def get_connector(
    connector_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    connector = session.get(Connector, connector_id)
    if not connector or connector.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Connector not found")
    return connector

@router.delete("/{connector_id}")
def delete_connector(
    connector_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    connector = session.get(Connector, connector_id)
    if not connector or connector.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Connector not found")
    
    session.delete(connector)
    session.commit()
    return {"message": "Connector deleted successfully"}

@router.post("/{connector_id}/sync")
async def sync_connector(
    connector_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    connector = session.get(Connector, connector_id)
    if not connector or connector.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Connector not found")
    
    if connector.type == "notion":
        await NotionService.sync_connector(connector_id)
    else:
        raise HTTPException(status_code=400, detail="Unsupported connector type for sync")
    
    return {"message": "Sync completed"}

@router.get("/notion/pages")
async def list_notion_pages(
    token: str,
    current_user: User = Depends(get_current_user)
):
    pages = await NotionService.list_accessible_pages(token)
    return pages
