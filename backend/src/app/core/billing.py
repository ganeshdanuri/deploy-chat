from sqlmodel import Session, select
from fastapi import HTTPException, status
from app.schemas.models import User, UsageTracking
from datetime import datetime

PLAN_LIMITS = {
    "trial": 50,
    "free": 10,
    "professional": 5000,
    "enterprise": 999999
}

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
        
    # 2. Check limits based on current_plan
    plan = user.current_plan or "free"
    limit = PLAN_LIMITS.get(plan, 0)
    
    if usage.message_count >= limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Usage limit reached for your {plan} plan ({limit} messages). Please upgrade to continue."
        )
    
    return usage

def increment_usage(usage: UsageTracking, session: Session):
    usage.message_count += 1
    usage.updated_at = datetime.utcnow()
    session.add(usage)
    session.commit()
    session.refresh(usage)
