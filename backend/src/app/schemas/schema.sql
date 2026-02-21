CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- Pricing Tiers
CREATE TABLE pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    price FLOAT DEFAULT 0.0,
    monthly_limit INTEGER DEFAULT 100, -- e.g. messages/month
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert Default Tiers
INSERT INTO pricing_tiers (name, monthly_limit) VALUES ('Free', 100) ON CONFLICT DO NOTHING;
INSERT INTO pricing_tiers (name, monthly_limit) VALUES ('Professional', 1000) ON CONFLICT DO NOTHING;

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    role VARCHAR,
    password_hash VARCHAR NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email Verifications
CREATE TABLE email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR NOT NULL,
    otp_code VARCHAR NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Pricing Plans
CREATE TABLE user_pricing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES pricing_tiers(id),
    status VARCHAR NOT NULL DEFAULT 'active',
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chatbots
CREATE TABLE chatbots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    system_prompt TEXT DEFAULT 'You are a helpful AI assistant.',
    temperature FLOAT DEFAULT 0.7,
    welcome_message TEXT DEFAULT 'Hi! How can I help you today?',
    embed_token VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Datasets
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chatbot <-> Datasets (Many-to-Many)
CREATE TABLE chatbot_datasets (
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    PRIMARY KEY(chatbot_id, dataset_id)
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    location_url VARCHAR,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Dataset <-> Documents (Many-to-Many)
CREATE TABLE dataset_documents (
    dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    PRIMARY KEY(dataset_id, document_id)
);

CREATE TABLE IF NOT EXISTS document_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    markdown_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Document Chunks for RAG
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    embedding_model VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Platform API Keys
CREATE TABLE platform_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR NOT NULL,
    api_key VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User API Keys
CREATE TABLE user_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR NOT NULL,
    api_key VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE SET NULL,
    message_count INTEGER DEFAULT 0,
    token_count INTEGER DEFAULT 0,
    reset_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_datasets_user_id ON datasets(user_id);
CREATE INDEX idx_chatbots_user_id ON chatbots(user_id);
CREATE INDEX idx_chatbot_embed_token ON chatbots(embed_token);
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);

-- Optional: vector index for similarity search (pgvector)
CREATE INDEX idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Recent Activities
CREATE TABLE recent_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
