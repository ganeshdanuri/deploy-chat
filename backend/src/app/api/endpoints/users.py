from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.api.deps import get_current_user
from app.core.db import get_session
from app.schemas.models import User, UsageTracking, PricingTier, RecentActivity, RecentActivityRead
from typing import Optional, List

router = APIRouter(prefix="/users")

@router.get("/me")
async def get_user_me(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Fetch comprehensive information about the current user,
    including general profile, billing status, and usage metrics.
    """
    # 1. Fetch Plan Details from PricingTier
    plan_name = "free"
    monthly_limit = 100
    if current_user.plan_id:
        plan = session.get(PricingTier, current_user.plan_id)
        if plan:
            plan_name = plan.name
            monthly_limit = plan.monthly_limit
    
    # 2. Fetch Aggregated Usage
    usage_statement = select(UsageTracking).where(UsageTracking.user_id == current_user.id)
    usage_info = session.exec(usage_statement).first()
    
    return {
        "profile": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "role": current_user.role,
            "created_at": current_user.created_at
        },
        "billing": {
            "current_plan": plan_name,
            "monthly_limit": monthly_limit,
            "plan_status": "active",
            "started_at": current_user.created_at,
            "expires_at": None
        },
        "usage": {
            "messages_sent": usage_info.message_count if usage_info else 0,
            "tokens_consumed": usage_info.token_count if usage_info else 0,
            "reset_date": usage_info.reset_date if usage_info else None
        }
    }

@router.get("/recent-activity", response_model=List[RecentActivityRead])
async def get_recent_activity(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Fetch the latest 3 recent activities for the user.
    """
    statement = select(RecentActivity).where(RecentActivity.user_id == current_user.id).order_by(RecentActivity.created_at.desc()).limit(3)
    results = session.exec(statement).all()
    return results
