/**
 * Gateway runtime tables for the DeepSeek team-key management (OpenRouter BYOK).
 *
 * Three tables, created with CREATE TABLE IF NOT EXISTS on first use — same
 * pattern as lib/usage.ts (no migration framework at this scale).
 *
 * - deepseek_teams         — one row per team (62 people / 2 per team = 31 teams);
 *                            champion is the fp-auth username that manages the team's key.
 *                            Single active key per team (key_hash), so OpenRouter's
 *                            per-key limit ($30/month) === the team's pool. Signing a new
 *                            key clears the old one.
 * - deepseek_usage_snapshots — hourly usage snapshot from OpenRouter's key management
 *                            API (byok_usage_monthly) for the admin page + alerting.
 * - deepseek_alerts_log     — dedupe log for 80%/100% alerts (one per team per level
 *                            per calendar month).
 */
import { pool } from "../db";

export interface GatewayTeam {
  id: number;
  name: string;
  champion: string;
  limitUsd: number;
  keyHash: string | null;
  keyLabel: string | null;
  createdAt: string;
}

export interface UsageSnapshot {
  id: number;
  teamId: number;
  usageUsd: number;
  limitUsd: number;
  capturedAt: string;
}

export type AlertLevel = "80" | "100";

export interface AlertLogEntry {
  id: number;
  teamId: number;
  level: AlertLevel;
  usageUsd: number;
  sentAt: string;
}

/** Create the gateway tables + indexes on first use. Safe to call repeatedly. */
export async function ensureGatewayTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS deepseek_teams (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      champion TEXT NOT NULL,
      limit_usd NUMERIC(10,2) NOT NULL DEFAULT 30,
      key_hash TEXT,
      key_label TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS deepseek_usage_snapshots (
      id BIGSERIAL PRIMARY KEY,
      team_id BIGINT NOT NULL REFERENCES deepseek_teams(id),
      usage_usd NUMERIC(12,6) NOT NULL,
      limit_usd NUMERIC(10,2) NOT NULL,
      captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_ds_snap_team_time
      ON deepseek_usage_snapshots (team_id, captured_at DESC)
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS deepseek_alerts_log (
      id BIGSERIAL PRIMARY KEY,
      team_id BIGINT NOT NULL REFERENCES deepseek_teams(id),
      level TEXT NOT NULL,
      usage_usd NUMERIC(12,6) NOT NULL,
      sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  // Dedupe: one alert per (team, level, calendar month, UTC). Table UNIQUE(...)
  // constraints can't hold expressions, and date_trunc on timestamptz is STABLE
  // (timezone-dependent) — must cast to an explicit zone so the index is IMMUTABLE.
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_ds_alerts_dedupe
      ON deepseek_alerts_log (team_id, level, date_trunc('month', sent_at AT TIME ZONE 'UTC'))
  `);
}

const TEAM_COLUMNS = "id, name, champion, limit_usd, key_hash, key_label, created_at";

function rowToTeam(row: Record<string, unknown>): GatewayTeam {
  return {
    id: Number(row.id),
    name: String(row.name),
    champion: String(row.champion),
    limitUsd: Number(row.limit_usd),
    keyHash: row.key_hash === null ? null : String(row.key_hash),
    keyLabel: row.key_label === null ? null : String(row.key_label),
    createdAt: String(row.created_at),
  };
}

export async function listTeams(): Promise<GatewayTeam[]> {
  await ensureGatewayTables();
  const { rows } = await pool.query(
    `SELECT ${TEAM_COLUMNS} FROM deepseek_teams ORDER BY name`
  );
  return rows.map(rowToTeam);
}

export async function getTeamById(id: number): Promise<GatewayTeam | null> {
  await ensureGatewayTables();
  const { rows } = await pool.query(
    `SELECT ${TEAM_COLUMNS} FROM deepseek_teams WHERE id = $1`,
    [id]
  );
  return rows.length ? rowToTeam(rows[0]) : null;
}

export async function getTeamByChampion(champion: string): Promise<GatewayTeam | null> {
  await ensureGatewayTables();
  const { rows } = await pool.query(
    `SELECT ${TEAM_COLUMNS} FROM deepseek_teams WHERE champion = $1`,
    [champion]
  );
  return rows.length ? rowToTeam(rows[0]) : null;
}

export async function createTeam(opts: {
  name: string;
  champion: string;
  limitUsd: number;
}): Promise<GatewayTeam> {
  await ensureGatewayTables();
  const { rows } = await pool.query(
    `INSERT INTO deepseek_teams (name, champion, limit_usd)
     VALUES ($1, $2, $3)
     RETURNING ${TEAM_COLUMNS}`,
    [opts.name, opts.champion, opts.limitUsd]
  );
  return rowToTeam(rows[0]);
}

/** Record the team's current active OpenRouter key (single-key-per-team rule). */
export async function setTeamKey(id: number, keyHash: string, keyLabel: string): Promise<void> {
  await pool.query(
    `UPDATE deepseek_teams SET key_hash = $2, key_label = $3, updated_at = now() WHERE id = $1`,
    [id, keyHash, keyLabel]
  );
}

/** Clear the team's key when revoked or replaced. */
export async function clearTeamKey(id: number): Promise<void> {
  await pool.query(
    `UPDATE deepseek_teams SET key_hash = NULL, key_label = NULL, updated_at = now() WHERE id = $1`,
    [id]
  );
}

export async function recordUsageSnapshot(teamId: number, usageUsd: number, limitUsd: number): Promise<void> {
  await pool.query(
    `INSERT INTO deepseek_usage_snapshots (team_id, usage_usd, limit_usd)
     VALUES ($1, $2, $3)`,
    [teamId, usageUsd, limitUsd]
  );
}

export async function listSnapshots(teamId: number, days: number): Promise<UsageSnapshot[]> {
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_ds_snap_team_time
      ON deepseek_usage_snapshots (team_id, captured_at DESC)
  `);
  const { rows } = await pool.query(
    `SELECT id, team_id, usage_usd, limit_usd, captured_at
     FROM deepseek_usage_snapshots
     WHERE team_id = $1 AND captured_at > now() - make_interval(days => $2)
     ORDER BY captured_at DESC`,
    [teamId, Math.max(1, Math.floor(days))]
  );
  return rows.map((r) => ({
    id: Number(r.id),
    teamId: Number(r.team_id),
    usageUsd: Number(r.usage_usd),
    limitUsd: Number(r.limit_usd),
    capturedAt: String(r.captured_at),
  }));
}

/**
 * Record an alert, deduped per (team, level, calendar month).
 * Returns true when the alert is new (and should be pushed to the webhook).
 */
export async function recordAlert(
  teamId: number,
  level: AlertLevel,
  usageUsd: number
): Promise<boolean> {
  await ensureGatewayTables();
  const { rowCount } = await pool.query(
    `INSERT INTO deepseek_alerts_log (team_id, level, usage_usd)
     VALUES ($1, $2, $3)
     ON CONFLICT (team_id, level, date_trunc('month', sent_at AT TIME ZONE 'UTC')) DO NOTHING`,
    [teamId, level, usageUsd]
  );
  return (rowCount ?? 0) > 0;
}

export async function listRecentAlerts(days = 7): Promise<AlertLogEntry[]> {
  await ensureGatewayTables();
  const { rows } = await pool.query(
    `SELECT id, team_id, level, usage_usd, sent_at
     FROM deepseek_alerts_log
     WHERE sent_at > now() - make_interval(days => $1)
     ORDER BY sent_at DESC`,
    [days]
  );
  return rows.map((r) => ({
    id: Number(r.id),
    teamId: Number(r.team_id),
    level: String(r.level) as AlertLevel,
    usageUsd: Number(r.usage_usd),
    sentAt: String(r.sent_at),
  }));
}
