from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api.deps import get_current_user
from app.core.db import get_session
from app.schemas.models import User, UsageTracking, UserPricingPlan, RecentActivity, RecentActivityRead, UserUpdate
from app.core.constants import STATUS_ACTIVE
from typing import List
from app.core.endpoints import Endpoints

router = APIRouter(prefix=Endpoints.USERS_PREFIX)

@router.get(Endpoints.USERS_ME)
async def get_user_me(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Fetch comprehensive information about the current user,
    including general profile, billing status, and usage metrics.
    """
    # 1. Fetch Plan Details from UserPricingPlan
    from app.core.billing import get_user_plan

    plan_name, monthly_limit = get_user_plan(current_user.id, session)
    
    # We also need started_at and expires_at, let's fetch those directly
    started_at = current_user.created_at
    expires_at = None
    
    plan_stmt = select(UserPricingPlan).where(
        UserPricingPlan.user_id == current_user.id,
        UserPricingPlan.status == STATUS_ACTIVE
    )
    user_plan = session.exec(plan_stmt).first()
    
    if user_plan:
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
            "plan_status": STATUS_ACTIVE,
            "started_at": started_at,
            "expires_at": expires_at
        },
        "usage": {
            "messages_sent": usage_info.message_count if usage_info else 0,
            "tokens_consumed": usage_info.token_count if usage_info else 0,
            "reset_date": usage_info.reset_date if usage_info else None
        }
    }
@router.patch(Endpoints.USERS_ME)
async def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update current user's profile.
    """
    if user_in.username:
        # Check if username exists
        stmt = select(User).where(User.username == user_in.username, User.id != current_user.id)
        if session.exec(stmt).first():
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = user_in.username
    
    if user_in.email:
        # Check if email exists
        stmt = select(User).where(User.email == user_in.email, User.id != current_user.id)
        if session.exec(stmt).first():
            raise HTTPException(status_code=400, detail="Email already taken")
        current_user.email = user_in.email
    
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return {"status": "success"}


@router.get(Endpoints.USERS_RECENT_ACTIVITY, response_model=List[RecentActivityRead])
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
