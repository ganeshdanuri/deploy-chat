from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.db import get_session
from app.core.security import create_access_token, verify_password, get_password_hash
from app.schemas.models import User, UserCreate, UserLogin, GoogleLogin, UserRead, EmailVerification, PricingTier
from datetime import datetime, timedelta
import random
from pydantic import BaseModel
from app.core.emails import send_otp_email
from google.oauth2 import id_token
from google.auth.transport import requests
import os

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter(prefix="/auth")

class OTPVerify(BaseModel):
    email: str
    otp_code: str

@router.post("/register")
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    # 1. Check if username exists
    statement = select(User).where(User.username == user_data.username)
    if session.exec(statement).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # 2. Check if email exists
    statement = select(User).where(User.email == user_data.email)
    if session.exec(statement).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 3. Create user (unverified)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password), 
        role=user_data.role,
        is_email_verified=False
    )
    session.add(new_user)
    
    # 4. Generate & Save OTP
    otp_code = str(random.randint(100000, 999999))
    verification = EmailVerification(
        email=user_data.email,
        otp_code=otp_code,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    session.add(verification)
    session.commit()
    
    # 5. Send OTP Email via Resend
    send_otp_email(user_data.email, otp_code)
    
    return {
        "message": "Registration successful. Please verify your email with the OTP sent.",
        "email": user_data.email
    }

@router.post("/verify-otp")
def verify_otp(data: OTPVerify, session: Session = Depends(get_session)):
    # 1. Check OTP
    statement = select(EmailVerification).where(
        EmailVerification.email == data.email,
        EmailVerification.otp_code == data.otp_code
    )
    verification = session.exec(statement).first()
    
    if not verification or verification.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # 2. Mark user as verified
    statement = select(User).where(User.email == data.email)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 3. Assign Free Tier
    plan_statement = select(PricingTier).where(PricingTier.name == "Free")
    free_plan = session.exec(plan_statement).first()
    if free_plan:
        user.plan_id = free_plan.id
        
    user.is_email_verified = True
    session.add(user)
    
    # 4. Delete OTP record
    session.delete(verification)
    session.commit()
    
    # 5. Generate token (use plan name in token)
    plan_name = "free"
    if user.plan_id:
        p = session.get(PricingTier, user.plan_id)
        if p: plan_name = p.name.lower()
        
    access_token = create_access_token(subject=user.id, plan=plan_name)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
        "email": user.email,
        "current_plan": plan_name
    }

@router.post("/login")
def login(login_data: UserLogin, session: Session = Depends(get_session)):
    # Login via email as requested
    statement = select(User).where(User.email == login_data.email)
    user = session.exec(statement).first()
    
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
    
    plan_name = "free"
    if user.plan_id:
        p = session.get(PricingTier, user.plan_id)
        if p: plan_name = p.name.lower()
        
    access_token = create_access_token(subject=user.id, plan=plan_name)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
        "email": user.email,
        "current_plan": plan_name
    }

@router.post("/google")
def google_login(data: GoogleLogin, session: Session = Depends(get_session)):
    try:
        # 1. Verify Google Token
        idinfo = id_token.verify_oauth2_token(data.credential, requests.Request(), GOOGLE_CLIENT_ID)
        
        email = idinfo['email']
        google_id = idinfo['sub']
        name = idinfo.get('name', email.split('@')[0])
        picture = idinfo.get('picture')
        
        # 2. Check if user exists by email or google_id
        statement = select(User).where((User.email == email) | (User.google_id == google_id))
        user = session.exec(statement).first()
        
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
            plan_statement = select(PricingTier).where(PricingTier.name == "Free")
            free_plan = session.exec(plan_statement).first()
            if free_plan:
                user.plan_id = free_plan.id
                
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
        plan_name = "free"
        if user.plan_id:
            p = session.get(PricingTier, user.plan_id)
            if p: plan_name = p.name.lower()
            
        access_token = create_access_token(subject=user.id, plan=plan_name)
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "username": user.username,
            "email": user.email,
            "current_plan": plan_name,
            "profile_image": user.profile_image
        }
    except ValueError:
        # Invalid token
        raise HTTPException(status_code=400, detail="Invalid Google token")
