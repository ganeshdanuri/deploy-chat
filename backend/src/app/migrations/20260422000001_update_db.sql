-- 1. Create Pricing Tiers table
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    price FLOAT DEFAULT 0.0,
    monthly_limit INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE pricing_tiers DROP COLUMN IF EXISTS price_id;
ALTER TABLE pricing_tiers ADD COLUMN IF NOT EXISTS price FLOAT DEFAULT 0.0;

-- 2. Insert Default Tiers if not exists
INSERT INTO pricing_tiers (id, name, price, monthly_limit, created_at) VALUES (gen_random_uuid(), 'Free', 0.0, 100, NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO pricing_tiers (id, name, price, monthly_limit, created_at) VALUES (gen_random_uuid(), 'Starter', 19.0, 1000, NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO pricing_tiers (id, name, price, monthly_limit, created_at) VALUES (gen_random_uuid(), 'Professional', 49.0, 10000, NOW()) ON CONFLICT (name) DO NOTHING;

-- 3. Update users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR;
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users DROP COLUMN IF EXISTS current_plan;
ALTER TABLE users DROP COLUMN IF EXISTS plan_id;

-- 4. Create Email Verifications table
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR NOT NULL,
    otp_code VARCHAR NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Update chatbots table
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS system_prompt TEXT DEFAULT 'You are a helpful AI assistant.';
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS temperature FLOAT DEFAULT 0.7;
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS welcome_message TEXT DEFAULT 'Hi! How can I help you today?';
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS embed_token VARCHAR UNIQUE;
UPDATE chatbots SET embed_token = gen_random_uuid()::text WHERE embed_token IS NULL;
ALTER TABLE chatbots ALTER COLUMN embed_token SET NOT NULL;

-- 6. Create Platform API Keys table
CREATE TABLE IF NOT EXISTS platform_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR NOT NULL,
    api_key VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Create User API Keys table
CREATE TABLE IF NOT EXISTS user_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR NOT NULL,
    api_key VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. Create Usage Tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE SET NULL,
    message_count INTEGER DEFAULT 0,
    token_count INTEGER DEFAULT 0,
    reset_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. Create User Pricing Plans table
CREATE TABLE IF NOT EXISTS user_pricing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES pricing_tiers(id),
    status VARCHAR NOT NULL DEFAULT 'active',
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 10. Indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_embed_token ON chatbots(embed_token);

-- 11. Create Recent Activities table
CREATE TABLE IF NOT EXISTS recent_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 12. Chatbot Allowed Origins
ALTER TABLE chatbots DROP COLUMN IF EXISTS allowed_domains;
CREATE TABLE IF NOT EXISTS chatbot_allowed_origins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    domain VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chatbot_allowed_origins_domain ON chatbot_allowed_origins(domain);

-- 13. Chat Sessions and Messages
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    session_token VARCHAR NOT NULL UNIQUE,
    ip_address VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 14. Chatbot status and signing_secret
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'creating';
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS signing_secret VARCHAR;
UPDATE chatbots SET signing_secret = encode(gen_random_bytes(32), 'hex') WHERE signing_secret IS NULL;
ALTER TABLE chatbots ALTER COLUMN signing_secret SET NOT NULL;

-- 15. Connectors table
CREATE TABLE IF NOT EXISTS connectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    config JSON,
    status VARCHAR NOT NULL DEFAULT 'active',
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_connectors_name ON connectors(name);
CREATE INDEX IF NOT EXISTS idx_connectors_type ON connectors(type);

-- 16. Documents connector support
ALTER TABLE documents ADD COLUMN IF NOT EXISTS connector_id UUID REFERENCES connectors(id) ON DELETE SET NULL;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS external_id VARCHAR;
CREATE INDEX IF NOT EXISTS idx_documents_external_id ON documents(external_id);
