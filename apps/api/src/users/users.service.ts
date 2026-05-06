import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon2 from "argon2";

type CreateUserInput = {
  email: string;
  password: string;
  name: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(input: CreateUserInput) {
    const email = input.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException("Email already in use");

    const passwordHash = await argon2.hash(input.password);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            name: input.name.trim()
          }
        }
      },
      include: {
        profile: true
      }
    });

    return this.sanitizeUser(user);
  }

  async findByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true }
    });
    if (!user) throw new NotFoundException("User not found");
    return this.sanitizeUser(user);
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });
    if (!user) throw new NotFoundException("User not found");
    return this.sanitizeUser(user);
  }

  async findWithPasswordHashByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    return this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true }
    });
  }

  sanitizeUser<T extends { passwordHash?: unknown }>(user: T) {
    const { passwordHash: _passwordHash, ...rest } = user as any;
    return rest as Omit<T, "passwordHash">;
  }
}
