-- 1. Table for Platform-provided API Keys (Managed by you)
CREATE TABLE platform_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR NOT NULL, -- 'openai', 'anthropic', 'google'
    api_key VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Table for Usage Tracking (To enforce Free Trial limits)
CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    message_count INTEGER DEFAULT 0,
    token_count INTEGER DEFAULT 0,
    reset_date TIMESTAMP DEFAULT (NOW() + interval '1 month'),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_chatbot_id ON usage_tracking(chatbot_id);
