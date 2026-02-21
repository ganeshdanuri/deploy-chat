"""
Backend API Endpoint Definitions
"""

class Endpoints:
    # Auth Endpoints
    AUTH_PREFIX = "/auth"
    AUTH_REGISTER = "/register"
    AUTH_VERIFY_OTP = "/verify-otp"
    AUTH_LOGIN = "/login"
    AUTH_GOOGLE = "/google"
    AUTH_REFRESH = "/refresh"

    # User Endpoints
    USERS_PREFIX = "/users"
    USERS_ME = "/me"
    USERS_RECENT_ACTIVITY = "/recent-activity"

    # Usage Endpoints
    USAGE_PREFIX = "/usage"
    USAGE_STATS = "/stats"

    # Widget Endpoints
    WIDGET_PREFIX = "/widget"
    WIDGET_CHAT = "/{embed_token}/chat"
    WIDGET_INFO = "/{embed_token}/info"

    # Chatbot Endpoints
    CHATBOTS_PREFIX = "/chatbots"
    CHATBOTS_BASE = "/"
    CHATBOTS_BY_ID = "/{chatbot_id}"
    CHATBOTS_CHAT = "/{chatbot_id}/chat"

    # Dataset Endpoints
    DATASETS_PREFIX = "/datasets"
    DATASETS_BASE = "/"
    DATASETS_BY_ID = "/{dataset_id}"

    # Document Endpoints
    DOCUMENTS_PREFIX = "/documents"
    DOCUMENTS_BASE = "/"
    DOCUMENTS_BY_ID = "/{document_id}"
