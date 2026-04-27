import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASIC_USER = "firstpage";
const BASIC_PASS = "ilovefirstpage";
const REALM = "FP Toolbox";

function requireBasicAuth() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets without auth
  if (pathname.startsWith("/_next/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // ── 1. HTTP Basic Auth — outer gate for entire site ──
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return requireBasicAuth();
  }
  try {
    const decoded = atob(authHeader.slice(6));
    const [user, pass] = decoded.split(":");
    if (user !== BASIC_USER || pass !== BASIC_PASS) {
      return requireBasicAuth();
    }
  } catch {
    return requireBasicAuth();
  }

  // ── 2. Cookie auth — view-level (Toolbox vs System) ──
  // API routes handle their own auth
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("fp-auth");
  const isLoggedIn = authCookie?.value === "authenticated";

  // Public paths — accessible after Basic Auth
  if (pathname === "/toolbox" || pathname === "/login") {
    if (isLoggedIn && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Not logged in → redirect to toolbox
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/toolbox", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
