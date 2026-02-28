from typing import Optional, List, Any, Dict
from uuid import UUID, uuid4
from sqlalchemy import Column, JSON
from pgvector.sqlalchemy import Vector
from sqlmodel import Field, SQLModel
from datetime import datetime, timedelta
from app.core.constants import DEFAULT_SYSTEM_PROMPT, DEFAULT_WELCOME_MESSAGE, STATUS_ACTIVE, DEFAULT_PLAN_NAME, CHATBOT_STATUS_CREATING

class PricingTier(SQLModel, table=True):
    __tablename__ = "pricing_tiers"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(unique=True)
    price: float = Field(default=0.0)
    monthly_limit: int = Field(default=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserPricingPlan(SQLModel, table=True):
    __tablename__ = "user_pricing_plans"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    tier_id: UUID = Field(foreign_key="pricing_tiers.id")
    status: str = Field(default=STATUS_ACTIVE)
    started_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = Field(default_factory=lambda: datetime.utcnow() + timedelta(days=30))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserBase(SQLModel):
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    role: Optional[str] = Field(default=None)

class User(UserBase, table=True):
    __tablename__ = "users"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: Optional[str] = Field(default=None)
    google_id: Optional[str] = Field(default=None, unique=True, index=True)
    profile_image: Optional[str] = Field(default=None)
    is_email_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str
    plan: Optional[str] = Field(default=DEFAULT_PLAN_NAME)

class UserLogin(SQLModel):
    email: str
    password: str

class GoogleLogin(SQLModel):
    credential: str

class UserRead(UserBase):
    id: UUID
    is_email_verified: bool
    created_at: datetime

class EmailVerification(SQLModel, table=True):
    __tablename__ = "email_verifications"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(index=True)
    otp_code: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentBase(SQLModel):
    name: str = Field(index=True)
    location_url: Optional[str] = Field(default=None)
    user_id: UUID = Field(foreign_key="users.id")

class Document(DocumentBase, table=True):
    __tablename__ = "documents"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    connector_id: Optional[UUID] = Field(default=None, foreign_key="connectors.id", ondelete="SET NULL")
    external_id: Optional[str] = Field(default=None, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Connector(SQLModel, table=True):
    __tablename__ = "connectors"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    name: str = Field(index=True)
    type: str = Field(index=True)  # 'notion', 'google_drive', etc.
    config: dict = Field(default_factory=dict, sa_column=Column(JSON))
    status: str = Field(default="active")
    last_sync_at: Optional[datetime] = Field(default=None)
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

class DocumentChunk(SQLModel, table=True):
    __tablename__ = "document_chunks"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    document_id: UUID = Field(foreign_key="documents.id", ondelete="CASCADE")
    chunk_index: int
    content: str
    embedding: Any = Field(sa_column=Column(Vector(768)))
    embedding_model: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Datasets
class DatasetDocuments(SQLModel, table=True):
    __tablename__ = "dataset_documents"
    dataset_id: UUID = Field(foreign_key="datasets.id", primary_key=True, ondelete="CASCADE")
    document_id: UUID = Field(foreign_key="documents.id", primary_key=True, ondelete="CASCADE")

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
    chatbot_id: UUID = Field(foreign_key="chatbots.id", primary_key=True, ondelete="CASCADE")
    dataset_id: UUID = Field(foreign_key="datasets.id", primary_key=True, ondelete="CASCADE")

class ChatbotBase(SQLModel):
    name: str = Field(index=True)
    user_id: UUID = Field(foreign_key="users.id")
    system_prompt: str = Field(default=DEFAULT_SYSTEM_PROMPT)
    temperature: float = Field(default=0.7)
    welcome_message: str = Field(default=DEFAULT_WELCOME_MESSAGE)
    status: str = Field(default=CHATBOT_STATUS_CREATING)

class Chatbot(ChatbotBase, table=True):
    __tablename__ = "chatbots"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    embed_token: str = Field(default_factory=lambda: str(uuid4()), unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ChatbotAllowedOrigin(SQLModel, table=True):
    __tablename__ = "chatbot_allowed_origins"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    chatbot_id: UUID = Field(foreign_key="chatbots.id", ondelete="CASCADE")
    domain: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatbotCreate(SQLModel):
    name: str
    dataset_ids: List[UUID]
    system_prompt: Optional[str] = None
    temperature: Optional[float] = 0.7
    welcome_message: str
    allowed_domains: str

class ChatbotRead(ChatbotBase):
    id: UUID
    embed_token: str
    status: str
    chunk_count: int = 0
    created_at: datetime
    updated_at: datetime

# Sessions
class ChatSession(SQLModel, table=True):
    __tablename__ = "chat_sessions"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    chatbot_id: UUID = Field(foreign_key="chatbots.id", ondelete="CASCADE")
    session_token: str = Field(unique=True, index=True)
    ip_address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    session_id: UUID = Field(foreign_key="chat_sessions.id", ondelete="CASCADE")
    role: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# API Configs
class ChatMessageItem(SQLModel):
    role: str
    content: str

class ChatRequest(SQLModel):
    message: str
    history: List[ChatMessageItem] = []
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
    chatbot_id: Optional[UUID] = Field(default=None, foreign_key="chatbots.id", ondelete="CASCADE")
    message_count: int = Field(default=0)
    token_count: int = Field(default=0)
    reset_date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Recent Activity
class RecentActivityBase(SQLModel):
    user_id: UUID = Field(foreign_key="users.id")
    activity_type: str
    details: str

class RecentActivity(RecentActivityBase, table=True):
    __tablename__ = "recent_activities"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RecentActivityRead(RecentActivityBase):
    id: UUID
    created_at: datetime

