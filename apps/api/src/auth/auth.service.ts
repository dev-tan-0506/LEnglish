import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../prisma/prisma.service";
import { TokenService } from "./token.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as argon2 from "argon2";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
    private readonly config: ConfigService
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.users.createUser({
      email: dto.email,
      password: dto.password,
      name: dto.name
    });

    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.email);
    await this.persistRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const userRecord = await this.users.findWithPasswordHashByEmail(dto.email);
    if (!userRecord) throw new UnauthorizedException("Invalid email or password");

    const ok = await argon2.verify(userRecord.passwordHash, dto.password);
    if (!ok) throw new UnauthorizedException("Invalid email or password");

    const user = this.users.sanitizeUser(userRecord);
    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.email);
    await this.persistRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  async refresh(refreshTokenRaw: string) {
    const tokenHash = this.tokens.hashRefreshToken(refreshTokenRaw);
    const now = new Date();

    const existing = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: now }
      }
    });

    if (!existing) throw new UnauthorizedException("Invalid refresh token");

    const userRecord = await this.prisma.user.findUnique({
      where: { id: existing.userId },
      include: { profile: true }
    });
    if (!userRecord) throw new UnauthorizedException("Invalid refresh token");

    const user = this.users.sanitizeUser(userRecord);
    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.email);

    // Rotate: create a new token record, then revoke the old and link it.
    const newRecord = await this.persistRefreshToken(user.id, refreshToken);
    await this.revokeRefreshToken(existing.id, now, newRecord.id);

    return { user, accessToken, refreshToken };
  }

  async logout(refreshTokenRaw?: string) {
    if (!refreshTokenRaw) return;
    const tokenHash = this.tokens.hashRefreshToken(refreshTokenRaw);
    const now = new Date();

    const existing = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null }
    });
    if (!existing) return;

    await this.revokeRefreshToken(existing.id, now);
  }

  private async issueTokens(userId: string, email: string) {
    const accessToken = await this.tokens.signAccessToken({ sub: userId, email });
    const refreshToken = this.tokens.generateRefreshToken();

    return { accessToken, refreshToken };
  }

  private computeRefreshExpiry() {
    const seconds = Number(this.config.get("JWT_REFRESH_TTL_SECONDS"));
    return new Date(Date.now() + seconds * 1000);
  }

  private async persistRefreshToken(userId: string, refreshTokenRaw: string) {
    const tokenHash = this.tokens.hashRefreshToken(refreshTokenRaw);
    const expiresAt = this.computeRefreshExpiry();
    return this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt
      }
    });
  }

  private async revokeRefreshToken(id: string, revokedAt: Date, replacedById?: string) {
    await this.prisma.refreshToken.update({
      where: { id },
      data: {
        revokedAt,
        ...(replacedById ? { replacedById } : {})
      }
    });
  }
}
