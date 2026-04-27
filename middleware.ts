import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get("fp-auth");
  const isLoggedIn = authCookie?.value === "authenticated";

  // Public paths — always accessible
  if (
    pathname === "/toolbox" ||
    pathname === "/login" ||
    pathname.startsWith("/api/")
  ) {
    // Logged-in users on login page → redirect to overview
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
