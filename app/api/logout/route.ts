import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("fp-auth", "", { maxAge: 0, path: "/" });
  // fp_session is set with domain=FP_SESSION_DOMAIN when configured — clear
  // the domain-scoped variant plus the host-only one so logout works in
  // every mode.
  response.cookies.set("fp_session", "", { maxAge: 0, path: "/" });
  const sessionDomain = process.env.FP_SESSION_DOMAIN;
  if (sessionDomain) {
    response.cookies.set("fp_session", "", { maxAge: 0, path: "/", domain: sessionDomain });
  }
  return response;
}