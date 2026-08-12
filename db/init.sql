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

-- uptime_checks — site-alive probes every 5 min (lib/uptime.ts)
CREATE TABLE IF NOT EXISTS uptime_checks (
  id BIGSERIAL PRIMARY KEY,
  target TEXT NOT NULL,
  ok BOOLEAN NOT NULL,
  status_code INTEGER,
  latency_ms INTEGER,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_uptime_target_time
  ON uptime_checks (target, checked_at DESC);

-- deepseek gateway — team keys + usage snapshots + alert dedupe (lib/gateway/db.ts)
-- Mirrors the CREATE TABLE IF NOT EXISTS statements in lib/gateway/db.ts.
CREATE TABLE IF NOT EXISTS deepseek_teams (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  champion TEXT NOT NULL,
  limit_usd NUMERIC(10,2) NOT NULL DEFAULT 30,
  key_hash TEXT,
  key_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS deepseek_usage_snapshots (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT NOT NULL REFERENCES deepseek_teams(id),
  usage_usd NUMERIC(12,6) NOT NULL,
  limit_usd NUMERIC(10,2) NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ds_snap_team_time
  ON deepseek_usage_snapshots (team_id, captured_at DESC);
CREATE TABLE IF NOT EXISTS deepseek_alerts_log (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT NOT NULL REFERENCES deepseek_teams(id),
  level TEXT NOT NULL,
  usage_usd NUMERIC(12,6) NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Dedupe: one alert per (team, level, calendar month, UTC) — expression needs a
-- unique index (not a table UNIQUE constraint), with an explicit timezone so
-- date_trunc is IMMUTABLE (timestamptz date_trunc is STABLE otherwise).
CREATE UNIQUE INDEX IF NOT EXISTS idx_ds_alerts_dedupe
  ON deepseek_alerts_log (team_id, level, date_trunc('month', sent_at AT TIME ZONE 'UTC'));
