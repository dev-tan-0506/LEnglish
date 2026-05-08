import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import crypto from "node:crypto";
import type { AccessTokenPayload } from "./auth.types";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  /** Signs a short-lived JWT access token. */
  async signAccessToken(payload: AccessTokenPayload) {
    const secret = String(this.config.get("JWT_ACCESS_SECRET"));
    const ttlSeconds = Number(this.config.get("JWT_ACCESS_TTL_SECONDS"));

    return this.jwt.signAsync(payload, {
      secret,
      expiresIn: ttlSeconds
    });
  }

  /** Verifies and decodes a JWT access token. */
  async verifyAccessToken(token: string) {
    const secret = String(this.config.get("JWT_ACCESS_SECRET"));
    return this.jwt.verifyAsync<AccessTokenPayload>(token, { secret });
  }

  /** Generates an opaque refresh token for storage as a hash. */
  generateRefreshToken() {
    return crypto.randomBytes(32).toString("base64url");
  }

  /** Hashes a refresh token before persistence or lookup. */
  hashRefreshToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
