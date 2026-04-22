ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id VARCHAR UNIQUE;
CREATE INDEX IF NOT EXISTS ix_users_github_id ON users (github_id);
