-- Initial schema for the URL shortener

CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_links_slug ON links (slug);