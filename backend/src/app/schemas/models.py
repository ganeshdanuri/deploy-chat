from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from datetime import datetime

class UserBase(SQLModel):
    username: str = Field(unique=True, index=True)
    role: Optional[str] = Field(default=None)

class User(UserBase, table=True):
    __tablename__ = "users"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str

class UserLogin(SQLModel):
    username: str
    password: str

class UserRead(UserBase):
    id: UUID
    created_at: datetime

class DocumentBase(SQLModel):
    name: str = Field(index=True)
    location_url: Optional[str] = Field(default=None)
    user_id: UUID = Field(foreign_key="users.id")

class Document(DocumentBase, table=True):
    __tablename__ = "documents"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentContent(SQLModel, table=True):
    __tablename__ = "document_contents"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    document_id: UUID = Field(foreign_key="documents.id", ondelete="CASCADE")
    markdown_content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentRead(DocumentBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
