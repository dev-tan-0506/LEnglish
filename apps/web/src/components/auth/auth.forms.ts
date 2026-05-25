import type { AuthUser } from "../../types/auth.types";

export const passwordPolicyText =
  "Use at least 8 characters with an uppercase letter, a number, and a symbol.";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

/** Checks the shared D-04 password policy. */
export function isStrongPassword(password: string) {
  return PASSWORD_REGEX.test(password);
}

/** Chooses the first route after a successful auth flow. */
export function authDestination(user: AuthUser) {
  return user.profile?.targetToeicScore ? "/profile" : "/onboarding";
}


