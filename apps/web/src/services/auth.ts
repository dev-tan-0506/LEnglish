import { api } from "../lib/client";
import { API_ENDPOINTS } from "../consts/endpoints";
import type {
  AuthUser,
  RegisterInput,
  LoginInput,
  PasswordResetRequestInput,
  PasswordResetConfirmInput
} from "../types/auth.types";

/** Registers a new account and lets the backend set session cookies. */
export function register(input: RegisterInput) {
  return api.post<AuthUser>(API_ENDPOINTS.auth.register, input);
}

/** Logs in with credentials and lets the backend set session cookies. */
export function login(input: LoginInput) {
  return api.post<AuthUser>(API_ENDPOINTS.auth.login, input);
}

/** Logs out and asks the backend to clear auth cookies. */
export function logout() {
  return api.post<{ ok: true }>(API_ENDPOINTS.auth.logout);
}

/** Loads the current user through the backend session endpoint. */
export function me() {
  return api.get<AuthUser>(API_ENDPOINTS.auth.me);
}

/** Requests a generic password reset email response. */
export function requestPasswordReset(input: PasswordResetRequestInput) {
  return api.post<{ ok: true; message: string }>(API_ENDPOINTS.passwordReset.request, input);
}

/** Confirms a reset token and sets a new password. */
export function confirmPasswordReset(input: PasswordResetConfirmInput) {
  return api.post<{ ok: true }>(API_ENDPOINTS.passwordReset.confirm, input);
}

