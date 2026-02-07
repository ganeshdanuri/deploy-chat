CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL UNIQUE,
    role VARCHAR,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chatbots
CREATE TABLE chatbots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
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
    chatbot_id UUID NOT NULL REFERENCES chatbots(id),
    dataset_id UUID NOT NULL REFERENCES datasets(id),
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
    dataset_id UUID NOT NULL REFERENCES datasets(id),
    document_id UUID NOT NULL REFERENCES documents(id),
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
    document_id UUID NOT NULL REFERENCES documents(id),
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    embedding_model VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_datasets_user_id ON datasets(user_id);
CREATE INDEX idx_chatbots_user_id ON chatbots(user_id);
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);

-- Optional: vector index for similarity search (pgvector)
CREATE INDEX idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
