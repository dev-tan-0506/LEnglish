import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateRefreshTokenInput } from "./auth.types";

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /** Inserts a hashed refresh token record. */
  async createRefreshToken(input: CreateRefreshTokenInput) {
    return this.prismaService.refreshToken.create({
      data: input
    });
  }

  /** Finds a refresh token that is unrevoked and not expired. */
  async findActiveRefreshTokenByHash(tokenHash: string, now: Date) {
    return this.prismaService.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: now }
      }
    });
  }

  /** Finds an unrevoked refresh token without checking expiry. */
  async findUnrevokedRefreshTokenByHash(tokenHash: string) {
    return this.prismaService.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null }
    });
  }

  /** Loads a user and profile by user id. */
  async findUserByIdWithProfile(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
  }

  /** Marks a refresh token as revoked and optionally links its replacement. */
  async revokeRefreshToken(id: string, revokedAt: Date, replacedById?: string) {
    await this.prismaService.refreshToken.update({
      where: { id },
      data: {
        revokedAt,
        ...(replacedById ? { replacedById } : {})
      }
    });
  }
}
