from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlmodel import Session, select
from app.core.db import get_session
from app.core.security import (create_access_token, create_refresh_token, decode_token, decode_refresh_token,
                               refresh_token_is_active, revoke_refresh_token, verify_password, get_password_hash)
from app.schemas.models import User, UserCreate, UserLogin, GoogleLogin, GitHubLogin, EmailVerification
from datetime import datetime, timedelta, timezone
import random
import secrets
import httpx
from pydantic import BaseModel
from app.core.emails import send_otp_email
from app.core.billing import get_user_plan, assign_free_tier
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from app.core.limiter import limiter
from app.core.endpoints import Endpoints

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

router = APIRouter(prefix=Endpoints.AUTH_PREFIX)

class OTPVerify(BaseModel):
    email: str
    otp_code: str

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post(Endpoints.AUTH_REGISTER)
@limiter.limit("5/minute")
def register(request: Request, user_data: UserCreate, session: Session = Depends(get_session)):
    # 1. Check if email exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        if existing_user.is_email_verified:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if username is taken by another user
        user_stmt = select(User).where(User.username == user_data.username)
        username_user = session.exec(user_stmt).first()
        if username_user and username_user.id != existing_user.id:
            raise HTTPException(status_code=400, detail="Username already registered")
            
        # Update unverified user
        existing_user.username = user_data.username
        existing_user.password_hash = get_password_hash(user_data.password)
        existing_user.role = user_data.role
        new_user = existing_user
    else:
        # Check if username exists for new registration
        statement = select(User).where(User.username == user_data.username)
        if session.exec(statement).first():
            raise HTTPException(status_code=400, detail="Username already registered")
            
        # 2. Create user (unverified)
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=get_password_hash(user_data.password), 
            role=user_data.role,
            is_email_verified=False
        )
    
    session.add(new_user)
    
    # 3. Clean up old OTPs for this email
    old_otp_stmt = select(EmailVerification).where(EmailVerification.email == user_data.email)
    old_otps = session.exec(old_otp_stmt).all()
    for old_otp in old_otps:
        session.delete(old_otp)
    
    # 4. Generate & Save New OTP
    # secrets, not random: Mersenne Twister output is predictable from prior
    # draws, and this code is the only thing guarding account verification.
    otp_code = f"{secrets.randbelow(1_000_000):06d}"
    verification = EmailVerification(
        email=user_data.email,
        otp_code=otp_code,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
    )
    session.add(verification)
    session.commit()
    
    # 5. Send OTP Email via Resend
    send_otp_email(user_data.email, otp_code)
    
    return {
        "message": "Registration successful. Please verify your email with the OTP sent.",
        "email": user_data.email
    }

@router.post(Endpoints.AUTH_VERIFY_OTP)
@limiter.limit("5/minute")
def verify_otp(request: Request, data: OTPVerify, session: Session = Depends(get_session)):
    # 1. Check OTP
    statement = select(EmailVerification).where(
        EmailVerification.email == data.email,
        EmailVerification.otp_code == data.otp_code
    )
    verification = session.exec(statement).first()
    
    if not verification or verification.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # 2. Mark user as verified
    statement = select(User).where(User.email == data.email)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 3. Assign Free Tier
    assign_free_tier(user.id, session)
        
    user.is_email_verified = True
    session.add(user)
    
    # 4. Delete OTP record
    session.delete(verification)
    session.commit()
    
    # 5. Generate token (use plan name in token)
    plan_name, _ = get_user_plan(user.id, session)
    plan_name = plan_name.lower()
        
    access_token = create_access_token(subject=user.id, plan=plan_name)
    refresh_token = create_refresh_token(subject=user.id)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "username": user.username,
        "email": user.email,
        "current_plan": plan_name
    }

@router.post(Endpoints.AUTH_LOGIN)
@limiter.limit("5/minute")
def login(request: Request, login_data: UserLogin, session: Session = Depends(get_session)):
    # Login via email as requested
    statement = select(User).where(User.email == login_data.email)
    user = session.exec(statement).first()
    
    if user and user.google_id and not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is registered via Google. Please log in using Google."
        )
        
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email first."
        )
    
    plan_name, _ = get_user_plan(user.id, session)
    plan_name = plan_name.lower()
        
    access_token = create_access_token(subject=user.id, plan=plan_name)
    refresh_token = create_refresh_token(subject=user.id)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "username": user.username,
        "email": user.email,
        "current_plan": plan_name
    }

@router.post(Endpoints.AUTH_GOOGLE)
def google_login(data: GoogleLogin, session: Session = Depends(get_session)):
    try:
        # Support both id_token (credential) and access_token flows
        if data.credential.startswith("ya29.") or len(data.credential) < 100:
            # Looks like an access_token — verify via userinfo endpoint
            resp = httpx.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {data.credential}"},
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid Google access token")
            idinfo = resp.json()
            email = idinfo["email"]
            google_id = idinfo["sub"]
            picture = idinfo.get("picture")
        else:
            # id_token — verify with google-auth library
            idinfo = id_token.verify_oauth2_token(data.credential, requests.Request(), GOOGLE_CLIENT_ID)
            email = idinfo["email"]
            google_id = idinfo["sub"]
            picture = idinfo.get("picture")
        
        # 2. Check if user exists by email or google_id
        statement = select(User).where((User.email == email) | (User.google_id == google_id))
        user = session.exec(statement).first()
        
        if user:
            # Strict match requirement for security
            if user.email != email or user.google_id != google_id:
                if user.google_id is None:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This email is registered with a password. Please log in using your password.")
                else:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account credentials mismatch. Please use the correct Google account.")
                    
        if not user:
            # 3. Create new user if not exists
            # Generate a unique username if needed
            username = email.split('@')[0]
            existing_user_stmt = select(User).where(User.username == username)
            if session.exec(existing_user_stmt).first():
                username = f"{username}_{random.randint(100, 999)}"
                
            user = User(
                username=username,
                email=email,
                google_id=google_id,
                profile_image=picture,
                is_email_verified=True # Google already verified
            )
            
            # Assign Free Tier
            assign_free_tier(user.id, session)
                
            session.add(user)
            session.commit()
            session.refresh(user)
        else:
            # 4. Update existing user info if needed
            user.google_id = google_id
            if picture:
                user.profile_image = picture
            user.is_email_verified = True
            session.add(user)
            session.commit()
            session.refresh(user)
            
        # 5. Generate token
        plan_name, _ = get_user_plan(user.id, session)
        plan_name = plan_name.lower()
            
        access_token = create_access_token(subject=user.id, plan=plan_name)
        refresh_token = create_refresh_token(subject=user.id)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "username": user.username,
            "email": user.email,
            "current_plan": plan_name,
            "profile_image": user.profile_image
        }
    except ValueError:
        # Invalid token
        raise HTTPException(status_code=400, detail="Invalid Google token")

@router.post(Endpoints.AUTH_REFRESH)
@limiter.limit("20/minute")
def refresh_token(request: Request, data: RefreshRequest, session: Session = Depends(get_session)):
    payload = decode_refresh_token(data.refresh_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    user_id = payload.get("sub")

    # A signature-valid token is not enough: it must still be one we issued and
    # have not revoked. Without this, a stolen token works for its full lifetime.
    if not refresh_token_is_active(session, payload):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked"
        )
        
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    plan_name, _ = get_user_plan(user.id, session)
    plan_name = plan_name.lower()
        
    # Rotate: the presented token dies with this exchange, so a leaked copy is
    # useful only until the legitimate client next refreshes.
    revoke_refresh_token(session, payload)

    new_access_token = create_access_token(subject=user.id, plan=plan_name)
    new_refresh_token = create_refresh_token(subject=user.id)

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


@router.post(Endpoints.AUTH_LOGOUT)
@limiter.limit("20/minute")
def logout(request: Request, data: RefreshRequest, session: Session = Depends(get_session)):
    """
    Server-side logout. Clearing localStorage alone left the refresh token
    valid for its full window, so a copy captured beforehand still worked.
    """
    payload = decode_refresh_token(data.refresh_token)
    if payload:
        revoke_refresh_token(session, payload)
    # Always 200: whether the token was valid isn't the caller's business.
    return {"message": "Logged out"}


@router.post(Endpoints.AUTH_GITHUB)
def github_login(data: GitHubLogin, session: Session = Depends(get_session)):
    # 1. Exchange code for access token
    token_resp = httpx.post(
        "https://github.com/login/oauth/access_token",
        json={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": data.code,
        },
        headers={"Accept": "application/json"},
    )
    token_data = token_resp.json()
    gh_access_token = token_data.get("access_token")
    if not gh_access_token:
        raise HTTPException(status_code=400, detail="GitHub OAuth failed: could not exchange code")

    # 2. Fetch GitHub user profile
    user_resp = httpx.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {gh_access_token}", "Accept": "application/json"},
    )
    gh_user = user_resp.json()
    github_id = str(gh_user.get("id"))
    picture = gh_user.get("avatar_url")
    login_name = gh_user.get("login", "")

    # 3. Fetch primary verified email
    emails_resp = httpx.get(
        "https://api.github.com/user/emails",
        headers={"Authorization": f"Bearer {gh_access_token}", "Accept": "application/json"},
    )
    emails = emails_resp.json()
    email = next(
        (e["email"] for e in emails if e.get("primary") and e.get("verified")),
        None,
    )
    if not email:
        raise HTTPException(status_code=400, detail="No verified email found on GitHub account")

    # 4. Find or create user
    statement = select(User).where((User.email == email) | (User.github_id == github_id))
    user = session.exec(statement).first()

    if not user:
        username = login_name or email.split("@")[0]
        existing = session.exec(select(User).where(User.username == username)).first()
        if existing:
            username = f"{username}_{random.randint(100, 999)}"

        user = User(
            username=username,
            email=email,
            github_id=github_id,
            profile_image=picture,
            is_email_verified=True,
        )
        assign_free_tier(user.id, session)
        session.add(user)
        session.commit()
        session.refresh(user)
    else:
        user.github_id = github_id
        if picture:
            user.profile_image = picture
        user.is_email_verified = True
        session.add(user)
        session.commit()
        session.refresh(user)

    # 5. Return tokens
    plan_name, _ = get_user_plan(user.id, session)
    plan_name = plan_name.lower()
    access_token = create_access_token(subject=user.id, plan=plan_name)
    refresh_token = create_refresh_token(subject=user.id)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "username": user.username,
        "email": user.email,
        "current_plan": plan_name,
        "profile_image": user.profile_image,
    }
