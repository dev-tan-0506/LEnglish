import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export type AuthCookieOptions = {
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge: number;
};

@Injectable()
export class AuthCookieService {
  constructor(private readonly config: ConfigService) {}

  /** Returns the configured access token cookie name. */
  get accessCookieName() {
    return String(this.config.get("AUTH_ACCESS_COOKIE_NAME"));
  }

  /** Returns the configured refresh token cookie name. */
  get refreshCookieName() {
    return String(this.config.get("AUTH_REFRESH_COOKIE_NAME"));
  }

  /** Builds cookie options for access token cookies. */
  getAccessCookieOptions(): AuthCookieOptions {
    const maxAgeMs = Number(this.config.get("JWT_ACCESS_TTL_SECONDS")) * 1000;
    return this.getBaseOptions(maxAgeMs);
  }

  /** Builds cookie options for refresh token cookies. */
  getRefreshCookieOptions(): AuthCookieOptions {
    const maxAgeMs = Number(this.config.get("JWT_REFRESH_TTL_SECONDS")) * 1000;
    return this.getBaseOptions(maxAgeMs);
  }

  /** Builds cookie options for clearing auth cookies. */
  getClearCookieOptions(): AuthCookieOptions {
    // For clearCookie, maxAge isn't needed, but keep consistent flags.
    return this.getBaseOptions(0);
  }

  /** Builds common cookie options with environment-aware security flags. */
  private getBaseOptions(maxAge: number): AuthCookieOptions {
    const nodeEnv = String(this.config.get("NODE_ENV") ?? "development");
    const isProd = nodeEnv === "production";
    return {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge
    };
  }
}
