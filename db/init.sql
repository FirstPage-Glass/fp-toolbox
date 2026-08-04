-- fp-toolbox database schema
-- Runs once on first container start via /docker-entrypoint-initdb.d/.
-- Mirrors the CREATE TABLE IF NOT EXISTS statements in lib/ (usage.ts, outputs.ts, hubspot.ts)
-- so the DB is ready before the app makes its first query.

-- usage_events — every tool run logs tokens, cost, duration (lib/usage.ts)
CREATE TABLE IF NOT EXISTS usage_events (
  id BIGSERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'run',
  duration_ms INTEGER NOT NULL DEFAULT 0,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- tool_outputs — persisted generation outputs for history + refine (lib/outputs.ts)
CREATE TABLE IF NOT EXISTS tool_outputs (
  id BIGSERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  brief JSONB NOT NULL,
  output JSONB NOT NULL,
  model TEXT NOT NULL DEFAULT '',
  cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tool_outputs_user_slug
  ON tool_outputs (user_name, tool_slug, id DESC);

-- hubspot_leads_cache — recent leads cache, 1h TTL (lib/hubspot.ts)
CREATE TABLE IF NOT EXISTS hubspot_leads_cache (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  website TEXT,
  created_at TEXT NOT NULL DEFAULT '',
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
