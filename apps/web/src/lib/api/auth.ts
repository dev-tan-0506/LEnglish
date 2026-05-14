import { apiRequest } from "./client";

export type AuthUser = {
  id: string;
  email: string;
  profile?: {
    name?: string;
    targetToeicScore?: number | null;
  } | null;
};

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type PasswordResetRequestInput = {
  email: string;
};

export type PasswordResetConfirmInput = {
  token: string;
  password: string;
};

/** Registers a new account and lets the backend set session cookies. */
export function register(input: RegisterInput) {
  return apiRequest<AuthUser>("/auth/register", {
    method: "POST",
    body: input
  });
}

/** Logs in with credentials and lets the backend set session cookies. */
export function login(input: LoginInput) {
  return apiRequest<AuthUser>("/auth/login", {
    method: "POST",
    body: input
  });
}

/** Logs out and asks the backend to clear auth cookies. */
export function logout() {
  return apiRequest<{ ok: true }>("/auth/logout", {
    method: "POST"
  });
}

/** Loads the current user through the backend session endpoint. */
export function me() {
  return apiRequest<AuthUser>("/auth/me");
}

/** Requests a generic password reset email response. */
export function requestPasswordReset(input: PasswordResetRequestInput) {
  return apiRequest<{ ok: true; message: string }>("/password-reset/request", {
    method: "POST",
    body: input
  });
}

/** Confirms a reset token and sets a new password. */
export function confirmPasswordReset(input: PasswordResetConfirmInput) {
  return apiRequest<{ ok: true }>("/password-reset/confirm", {
    method: "POST",
    body: input
  });
}
