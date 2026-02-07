from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from app.core.db import get_session
from app.core.security import decode_token
from app.schemas.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user_id = decode_token(token)
    if user_id is None:
        raise credentials_exception
        
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    
    if user is None:
        raise credentials_exception
        
    return user
