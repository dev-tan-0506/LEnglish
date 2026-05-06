import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import crypto from "node:crypto";

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async signAccessToken(payload: AccessTokenPayload) {
    const secret = String(this.config.get("JWT_ACCESS_SECRET"));
    const ttlSeconds = Number(this.config.get("JWT_ACCESS_TTL_SECONDS"));

    return this.jwt.signAsync(payload, {
      secret,
      expiresIn: ttlSeconds
    });
  }

  async verifyAccessToken(token: string) {
    const secret = String(this.config.get("JWT_ACCESS_SECRET"));
    return this.jwt.verifyAsync<AccessTokenPayload>(token, { secret });
  }

  generateRefreshToken() {
    return crypto.randomBytes(32).toString("base64url");
  }

  hashRefreshToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}

