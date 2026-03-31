import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Keep proxy self-contained: it must not import modules that depend on
// `next/headers` or `next/navigation`.
const AUTH_COOKIE_NAME = "mouna_session";

export function proxy(request: NextRequest) {
  const isAuthenticated = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((pathname === "/login" || pathname === "/signup") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
