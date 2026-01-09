-- Migration: 001_create_signups (SQLite/Turso)
-- Description: Create early access signups table

CREATE TABLE IF NOT EXISTS signups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'website',
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_signups_email ON signups(email);

-- Index for analytics queries by date
CREATE INDEX IF NOT EXISTS idx_signups_created_at ON signups(created_at);
