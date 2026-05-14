import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import crypto from "node:crypto";
import { AuthRepository } from "../auth/auth.repository";
import { MailService } from "../mail/mail.service";
import { UsersService } from "../users/users.service";
import { PASSWORD_RESET_MESSAGES } from "./password-reset.messages";
import { PasswordResetRepository } from "./password-reset.repository";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository
  ) {}

  /** Accepts a reset request without revealing whether the email exists. */
  async requestReset(email: string) {
    const response = this.acceptedResponse();
    const user = await this.usersService.findWithPasswordHashByEmail(email);
    if (!user) return response;

    const token = crypto.randomBytes(32).toString("base64url");
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await this.passwordResetRepository.createToken({
      userId: user.id,
      tokenHash,
      expiresAt
    });

    await this.mailService.sendPasswordResetEmail(user.email, this.buildResetUrl(token));
    return response;
  }

  /** Confirms a valid reset token and replaces the user's password. */
  async confirmReset(token: string, password: string) {
    const now = new Date();
    const tokenHash = this.hashToken(token);
    const record = await this.passwordResetRepository.findActiveTokenByHash(tokenHash, now);
    if (!record) throw new BadRequestException(PASSWORD_RESET_MESSAGES.INVALID_TOKEN);

    await this.usersService.updatePassword(record.userId, password);
    await this.passwordResetRepository.consumeToken(record.id, now);
    await this.authRepository.revokeActiveRefreshTokensForUser(record.userId, now);

    return { ok: true };
  }

  /** Hashes a reset token before persistence or lookup. */
  private hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /** Builds the public web reset URL containing the opaque token. */
  private buildResetUrl(token: string) {
    const baseUrl = String(this.configService.get("PUBLIC_WEB_URL")).replace(/\/$/, "");
    return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  }

  /** Returns the generic public response for every reset request. */
  private acceptedResponse() {
    return {
      ok: true,
      message: PASSWORD_RESET_MESSAGES.REQUEST_ACCEPTED
    };
  }
}
