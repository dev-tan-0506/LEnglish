import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchSessionUser } from "./lib/auth/session";

const PROTECTED_PREFIXES = ["/profile", "/dashboard", "/onboarding"];

/** Redirects unauthenticated app routes to login using the backend session check. */
export async function middleware(request: NextRequest) {
  const isProtected = PROTECTED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const user = await fetchSessionUser(request.headers.get("cookie") ?? "").catch(() => null);
  if (user) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*", "/onboarding/:path*"]
};
