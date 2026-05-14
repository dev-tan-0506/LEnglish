import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { UpdateProfileInput } from "./profile.types";

@Injectable()
export class ProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /** Loads one profile by its owning user id. */
  async findByUserId(userId: string) {
    return this.prismaService.profile.findUnique({
      where: { userId }
    });
  }

  /** Updates profile fields for the authenticated owner. */
  async updateByUserId(userId: string, input: UpdateProfileInput) {
    return this.prismaService.profile.update({
      where: { userId },
      data: input as any
    });
  }
}
