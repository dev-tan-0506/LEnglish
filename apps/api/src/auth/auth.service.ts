import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { TokenService } from "./token.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as argon2 from "argon2";
import { ConfigService } from "@nestjs/config";
import { AuthCookieService } from "../common/cookies/auth-cookie.service";
import { AUTH_ERROR_MESSAGES } from "./auth.messages";
import { AuthRepository } from "./auth.repository";
import type { AuthRequest, AuthResponse } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly authCookieService: AuthCookieService,
    private readonly authRepository: AuthRepository
  ) {}

  /** Registers a new user, persists a refresh token, and sets auth cookies. */
  async register(dto: RegisterDto, res: AuthResponse) {
    const user = await this.usersService.createUser({
      email: dto.email,
      password: dto.password,
      name: dto.name
    });

    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.email);
    await this.persistRefreshToken(user.id, refreshToken);
    this.setAuthCookies(res, accessToken, refreshToken);

    return user;
  }

  /** Authenticates credentials, issues tokens, and sets auth cookies. */
  async login(dto: LoginDto, res: AuthResponse) {
    const userRecord = await this.usersService.findWithPasswordHashByEmail(dto.email);
    if (!userRecord) throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);

    const ok = await argon2.verify(userRecord.passwordHash, dto.password);
    if (!ok) throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);

    const user = this.usersService.sanitizeUser(userRecord);
    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.email);
    await this.persistRefreshToken(user.id, refreshToken);
    this.setAuthCookies(res, accessToken, refreshToken);

    return user;
  }

  /** Rotates a valid refresh token and returns the matching user. */
  async refresh(req: AuthRequest, res: AuthResponse) {
    const refreshTokenRaw = this.getRefreshTokenFromRequest(req);
    if (!refreshTokenRaw) throw new UnauthorizedException(AUTH_ERROR_MESSAGES.MISSING_REFRESH_TOKEN);

    const tokenHash = this.tokenService.hashRefreshToken(refreshTokenRaw);
    const now = new Date();

    const existing = await this.authRepository.findActiveRefreshTokenByHash(tokenHash, now);

    if (!existing) throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_REFRESH_TOKEN);

    const userRecord = await this.authRepository.findUserByIdWithProfile(existing.userId);
    if (!userRecord) throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_REFRESH_TOKEN);

    const user = this.usersService.sanitizeUser(userRecord);
    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.email);

    // Rotate: create a new token record, then revoke the old and link it.
    const newRecord = await this.persistRefreshToken(user.id, refreshToken);
    await this.authRepository.revokeRefreshToken(existing.id, now, newRecord.id);
    this.setAuthCookies(res, accessToken, refreshToken);

    return user;
  }

  /** Revokes the active refresh token when present and clears auth cookies. */
  async logout(req: AuthRequest, res: AuthResponse) {
    const refreshTokenRaw = this.getRefreshTokenFromRequest(req);
    if (!refreshTokenRaw) {
      this.clearAuthCookies(res);
      return { ok: true };
    }

    const tokenHash = this.tokenService.hashRefreshToken(refreshTokenRaw);
    const now = new Date();

    const existing = await this.authRepository.findUnrevokedRefreshTokenByHash(tokenHash);
    if (existing) {
      await this.authRepository.revokeRefreshToken(existing.id, now);
    }

    this.clearAuthCookies(res);
    return { ok: true };
  }

  /** Loads the authenticated user's public profile. */
  async me(userId: string) {
    return this.usersService.findById(userId);
  }

  /** Creates a signed access token and an opaque refresh token. */
  private async issueTokens(userId: string, email: string) {
    const accessToken = await this.tokenService.signAccessToken({ sub: userId, email });
    const refreshToken = this.tokenService.generateRefreshToken();

    return { accessToken, refreshToken };
  }

  /** Reads the configured refresh token cookie from a request. */
  private getRefreshTokenFromRequest(req: AuthRequest) {
    return (req.cookies?.[this.authCookieService.refreshCookieName] ?? "") as string;
  }

  /** Writes access and refresh cookies to the response. */
  private setAuthCookies(res: AuthResponse, accessToken: string, refreshToken: string) {
    res.cookie(
      this.authCookieService.accessCookieName,
      accessToken,
      this.authCookieService.getAccessCookieOptions()
    );
    res.cookie(
      this.authCookieService.refreshCookieName,
      refreshToken,
      this.authCookieService.getRefreshCookieOptions()
    );
  }

  /** Clears access and refresh cookies from the response. */
  private clearAuthCookies(res: AuthResponse) {
    res.clearCookie(
      this.authCookieService.accessCookieName,
      this.authCookieService.getClearCookieOptions()
    );
    res.clearCookie(
      this.authCookieService.refreshCookieName,
      this.authCookieService.getClearCookieOptions()
    );
  }

  /** Computes the refresh token expiry timestamp from configuration. */
  private computeRefreshExpiry() {
    const seconds = Number(this.configService.get("JWT_REFRESH_TTL_SECONDS"));
    return new Date(Date.now() + seconds * 1000);
  }

  /** Hashes and stores a refresh token record for later validation. */
  private async persistRefreshToken(userId: string, refreshTokenRaw: string) {
    const tokenHash = this.tokenService.hashRefreshToken(refreshTokenRaw);
    const expiresAt = this.computeRefreshExpiry();
    return this.authRepository.createRefreshToken({
      userId,
      tokenHash,
      expiresAt
    });
  }
}
