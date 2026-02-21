from sqlmodel import Session, select
from fastapi import HTTPException, status
from app.schemas.models import User, UsageTracking, PricingTier, UserPricingPlan
from app.core.constants import DEFAULT_PLAN_NAME, DEFAULT_FREE_PLAN_LIMIT, STATUS_ACTIVE
from datetime import datetime, timezone
from uuid import UUID

def get_user_plan(user_id: UUID, session: Session) -> tuple[str, int]:
    plan_name = DEFAULT_PLAN_NAME
    limit = DEFAULT_FREE_PLAN_LIMIT
    plan_stmt = select(UserPricingPlan, PricingTier).join(PricingTier).where(
        UserPricingPlan.user_id == user_id,
        UserPricingPlan.status == STATUS_ACTIVE
    )
    plan_result = session.exec(plan_stmt).first()
    
    if plan_result:
        plan_name = plan_result[1].name
        limit = plan_result[1].monthly_limit
        
    return plan_name, limit

def assign_free_tier(user_id: int, session: Session):
    plan_statement = select(PricingTier).where(PricingTier.name == DEFAULT_PLAN_NAME.capitalize())
    free_plan = session.exec(plan_statement).first()
    if free_plan:
        active_plan = UserPricingPlan(
            user_id=user_id,
            tier_id=free_plan.id,
            status=STATUS_ACTIVE
        )
        session.add(active_plan)

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
        
    # 2. Get Limits from UserPricingPlan via User
    plan_name, limit = get_user_plan(user.id, session)
    
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
        _, limit = get_user_plan(user.id, session)
        
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
