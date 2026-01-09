-- Migration: 001_create_signups
-- Description: Create early access signups table

CREATE TABLE IF NOT EXISTS signups (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    source VARCHAR(50) DEFAULT 'website',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_signups_email ON signups(email);

-- Index for analytics queries by date
CREATE INDEX IF NOT EXISTS idx_signups_created_at ON signups(created_at);
