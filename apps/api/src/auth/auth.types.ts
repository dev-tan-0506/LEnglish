import type { AuthCookieService } from "../common/cookies/auth-cookie.service";

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

export type AuthRequest = {
  cookies?: Record<string, unknown>;
};

export type AuthResponse = {
  cookie: (
    name: string,
    value: string,
    options: ReturnType<AuthCookieService["getAccessCookieOptions"]>
  ) => void;
  clearCookie: (
    name: string,
    options: ReturnType<AuthCookieService["getClearCookieOptions"]>
  ) => void;
};

export type CreateRefreshTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};
