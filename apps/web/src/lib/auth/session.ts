import type { AuthUser } from "../api/auth";
import { buildApiUrl } from "../api/client";

/** Fetches the current user from the backend without reading token values. */
export async function fetchSessionUser(cookieHeader = ""): Promise<AuthUser | null> {
  const response = await fetch(buildApiUrl("/auth/me"), {
    method: "GET",
    credentials: "include",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store"
  });

  if (!response.ok) return null;
  return (await response.json()) as AuthUser;
}

/** Chooses the post-auth route from profile completion state. */
export function getPostAuthRedirect(user: AuthUser) {
  return user.profile?.targetToeicScore ? "/profile" : "/onboarding";
}
