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
    AUTH_GITHUB = "/github"
    AUTH_REFRESH = "/refresh"
    AUTH_LOGOUT = "/logout"

    # User Endpoints
    USERS_PREFIX = "/users"
    USERS_ME = "/me"
    USERS_RECENT_ACTIVITY = "/recent-activity"

    # Usage Endpoints
    USAGE_PREFIX = "/usage"
    USAGE_STATS = "/stats"

    ANALYTICS_PREFIX = "/analytics"
    ANALYTICS_BASE = "/"
    ANALYTICS_BY_CHATBOT = "/chatbot/{chatbot_id}"

    # Widget Endpoints
    WIDGET_PREFIX = "/widget"
    WIDGET_INIT = "/{embed_token}/init"
    WIDGET_CHAT = "/{embed_token}/chat"
    WIDGET_INFO = "/{embed_token}/info"

    # Chatbot Endpoints
    CHATBOTS_PREFIX = "/chatbots"
    CHATBOTS_BASE = "/"
    CHATBOTS_BY_ID = "/{chatbot_id}"
    CHATBOTS_RESUME = "/{chatbot_id}/resume"
    CHATBOTS_CHAT = "/{chatbot_id}/chat"

    # Dataset Endpoints
    DATASETS_PREFIX = "/datasets"
    DATASETS_BASE = "/"
    DATASETS_BY_ID = "/{dataset_id}"

    # Document Endpoints
    DOCUMENTS_PREFIX = "/documents"
    DOCUMENTS_BASE = "/"
    DOCUMENTS_BY_ID = "/{document_id}"

