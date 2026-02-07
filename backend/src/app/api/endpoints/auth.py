from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.db import get_session
from app.core.security import create_access_token
from app.schemas.models import User, UserCreate, UserLogin, UserRead

router = APIRouter(prefix="/auth")

@router.post("/register")
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    statement = select(User).where(User.username == user_data.username)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    new_user = User(
        username=user_data.username,
        password_hash=user_data.password, 
        role=user_data.role
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    access_token = create_access_token(subject=new_user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": new_user.username
    }

@router.post("/login")
def login(login_data: UserLogin, session: Session = Depends(get_session)):
    statement = select(User).where(User.username == login_data.username)
    user = session.exec(statement).first()
    
    if not user or user.password_hash != login_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username
    }
