import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateUserRecordInput } from "./users.types";

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /** Loads a user and profile by normalized email. */
  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { profile: true }
    });
  }

  /** Loads a user and profile by id. */
  async findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: { profile: true }
    });
  }

  /** Inserts a user and its profile record. */
  async createUser(input: CreateUserRecordInput) {
    return this.prismaService.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        profile: {
          create: {
            name: input.name
          }
        }
      },
      include: {
        profile: true
      }
    });
  }
}
