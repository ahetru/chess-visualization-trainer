CREATE TABLE refresh_token (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID         NOT NULL REFERENCES users(id),
    token_hash           VARCHAR(255) NOT NULL,
    expires_at           TIMESTAMPTZ  NOT NULL,
    revoked_at           TIMESTAMPTZ,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    replaced_by_token_id UUID         REFERENCES refresh_token(id)
);

CREATE INDEX idx_refresh_token_user_id ON refresh_token (user_id);
CREATE INDEX idx_refresh_token_token_hash ON refresh_token (token_hash);
