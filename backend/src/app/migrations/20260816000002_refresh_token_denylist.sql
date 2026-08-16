-- Replaces the allowlist (one row per issued refresh token) with a denylist.
--
-- With a 2-minute access token the client refreshes roughly every 2 minutes,
-- so the allowlist wrote ~720 rows/day per active user and never pruned them.
-- The JWT signature already proves we issued the token, so absence means valid
-- and we only need rows for tokens revoked BEFORE their natural expiry.
-- Anything past expires_at is rejected by signature check anyway and can be
-- purged.
CREATE TABLE IF NOT EXISTS revoked_refresh_tokens (
    jti         UUID PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at  TIMESTAMP NOT NULL,
    revoked_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Supports the purge of entries that have aged out.
CREATE INDEX IF NOT EXISTS ix_revoked_refresh_tokens_expires_at
    ON revoked_refresh_tokens (expires_at);

-- Bulk revocation ("sign out everywhere", password change) can't enumerate
-- tokens under a denylist, so cut it off by issue time instead: any refresh
-- token minted before this instant is refused. One column, no rows.
ALTER TABLE users ADD COLUMN IF NOT EXISTS sessions_valid_from TIMESTAMP;

DROP TABLE IF EXISTS refresh_tokens;
