import { NextResponse } from "next/server";
import { createTeam } from "@/lib/gateway/db";
import { currentUsername, getTeamsView } from "@/lib/gateway/service";
import { isAdminUser } from "@/lib/auth";

/**
 * GET /api/gateway — the logged-in user's gateway view.
 * Champion: own team (+ 30-day usage snapshots). Admin (ADMIN_USERS): all teams + alerts.
 */
export async function GET() {
  const username = await currentUsername();
  if (!username) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const view = await getTeamsView(username);
  return NextResponse.json(view);
}

/** POST /api/gateway — create a team (admin only). */
export async function POST(request: Request) {
  const username = await currentUsername();
  if (!username) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!isAdminUser(username)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const champion = String(body.champion ?? "").trim();
  const defaultLimit = Number(process.env.GATEWAY_TEAM_LIMIT_USD) || 30;
  const limitUsd = Number(body.limitUsd ?? defaultLimit);
  if (!name || !champion) {
    return NextResponse.json({ error: "name and champion are required" }, { status: 400 });
  }
  if (!Number.isFinite(limitUsd) || limitUsd <= 0) {
    return NextResponse.json({ error: "limitUsd must be a positive number" }, { status: 400 });
  }

  try {
    const team = await createTeam({ name, champion, limitUsd });
    return NextResponse.json({ team }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "Team name already exists" }, { status: 409 });
    }
    console.error("gateway createTeam failed:", err);
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}
