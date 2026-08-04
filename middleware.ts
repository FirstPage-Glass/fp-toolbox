import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets pass through
  if (pathname.startsWith("/_next/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // API routes handle their own auth
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("fp-auth");
  const isLoggedIn = Boolean(authCookie?.value);

  // Public paths
  if (pathname === "/toolbox" || pathname === "/login") {
    if (isLoggedIn && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Not logged in → toolbox
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/toolbox", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
