"""
Analytics over real widget traffic.

Only reports what is actually measured. Resolution rate, response latency and
"knowledge gaps" are deliberately absent — nothing in the pipeline records the
signals they'd need, and inventing them is worse than omitting them.

Playground chats are intentionally excluded: they never create a ChatSession,
so these numbers reflect real end users rather than the owner's own testing.
"""
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, func

from app.api.deps import get_current_user
from app.core.db import get_session
from app.core.endpoints import Endpoints
from app.schemas.models import Chatbot, ChatMessage, ChatSession, User

router = APIRouter(prefix=Endpoints.ANALYTICS_PREFIX)

RANGE_DAYS = {"7d": 7, "30d": 30, "90d": 90}


def _window(range_key: str) -> tuple[datetime, int]:
    days = RANGE_DAYS.get(range_key)
    if days is None:
        raise HTTPException(status_code=400, detail="range must be one of 7d, 30d, 90d")
    start = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    ) - timedelta(days=days - 1)
    return start, days


def _owned_chatbot_ids(session: Session, user: User) -> List[UUID]:
    return list(session.exec(select(Chatbot.id).where(Chatbot.user_id == user.id)).all())


def _empty_series(start: datetime, days: int) -> List[dict]:
    """Every day in the window, so the chart has no gaps to guess at."""
    return [
        {"date": (start + timedelta(days=i)).strftime("%Y-%m-%d"), "conversations": 0, "messages": 0}
        for i in range(days)
    ]


def _collect(session: Session, chatbot_ids: List[UUID], start: datetime, days: int) -> dict:
    if not chatbot_ids:
        return {
            "totals": {"conversations": 0, "messages": 0, "unique_visitors": 0},
            "series": _empty_series(start, days),
        }

    sessions_in_range = select(ChatSession.id).where(
        ChatSession.chatbot_id.in_(chatbot_ids),
        ChatSession.created_at >= start,
    )

    conversations = session.exec(
        select(func.count()).select_from(sessions_in_range.subquery())
    ).one()

    messages = session.exec(
        select(func.count(ChatMessage.id)).where(
            ChatMessage.session_id.in_(sessions_in_range),
            ChatMessage.created_at >= start,
        )
    ).one()

    unique_visitors = session.exec(
        select(func.count(func.distinct(ChatSession.ip_address))).where(
            ChatSession.chatbot_id.in_(chatbot_ids),
            ChatSession.created_at >= start,
            ChatSession.ip_address.is_not(None),
        )
    ).one()

    # Daily buckets
    buckets = {row["date"]: row for row in _empty_series(start, days)}

    convo_rows = session.exec(
        select(func.date(ChatSession.created_at), func.count(ChatSession.id))
        .where(ChatSession.chatbot_id.in_(chatbot_ids), ChatSession.created_at >= start)
        .group_by(func.date(ChatSession.created_at))
    ).all()
    for day, count in convo_rows:
        key = str(day)
        if key in buckets:
            buckets[key]["conversations"] = count

    msg_rows = session.exec(
        select(func.date(ChatMessage.created_at), func.count(ChatMessage.id))
        .where(
            ChatMessage.session_id.in_(sessions_in_range),
            ChatMessage.created_at >= start,
        )
        .group_by(func.date(ChatMessage.created_at))
    ).all()
    for day, count in msg_rows:
        key = str(day)
        if key in buckets:
            buckets[key]["messages"] = count

    return {
        "totals": {
            "conversations": conversations or 0,
            "messages": messages or 0,
            "unique_visitors": unique_visitors or 0,
        },
        "series": list(buckets.values()),
    }


@router.get(Endpoints.ANALYTICS_BASE)
def get_analytics(
    range: str = Query("7d"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    start, days = _window(range)
    chatbots = session.exec(select(Chatbot).where(Chatbot.user_id == current_user.id)).all()
    chatbot_ids = [cb.id for cb in chatbots]

    result = _collect(session, chatbot_ids, start, days)

    by_agent = []
    for cb in chatbots:
        scoped = _collect(session, [cb.id], start, days)
        by_agent.append({
            "id": str(cb.id),
            "name": cb.name,
            "conversations": scoped["totals"]["conversations"],
            "messages": scoped["totals"]["messages"],
        })
    by_agent.sort(key=lambda a: a["messages"], reverse=True)

    return {"range": range, **result, "by_agent": by_agent}


@router.get(Endpoints.ANALYTICS_BY_CHATBOT)
def get_chatbot_analytics(
    chatbot_id: UUID,
    range: str = Query("7d"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    start, days = _window(range)
    chatbot = session.get(Chatbot, chatbot_id)
    if not chatbot or chatbot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    result = _collect(session, [chatbot_id], start, days)

    # Most recent real conversations, with a preview of how each opened.
    recent = []
    rows = session.exec(
        select(ChatSession)
        .where(ChatSession.chatbot_id == chatbot_id)
        .order_by(ChatSession.created_at.desc())
        .limit(10)
    ).all()
    for cs in rows:
        first = session.exec(
            select(ChatMessage)
            .where(ChatMessage.session_id == cs.id, ChatMessage.role == "user")
            .order_by(ChatMessage.created_at.asc())
            .limit(1)
        ).first()
        count = session.exec(
            select(func.count(ChatMessage.id)).where(ChatMessage.session_id == cs.id)
        ).one()
        recent.append({
            "id": str(cs.id),
            "started_at": cs.created_at.isoformat(),
            "message_count": count or 0,
            "preview": (first.content[:120] if first else None),
        })

    return {"range": range, **result, "recent_conversations": recent}
