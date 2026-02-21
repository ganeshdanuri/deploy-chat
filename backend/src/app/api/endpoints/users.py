from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.api.deps import get_current_user
from app.core.db import get_session
from app.schemas.models import User, UsageTracking, PricingTier, UserPricingPlan, RecentActivity, RecentActivityRead
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
    # 1. Fetch Plan Details from UserPricingPlan
    plan_name = "free"
    monthly_limit = 10
    started_at = current_user.created_at
    expires_at = None
    
    plan_stmt = select(UserPricingPlan, PricingTier).join(PricingTier).where(
        UserPricingPlan.user_id == current_user.id,
        UserPricingPlan.status == "active"
    )
    plan_result = session.exec(plan_stmt).first()
    
    if plan_result:
        user_plan, tier = plan_result
        plan_name = tier.name
        monthly_limit = tier.monthly_limit
        started_at = user_plan.started_at
        expires_at = user_plan.expires_at
    
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
            "started_at": started_at,
            "expires_at": expires_at
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
