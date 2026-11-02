ALTER TABLE password_reset
    ADD COLUMN reset_token_hash VARCHAR(64),
    ADD COLUMN token_expires_at TIMESTAMP;