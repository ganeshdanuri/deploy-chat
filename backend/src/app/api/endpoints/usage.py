from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.core.db import get_session
from app.api.deps import get_current_user
from app.schemas.models import User, UsageTracking

router = APIRouter(prefix="/usage")

@router.get("/stats")
def get_usage_stats(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get aggregated usage statistics for the current user.
    """
    statement = select(UsageTracking).where(UsageTracking.user_id == current_user.id)
    usage = session.exec(statement).first()
    
    if not usage:
        return {
            "message_count": 0,
            "token_count": 0
        }
        
    return {
        "message_count": usage.message_count,
        "token_count": usage.token_count
    }
