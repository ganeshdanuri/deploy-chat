-- Incremental update script to align database with latest schema.sql and models.py

-- 1. Create Pricing Tiers table
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    price FLOAT DEFAULT 0.0,
    monthly_limit INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ensure price_id is removed if it was added previously
ALTER TABLE pricing_tiers DROP COLUMN IF EXISTS price_id;

-- Ensure price is added
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

-- Explicitly remove old plan column and table plan_id
ALTER TABLE users DROP COLUMN IF EXISTS current_plan;
ALTER TABLE users DROP COLUMN IF EXISTS plan_id;
DROP TABLE IF EXISTS user_pricing_plans CASCADE;

-- Migrate existing current_plan data (Optional but good)
-- UPDATE users SET plan_id = (SELECT id FROM pricing_tiers WHERE name = 'Free' LIMIT 1) WHERE current_plan = 'free';

-- 4. Create Email Verifications table
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR NOT NULL,
    otp_code VARCHAR NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Update chatbots table with new configuration fields
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS system_prompt TEXT DEFAULT 'You are a helpful AI assistant.';
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS temperature FLOAT DEFAULT 0.7;
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS welcome_message TEXT DEFAULT 'Hi! How can I help you today?';
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS embed_token VARCHAR UNIQUE;

-- Generate tokens for existing chatbots (PostgreSQL specific)
UPDATE chatbots SET embed_token = gen_random_uuid()::text WHERE embed_token IS NULL;
ALTER TABLE chatbots ALTER COLUMN embed_token SET NOT NULL;

-- 3. Add Cascade deletes for relationships if not already present
-- Note: This might require dropping and recreating constraints if they exist without CASCADE
-- For simplicity, we assume these are new tables or can be safely updated

-- 4. Create Platform API Keys table
CREATE TABLE IF NOT EXISTS platform_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR NOT NULL,
    api_key VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create User API Keys table
CREATE TABLE IF NOT EXISTS user_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR NOT NULL,
    api_key VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Create Usage Tracking table
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

-- 7. Create User Pricing Plans table
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

-- 8. Add useful indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_embed_token ON chatbots(embed_token);

-- 9. Create Recent Activities table
CREATE TABLE IF NOT EXISTS recent_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
