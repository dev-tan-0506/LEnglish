import type { AuthUser } from "../../types/auth.types";
import { api } from "../../lib/client";
import { API_ENDPOINTS } from "../../consts/endpoints";

/** Fetches the current user from the backend without reading token values. */
export async function fetchSessionUser(cookieHeader = ""): Promise<AuthUser | null> {
  try {
    return await api.get<AuthUser>(API_ENDPOINTS.auth.me, {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store"
    });
  } catch {
    return null;
  }
}

/** Chooses the post-auth route from profile completion state. */
export function getPostAuthRedirect(user: AuthUser) {
  return user.profile?.targetToeicScore ? "/profile" : "/onboarding";
}







