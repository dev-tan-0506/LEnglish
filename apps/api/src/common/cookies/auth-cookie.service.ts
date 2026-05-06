import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { CookieOptions } from "express";

@Injectable()
export class AuthCookieService {
  constructor(private readonly config: ConfigService) {}

  get accessCookieName() {
    return String(this.config.get("AUTH_ACCESS_COOKIE_NAME"));
  }

  get refreshCookieName() {
    return String(this.config.get("AUTH_REFRESH_COOKIE_NAME"));
  }

  getAccessCookieOptions(): CookieOptions {
    const maxAgeMs = Number(this.config.get("JWT_ACCESS_TTL_SECONDS")) * 1000;
    return this.getBaseOptions(maxAgeMs);
  }

  getRefreshCookieOptions(): CookieOptions {
    const maxAgeMs = Number(this.config.get("JWT_REFRESH_TTL_SECONDS")) * 1000;
    return this.getBaseOptions(maxAgeMs);
  }

  getClearCookieOptions(): CookieOptions {
    // For clearCookie, maxAge isn't needed, but keep consistent flags.
    return this.getBaseOptions(0);
  }

  private getBaseOptions(maxAge: number): CookieOptions {
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

