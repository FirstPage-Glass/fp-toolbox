import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASIC_USER = "firstpage";
const BASIC_PASS = "ilovefirstpage";
const REALM = "FP Toolbox";

function requireAuth() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets and API routes without basic auth
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return requireAuth();
  }

  try {
    const decoded = atob(authHeader.slice(6));
    const [user, pass] = decoded.split(":");
    if (user !== BASIC_USER || pass !== BASIC_PASS) {
      return requireAuth();
    }
  } catch {
    return requireAuth();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
