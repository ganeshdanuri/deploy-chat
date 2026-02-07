-- Add Pricing Plan to User or create a separate table
CREATE TABLE user_pricing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR NOT NULL DEFAULT 'free', -- 'free', 'trial', 'pro', 'enterprise'
    status VARCHAR DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Update users table to have a direct reference if needed, 
-- or we can just join. For JWT, it's better to have it easily accessible.
ALTER TABLE users ADD COLUMN current_plan VARCHAR DEFAULT 'free';
