/**
 * Gateway business layer: role checks (champion / ADMIN_USERS) + the two key
 * operations (issue / revoke) + the read view for the admin UI.
 *
 * Single-active-key-per-team rule: OpenRouter limits are per-key, so the team
 * pool is enforced by allowing exactly one live key per team — issuing a new
 * key revokes the previous one.
 */
import { cookies } from "next/headers";
import {
  type GatewayTeam,
  clearTeamKey,
  getTeamById,
  listRecentAlerts,
  listSnapshots,
  listTeams,
  setTeamKey,
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

/** Username from the fp-auth cookie ("" when not logged in). */
export async function currentUsername(): Promise<string> {
  return (await cookies()).get("fp-auth")?.value || "";
}

/** Admin users manage all teams; champions manage their own; others see none. */
export async function canManageTeam(username: string, team: GatewayTeam): Promise<boolean> {
  return isAdminUser(username) || team.champion === username;
}

export interface TeamUsageSnapshot {
  capturedAt: string;
  usageUsd: number;
  limitUsd: number;
}

export interface TeamView extends GatewayTeam {
  /** Live OpenRouter BYOK spend for the month (null when no key issued). */
  currentUsageUsd: number | null;
  snapshots: TeamUsageSnapshot[];
}

export interface TeamsView {
  isAdmin: boolean;
  teams: TeamView[];
  alerts: { teamId: number; level: string; usageUsd: number; sentAt: string }[];
}

/**
 * Read view for the logged-in user. Champions get only their own team
 * (with its 30-day usage snapshot series); admins get every team + all alerts.
 */
export async function getTeamsView(username: string): Promise<TeamsView> {
  const isAdmin = isAdminUser(username);
  const all = await listTeams();
  const visible = isAdmin
    ? all
    : all.filter((t) => t.champion === username);

  // One OpenRouter call for every team's live usage (map by key hash).
  let keysByHash = new Map<string, OpenRouterKey>();
  if (visible.some((t) => t.keyHash)) {
    try {
      const keys = await listKeys();
      keysByHash = new Map(keys.map((k) => [k.hash, k]));
    } catch (err) {
      console.error("gateway listKeys failed:", err);
    }
  }

  const teams: TeamView[] = await Promise.all(
    visible.map(async (t) => {
      const snapshots = await listSnapshots(t.id, 30);
      const live = t.keyHash ? keysByHash.get(t.keyHash) : undefined;
      return {
        ...t,
        currentUsageUsd: live?.byokUsageMonthly ?? null,
        snapshots: snapshots.map((s) => ({
          capturedAt: s.capturedAt,
          usageUsd: s.usageUsd,
          limitUsd: s.limitUsd,
        })),
      };
    })
  );

  const alerts = isAdmin
    ? await listRecentAlerts(30)
    : (await listRecentAlerts(30)).filter((a) => visible.some((t) => t.id === a.teamId));

  return {
    isAdmin,
    teams,
    alerts: alerts.map((a) => ({
      teamId: a.teamId,
      level: a.level,
      usageUsd: a.usageUsd,
      sentAt: a.sentAt,
    })),
  };
}

export interface IssuedKey {
  /** Plaintext sub-key — show exactly once, never persist. */
  key: string;
  label: string;
}

/**
 * Issue a fresh sub-key for a team (monthly $limit, BYOK spend counted).
 * Revokes the team's previous key so per-key limit === team pool.
 */
export async function issueTeamKey(username: string, teamId: number): Promise<IssuedKey> {
  const team = await requireTeam(teamId);
  await requireManage(username, team);

  const { key, keyRow } = await createKey({
    name: `fp-${team.name}`,
    limitUsd: team.limitUsd,
  });

  // Replace the old key (best-effort; a failed remote delete only leaks a
  // key we no longer reference, never spend — OpenRouter still enforces its limit).
  if (team.keyHash) {
    try {
      await deleteKey(team.keyHash);
    } catch (err) {
      console.error(`gateway: failed to delete old key for team ${team.name}:`, err);
    }
  }

  await setTeamKey(team.id, keyRow.hash, `fp-${team.name}`);
  return { key, label: `fp-${team.name}` };
}

/** Revoke a team's key (champion or admin). */
export async function revokeTeamKey(username: string, teamId: number): Promise<void> {
  const team = await requireTeam(teamId);
  await requireManage(username, team);
  if (!team.keyHash) return;
  await deleteKey(team.keyHash);
  await clearTeamKey(team.id);
}

/** Team owned by the caller (champion) or the caller is an admin. */
async function requireManage(username: string, team: GatewayTeam): Promise<void> {
  if (!(await canManageTeam(username, team))) {
    throw new GatewayForbiddenError("You can only manage your own team's key");
  }
}

async function requireTeam(teamId: number): Promise<GatewayTeam> {
  const team = await getTeamById(teamId);
  if (!team) {
    throw new GatewayNotFoundError("Team not found");
  }
  return team;
}
