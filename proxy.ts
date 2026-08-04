import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets pass through (files with an extension: images, manifest, etc.)
  if (pathname.startsWith("/_next/") || pathname === "/favicon.ico" || /\.[a-z0-9]+$/i.test(pathname)) {
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
  // Static files never hit the auth gate — includes all public icons/manifest/logo
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png|site.webmanifest|logo.png|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
