from typing import Optional, List
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
    current_plan: str = Field(default="free")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str
    plan: Optional[str] = Field(default="free")

class UserLogin(SQLModel):
    username: str
    password: str

class UserRead(UserBase):
    id: UUID
    current_plan: str
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

# Datasets
class DatasetDocuments(SQLModel, table=True):
    __tablename__ = "dataset_documents"
    dataset_id: UUID = Field(foreign_key="datasets.id", primary_key=True)
    document_id: UUID = Field(foreign_key="documents.id", primary_key=True)

class DatasetBase(SQLModel):
    name: str = Field(index=True)
    user_id: UUID = Field(foreign_key="users.id")

class Dataset(DatasetBase, table=True):
    __tablename__ = "datasets"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DatasetCreate(SQLModel):
    name: str
    document_ids: List[UUID]

class DatasetRead(DatasetBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

# Chatbots
class ChatbotDatasets(SQLModel, table=True):
    __tablename__ = "chatbot_datasets"
    chatbot_id: UUID = Field(foreign_key="chatbots.id", primary_key=True)
    dataset_id: UUID = Field(foreign_key="datasets.id", primary_key=True)

class ChatbotBase(SQLModel):
    name: str = Field(index=True)
    user_id: UUID = Field(foreign_key="users.id")
    system_prompt: str = Field(default="You are a helpful AI assistant.")
    temperature: float = Field(default=0.7)

class Chatbot(ChatbotBase, table=True):
    __tablename__ = "chatbots"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ChatbotCreate(SQLModel):
    name: str
    dataset_ids: List[UUID]
    system_prompt: Optional[str] = None
    temperature: Optional[float] = 0.7

class ChatbotRead(ChatbotBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

# API Configs
class PlatformAPIKey(SQLModel, table=True):
    __tablename__ = "platform_api_keys"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    provider: str
    api_key: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserAPIKeyBase(SQLModel):
    provider: str
    is_active: bool = Field(default=True)

class UserAPIKey(UserAPIKeyBase, table=True):
    __tablename__ = "user_api_keys"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    api_key: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserAPIKeyCreate(SQLModel):
    provider: str
    api_key: str

class UserAPIKeyRead(UserAPIKeyBase):
    id: UUID
    user_id: UUID
    created_at: datetime

# Usage Tracking
class UsageTracking(SQLModel, table=True):
    __tablename__ = "usage_tracking"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    chatbot_id: Optional[UUID] = Field(default=None, foreign_key="chatbots.id")
    message_count: int = Field(default=0)
    token_count: int = Field(default=0)
    reset_date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Pricing Plans
class UserPricingPlan(SQLModel, table=True):
    __tablename__ = "user_pricing_plans"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    plan_name: str = Field(default="free")
    status: str = Field(default="active")
    started_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
