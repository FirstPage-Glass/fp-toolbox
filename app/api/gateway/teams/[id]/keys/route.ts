import { NextResponse } from "next/server";
import {
  currentUsername,
  issueTeamKey,
  revokeTeamKey,
  GatewayForbiddenError,
  GatewayNotFoundError,
} from "@/lib/gateway/service";

/**
 * POST /api/gateway/teams/[id]/keys — issue a fresh sub-key for the team.
 * Champion (own team) or admin. Revokes the previous key (single-active-key rule);
 * returns the plaintext key exactly once.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const teamId = Number(id);
  if (!Number.isInteger(teamId)) {
    return NextResponse.json({ error: "Invalid team id" }, { status: 400 });
  }

  const username = await currentUsername();
  if (!username) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const issued = await issueTeamKey(username, teamId);
    return NextResponse.json({
      key: issued.key, // plaintext — shown once, never stored
      label: issued.label,
      message: "Key issued. It is shown only once — copy it now.",
    });
  } catch (err) {
    if (err instanceof GatewayForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof GatewayNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error("gateway issueKey failed:", err);
    return NextResponse.json(
      { error: "Failed to issue key — check OPENROUTER_MANAGEMENT_KEY" },
      { status: 502 }
    );
  }
}

/** DELETE /api/gateway/teams/[id]/keys — revoke the team's active key. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const teamId = Number(id);
  if (!Number.isInteger(teamId)) {
    return NextResponse.json({ error: "Invalid team id" }, { status: 400 });
  }

  const username = await currentUsername();
  if (!username) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await revokeTeamKey(username, teamId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof GatewayForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof GatewayNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error("gateway revokeKey failed:", err);
    return NextResponse.json({ error: "Failed to revoke key" }, { status: 502 });
  }
}
