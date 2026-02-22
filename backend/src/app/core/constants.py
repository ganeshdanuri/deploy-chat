"""
Application wide constants
"""

DEFAULT_PLAN_NAME = "free"
DEFAULT_FREE_PLAN_LIMIT = 10

# Security
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 2
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Chatbot
DEFAULT_SYSTEM_PROMPT = "You are a helpful AI assistant."
DEFAULT_WELCOME_MESSAGE = "Hi! How can I help you today?"

# Status Flags
STATUS_ACTIVE = "active"

# Chatbot Status
CHATBOT_STATUS_CREATING = "creating"
CHATBOT_STATUS_ACTIVE = "active"
CHATBOT_STATUS_FAILED = "failed"

# Documents
MAX_DOCUMENT_SIZE_MB = 10
IDEAL_DOCUMENT_SIZE_MB = 5

# AI & Chunking
GEMINI_TEXT_EMBEDDING_MODEL = "models/gemini-embedding-001"
DEFAULT_AI_MODEL = "gemini-2.5-flash"
CHUNK_MAX_LENGTH = 1000
CHUNK_OVERLAP = 200
