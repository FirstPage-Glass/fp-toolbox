import { NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth";

const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // matches mcp's session serializer max_age

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
  let result;
  try {
    // username is treated as email; SSO against firstpage-mcp when
    // FP_MCP_INTERNAL_KEY is set, AUTH_USERS fallback otherwise.
    result = await validateCredentials(username, password);
  } catch (err) {
    // Network/HTTP errors from mcp are thrown, never silently fallen back.
    console.error("login: firstpage-mcp authentication unavailable:", err);
    return NextResponse.json({ success: false, message: "Login service unavailable" }, { status: 502 });
  }
  if (!result.ok) {
    return NextResponse.json({ success: false, message: result.message }, { status: 401 });
  }
  const response = NextResponse.json({ success: true, username: result.email });
  response.cookies.set("fp-auth", result.email, {
    httpOnly: false, // legacy/degraded identity — NavBar reads /api/me, not cookies
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  // Shared mcp session cookie: only when a cross-subdomain domain is configured
  // and mcp issued a session_token, so toolbox + mcp share one login.
  const sessionDomain = process.env.FP_SESSION_DOMAIN;
  if (sessionDomain && result.sessionToken && result.expiresAt) {
    const expiresMs = new Date(result.expiresAt).getTime();
    const maxAge = Number.isFinite(expiresMs)
      ? Math.min(SESSION_MAX_AGE_SECONDS, Math.max(1, Math.floor((expiresMs - Date.now()) / 1000)))
      : SESSION_MAX_AGE_SECONDS;
    response.cookies.set("fp_session", result.sessionToken, {
      domain: sessionDomain,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
    });
  }
  return response;
}