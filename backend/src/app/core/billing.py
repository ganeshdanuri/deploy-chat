from sqlmodel import Session, select
from fastapi import HTTPException, status
from app.schemas.models import User, UsageTracking, PricingTier
from datetime import datetime, timezone

def verify_plan_limits(user: User, session: Session):
    # 1. Get user tracking record
    statement = select(UsageTracking).where(UsageTracking.user_id == user.id)
    usage = session.exec(statement).first()
    
    if not usage:
        # Create usage record if doesn't exist
        usage = UsageTracking(user_id=user.id)
        session.add(usage)
        session.commit()
        session.refresh(usage)
        
    # 2. Get Limits from PricingTier via plan_id
    plan_name = "free"
    limit = 100 # Safe default
    if user.plan_id:
        plan = session.get(PricingTier, user.plan_id)
        if plan:
            plan_name = plan.name
            limit = plan.monthly_limit
    
    if usage.message_count >= limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Usage limit reached for your {plan_name} plan ({limit} messages). Please upgrade to continue."
        )
    
    return usage

def increment_usage(usage: UsageTracking, session: Session, token_count: int = 0):
    usage.message_count += 1
    
    # Check for limits (50%, 80%)
    user = session.get(User, usage.user_id)
    if user:
        limit = 100
        if user.plan_id:
            plan = session.get(PricingTier, user.plan_id)
            if plan:
                limit = plan.monthly_limit
        
        from app.schemas.models import RecentActivity
        old_count = usage.message_count - 1
        new_count = usage.message_count
        
        for threshold in [0.5, 0.8]:
            limit_val = int(limit * threshold)
            if old_count < limit_val and new_count >= limit_val:
                activity = RecentActivity(
                    user_id=user.id,
                    activity_type="message_limit_warning",
                    details=f"Usage hit {int(threshold * 100)}% of your monthly limit"
                )
                session.add(activity)

    usage.token_count += token_count
    usage.updated_at = datetime.now(timezone.utc)
    session.add(usage)
    session.commit()
    session.refresh(usage)
