/**
 * Gateway business layer: role resolution (admin / champion / member),
 * quota-validated key operations, and the role-scoped read view for the UI.
 *
 * Roles:
 * - admin (ADMIN_USERS): every team, every key; adjusts team credit pool +
 *   key-count limit.
 * - champion (team.champion): own team's keys, issue/revoke/assign within
 *   max_keys and the credit pool.
 * - member (bound via deepseek_key_members): sees only the key(s) bound to them.
 *
 * Quota rules (enforced here):
 * - active keys per team ≤ team.max_keys
 * - sum of active keys' limits ≤ team.credit_usd (each key's own limit is
 *   enforced exactly by OpenRouter's per-key limit — 403 hard block)
 * - each key binds 1–2 members; a user can only be bound to one active key.
 */
import { cookies } from "next/headers";
import {
  type GatewayKey,
  type GatewayTeam,
  addKeyMember,
  createKeyRecord,
  getTeamById,
  getTeamsByChampion,
  listAllKeys,
  listKeyMembers,
  listKeysByTeam,
  listKeysForUser,
  listRecentAlerts,
  listSnapshots,
  listTeams,
  removeKeyMember,
  setKeyStatus,
  updateTeamLimits as dbUpdateTeamLimits,
} from "./db";
import { type OpenRouterKey, createKey, deleteKey, listKeys } from "./openrouter";
import { isAdminUser } from "../auth";

export class GatewayForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class GatewayNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class GatewayConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/** Username from the fp-auth cookie ("" when not logged in). */
export async function currentUsername(): Promise<string> {
  return (await cookies()).get("fp-auth")?.value || "";
}

export type GatewayRole = "admin" | "champion" | "member" | "none";

/** Resolve the caller's role and the teams they may act on. */
export async function resolveRole(username: string): Promise<{
  role: GatewayRole;
  teams: GatewayTeam[];
}> {
  if (isAdminUser(username)) {
    return { role: "admin", teams: await listTeams() };
  }
  const championTeams = await getTeamsByChampion(username);
  if (championTeams.length > 0) {
    return { role: "champion", teams: championTeams };
  }
  const memberKeys = await listKeysForUser(username);
  if (memberKeys.length > 0) {
    const teams = await listTeams();
    const teamIds = new Set(memberKeys.map((k) => k.teamId));
    return { role: "member", teams: teams.filter((t) => teamIds.has(t.id)) };
  }
  return { role: "none", teams: [] };
}

// ---- views ------------------------------------------------------------------

export interface KeyUsageSnapshot {
  capturedAt: string;
  usageUsd: number;
  limitUsd: number;
}

export interface KeyView extends GatewayKey {
  /** Live OpenRouter BYOK spend for the month (null when unknown). */
  usageUsd: number | null;
  members: string[];
  snapshots: KeyUsageSnapshot[];
}

export interface TeamView extends GatewayTeam {
  keys: KeyView[];
  /** Sum of live usage across the team's active keys. */
  totalUsageUsd: number;
}

export interface TeamsView {
  role: GatewayRole;
  teams: TeamView[];
  alerts: { teamId: number; keyId: number; level: string; usageUsd: number; sentAt: string }[];
}

/**
 * Role-scoped read view. Admin sees all teams/keys; champion sees own team's
 * keys; member sees only the keys bound to them (with their team's context).
 */
export async function getTeamsView(username: string): Promise<TeamsView> {
  const { role, teams } = await resolveRole(username);
  if (role === "none") return { role, teams: [], alerts: [] };

  // One OpenRouter call for live usage (map by hash); admin/champion see every
  // key, members only their own.
  let usageByHash = new Map<string, OpenRouterKey>();
  try {
    usageByHash = new Map((await listKeys()).map((k) => [k.hash, k]));
  } catch (err) {
    console.error("gateway listKeys failed:", err);
  }

  const teamViews: TeamView[] = await Promise.all(
    teams.map(async (team) => {
      const allKeys = await listKeysByTeam(team.id);
      const visibleKeys =
        role === "member"
          ? allKeys.filter((k) => k.status === "active") // member filter below
          : allKeys;

      let memberKeyIds = new Set<number>();
      if (role === "member") {
        const myKeys = await listKeysForUser(username);
        memberKeyIds = new Set(myKeys.map((k) => k.id));
      }

      const keys: (KeyView | null)[] = await Promise.all(
        visibleKeys.map(async (k) => {
          if (role === "member" && !memberKeyIds.has(k.id)) return null;
          const live = k.status === "active" ? usageByHash.get(k.hash) : undefined;
          const members = (await listKeyMembers(k.id)).map((m) => m.username);
          const snapshots = (await listSnapshots(k.id, 30)).slice(0, 7).map((s) => ({
            capturedAt: s.capturedAt,
            usageUsd: s.usageUsd,
            limitUsd: s.limitUsd,
          }));
          return {
            ...k,
            usageUsd: live?.byokUsageMonthly ?? null,
            members,
            snapshots,
          } satisfies KeyView;
        })
      );

      const filtered = keys.filter((k): k is KeyView => k !== null);
      return {
        ...team,
        keys: filtered,
        totalUsageUsd: filtered.reduce((s, k) => s + (k.usageUsd ?? 0), 0),
      };
    })
  );

  const alerts =
    role === "admin" || role === "champion"
      ? (await listRecentAlerts(30)).filter((a) => teams.some((t) => t.id === a.teamId))
      : [];

  return {
    role,
    teams: teamViews,
    alerts: alerts.map((a) => ({
      teamId: a.teamId,
      keyId: a.keyId,
      level: a.level,
      usageUsd: a.usageUsd,
      sentAt: a.sentAt,
    })),
  };
}

// ---- key operations ---------------------------------------------------------

export interface IssuedKey {
  /** Plaintext sub-key — show exactly once, never persist. */
  key: string;
  label: string;
}

/**
 * Issue a fresh sub-key for a team. Validates max_keys, the credit pool
 * (sum of active keys' limits + new limit ≤ team.credit_usd) and member count
 * (≤ 2, each with no other active key).
 */
export async function issueKey(
  username: string,
  teamId: number,
  opts: { limitUsd: number; members?: string[] }
): Promise<IssuedKey> {
  const team = await requireTeam(teamId);
  await requireManage(username, team);

  const limitUsd = Number(opts.limitUsd);
  if (!Number.isFinite(limitUsd) || limitUsd <= 0) {
    throw new GatewayConflictError("limitUsd must be a positive number");
  }

  const members = (opts.members ?? []).map((m) => m.trim()).filter(Boolean).slice(0, 2);
  const activeKeys = (await listKeysByTeam(team.id)).filter((k) => k.status === "active");

  if (activeKeys.length >= team.maxKeys) {
    throw new GatewayConflictError(
      `Team "${team.name}" has reached its key limit (${team.maxKeys}) — ask an admin to raise it`
    );
  }
  const usedCredit = activeKeys.reduce((s, k) => s + k.limitUsd, 0);
  if (usedCredit + limitUsd > team.creditUsd) {
    throw new GatewayConflictError(
      `Credit limit exceeded: $${usedCredit.toFixed(2)} already allocated of $${team.creditUsd.toFixed(2)} — raise the team credit or lower the key limit`
    );
  }
  for (const member of members) {
    const existing = await listKeysForUser(member);
    if (existing.some((k) => k.status === "active")) {
      throw new GatewayConflictError(`"${member}" already has an active key`);
    }
  }

  const { key, keyRow } = await createKey({
    name: `fp-${team.name}-${activeKeys.length + 1}`,
    limitUsd,
  });
  const record = await createKeyRecord({
    teamId: team.id,
    hash: keyRow.hash,
    label: `fp-${team.name}-${activeKeys.length + 1}`,
    limitUsd,
    createdBy: username,
  });
  for (const member of members) {
    await addKeyMember({ keyId: record.id, username: member, assignedBy: username });
  }
  return { key, label: record.label };
}

/** Bind a user to an existing key (1–2 members, one active key per user). */
export async function assignMember(
  username: string,
  keyId: number,
  memberUsername: string
): Promise<void> {
  const key = await requireKey(keyId);
  const team = await requireTeam(key.teamId);
  await requireManage(username, team);

  if (key.status !== "active") {
    throw new GatewayConflictError("Key is not active");
  }
  const current = await listKeyMembers(key.id);
  if (current.length >= 2) {
    throw new GatewayConflictError("Key already has 2 members — revoke or remove one first");
  }
  if (current.some((m) => m.username === memberUsername)) {
    throw new GatewayConflictError(`"${memberUsername}" is already bound to this key`);
  }
  const existing = await listKeysForUser(memberUsername);
  if (existing.some((k) => k.status === "active")) {
    throw new GatewayConflictError(`"${memberUsername}" already has an active key`);
  }
  await addKeyMember({ keyId: key.id, username: memberUsername, assignedBy: username });
}

export async function removeMember(
  username: string,
  keyId: number,
  memberUsername: string
): Promise<void> {
  const key = await requireKey(keyId);
  const team = await requireTeam(key.teamId);
  await requireManage(username, team);
  await removeKeyMember(key.id, memberUsername);
}

/** Revoke a key (OpenRouter + local status). Members stay as history. */
export async function revokeKey(username: string, keyId: number): Promise<void> {
  const key = await requireKey(keyId);
  const team = await requireTeam(key.teamId);
  await requireManage(username, team);

  if (key.status === "active") {
    try {
      await deleteKey(key.hash);
    } catch (err) {
      console.error(`gateway: failed to delete OpenRouter key ${key.hash.slice(0, 8)}:`, err);
    }
    await setKeyStatus(key.id, "revoked");
  }
}

/** Admin-only: adjust team credit pool and/or key-count limit. */
export async function updateTeamLimits(
  username: string,
  teamId: number,
  patch: { creditUsd?: number; maxKeys?: number }
): Promise<GatewayTeam> {
  if (!isAdminUser(username)) {
    throw new GatewayForbiddenError("Only admins can adjust team limits");
  }
  const team = await requireTeam(teamId);
  const activeKeys = (await listKeysByTeam(team.id)).filter((k) => k.status === "active");

  if (patch.creditUsd !== undefined) {
    const used = activeKeys.reduce((s, k) => s + k.limitUsd, 0);
    if (patch.creditUsd < used) {
      throw new GatewayConflictError(
        `credit_usd cannot be below the $${used.toFixed(2)} already allocated across active keys`
      );
    }
  }
  if (patch.maxKeys !== undefined) {
    if (patch.maxKeys < activeKeys.length) {
      throw new GatewayConflictError(
        `max_keys cannot be below the ${activeKeys.length} active keys`
      );
    }
  }
  return dbUpdateTeamLimits(team.id, patch);
}

// ---- guards -----------------------------------------------------------------

async function requireTeam(teamId: number): Promise<GatewayTeam> {
  const team = await getTeamById(teamId);
  if (!team) throw new GatewayNotFoundError("Team not found");
  return team;
}

async function requireKey(keyId: number): Promise<GatewayKey> {
  const key = (await listAllKeys()).find((k) => k.id === keyId);
  if (!key) throw new GatewayNotFoundError("Key not found");
  return key;
}

async function requireManage(username: string, team: GatewayTeam): Promise<void> {
  if (isAdminUser(username) || team.champion === username) return;
  throw new GatewayForbiddenError("You can only manage your own team's keys");
}
