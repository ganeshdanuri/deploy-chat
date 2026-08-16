import bcrypt
import jwt
import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID, uuid4
from app.core.constants import ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, DEFAULT_PLAN_NAME

# A published fallback secret means anyone with the source can mint valid
# tokens for any account, so refuse to boot with one outside local dev.
_DEV_FALLBACK_SECRET = "your-secret-key-change-this-in-production"
_INSECURE_SECRETS = {_DEV_FALLBACK_SECRET, "change-me-in-production", ""}

SECRET_KEY = os.getenv("SECRET_KEY", "")

if SECRET_KEY.strip() in _INSECURE_SECRETS:
    if os.getenv("ENVIRONMENT", "development").lower() in ("development", "local", "test"):
        SECRET_KEY = _DEV_FALLBACK_SECRET
    else:
        raise RuntimeError(
            "SECRET_KEY is unset or still the placeholder value. Set a strong, "
            "random SECRET_KEY (e.g. `openssl rand -hex 32`) before starting in "
            f"ENVIRONMENT={os.getenv('ENVIRONMENT')}."
        )

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # Bcrypt has a 72-byte limit. Truncate AFTER encoding to bytes.
        return bcrypt.checkpw(
            plain_password.encode("utf-8")[:72],
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    # Bcrypt has a 72-byte limit. Truncate AFTER encoding to bytes.
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")

def create_access_token(subject: str | UUID, plan: str = DEFAULT_PLAN_NAME, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject), "plan": plan, "type": "access"}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(
    subject: str | UUID,
    expires_delta: Optional[timedelta] = None,
    session=None,   # accepted for call-site compatibility; no longer used
) -> str:
    """
    Issues a refresh token carrying a jti and iat.

    Nothing is written on issue. Under the denylist model the signature proves
    provenance, so only revocations need storage — see revoke_refresh_token.
    """
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))

    to_encode = {
        "exp": expire,
        "iat": now,
        "sub": str(subject),
        "type": "refresh",
        "jti": str(uuid4()),
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_refresh_token(token: str) -> Optional[dict]:
    """Returns the full refresh payload (sub, jti, iat) or None."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            return None
        return payload
    except (jwt.PyJWTError, AttributeError):
        return None


def refresh_token_is_active(session, payload: Optional[dict]) -> bool:
    """
    Valid unless explicitly revoked.

    Two ways a token dies early: its own jti is on the denylist, or it was
    issued before the user's `sessions_valid_from` cut-off (bulk revocation).
    """
    if not payload:
        return False

    jti = payload.get("jti")
    if not jti:
        return False

    from app.schemas.models import RevokedRefreshToken, User

    if session.get(RevokedRefreshToken, UUID(jti)) is not None:
        return False

    user = session.get(User, UUID(str(payload.get("sub"))))
    if user is None:
        return False

    cutoff = getattr(user, "sessions_valid_from", None)
    if cutoff is not None:
        issued_at = payload.get("iat")
        # Tokens minted before the cut-off (or with no iat at all, i.e. issued
        # by an older build) are treated as pre-cutoff and refused.
        if issued_at is None or datetime.utcfromtimestamp(issued_at) < cutoff:
            return False

    return True


def revoke_refresh_token(session, payload: Optional[dict]) -> None:
    """Adds one row. Called on rotation and logout."""
    if not payload:
        return
    jti = payload.get("jti")
    sub = payload.get("sub")
    exp = payload.get("exp")
    if not jti or not sub or not exp:
        return

    from app.schemas.models import RevokedRefreshToken

    if session.get(RevokedRefreshToken, UUID(jti)) is not None:
        return

    session.add(RevokedRefreshToken(
        jti=UUID(jti),
        user_id=UUID(str(sub)),
        expires_at=datetime.utcfromtimestamp(exp),
    ))
    session.commit()


def revoke_all_refresh_tokens(session, user_id) -> None:
    """
    Bulk revocation without enumerating tokens: move the user's cut-off to now,
    which invalidates every refresh token issued before this moment.
    """
    from app.schemas.models import User

    user = session.get(User, UUID(str(user_id)))
    if not user:
        return
    user.sessions_valid_from = datetime.now(timezone.utc).replace(tzinfo=None)
    session.add(user)
    session.commit()


def purge_expired_revocations(session) -> int:
    """Denylist entries are pointless once the token would expire anyway."""
    from sqlmodel import select
    from app.schemas.models import RevokedRefreshToken

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    rows = session.exec(
        select(RevokedRefreshToken).where(RevokedRefreshToken.expires_at < now)
    ).all()
    for row in rows:
        session.delete(row)
    session.commit()
    return len(rows)


def decode_token(token: str, verify_type: str = "access") -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type", "access") != verify_type:
            return None
        return payload.get("sub")
    except (jwt.PyJWTError, AttributeError):
        return None
