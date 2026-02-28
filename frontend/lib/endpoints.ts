export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        GOOGLE: '/api/auth/google',
        REGISTER: '/api/auth/register',
        VERIFY_OTP: '/api/auth/verify-otp',
        REFRESH: '/api/auth/refresh',
    },
    USAGE: {
        STATS: '/api/usage/stats',
    },
    DOCUMENTS: {
        BASE: '/api/documents/',
        BY_ID: (id: string | number) => `/api/documents/${id}`,
    },
    CHATBOTS: {
        BASE: '/api/chatbots/',
        BY_ID: (id: string | number) => `/api/chatbots/${id}`,
        CHAT: (id: string | number) => `/api/chatbots/${id}/chat`,
        RESUME: (id: string | number) => `/api/chatbots/${id}/resume`,
    },
    USERS: {
        ME: '/api/users/me',
        RECENT_ACTIVITY: '/api/users/recent-activity',
    },
    DATASETS: {
        BASE: '/api/datasets/',
        BY_ID: (id: string | number) => `/api/datasets/${id}`,
    },
    CONNECTORS: {
        BASE: '/api/connectors/',
        BY_ID: (id: string | number) => `/api/connectors/${id}`,
        SYNC: (id: string | number) => `/api/connectors/${id}/sync`,
        NOTION_PAGES: '/api/connectors/notion/pages',
    },
    API_KEYS: {
        BASE: '/api/api-keys/',
        BY_ID: (id: string | number) => `/api/api-keys/${id}`,
    }
};
