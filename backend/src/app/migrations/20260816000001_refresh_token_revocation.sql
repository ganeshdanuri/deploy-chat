-- Refresh tokens were previously irrevocable: rotation left the old token
-- valid, logout only cleared client storage, and a stolen token stayed usable
-- for the full REFRESH_TOKEN_EXPIRE_DAYS window with no way to cut it off.
--
-- Track each issued refresh token by its jti so it can be revoked individually
-- (rotation, logout) or in bulk (password change, "sign out everywhere").
CREATE TABLE IF NOT EXISTS refresh_tokens (
    jti         UUID PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    revoked_at  TIMESTAMP,
    expires_at  TIMESTAMP NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS ix_refresh_tokens_expires_at ON refresh_tokens (expires_at);
