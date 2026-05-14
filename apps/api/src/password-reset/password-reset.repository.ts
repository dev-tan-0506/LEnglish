import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreatePasswordResetTokenInput } from "./password-reset.types";

@Injectable()
export class PasswordResetRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /** Inserts a hashed password reset token. */
  async createToken(input: CreatePasswordResetTokenInput) {
    return this.prismaService.passwordResetToken.create({
      data: input
    });
  }

  /** Finds an unconsumed, unexpired reset token by hash. */
  async findActiveTokenByHash(tokenHash: string, now: Date) {
    return this.prismaService.passwordResetToken.findFirst({
      where: {
        tokenHash,
        consumedAt: null,
        expiresAt: { gt: now }
      }
    });
  }

  /** Marks a reset token as consumed. */
  async consumeToken(id: string, consumedAt: Date) {
    return this.prismaService.passwordResetToken.update({
      where: { id },
      data: { consumedAt }
    });
  }
}
