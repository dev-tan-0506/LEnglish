import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import * as argon2 from "argon2";
import { USERS_ERROR_MESSAGES } from "./users.messages";
import { UsersRepository } from "./users.repository";
import type { CreateUserInput } from "./users.types";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /** Creates a user with a normalized email and hashed password. */
  async createUser(input: CreateUserInput) {
    const email = input.email.trim().toLowerCase();

    const existing = await this.usersRepository.findByEmail(email);
    if (existing) throw new ConflictException(USERS_ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);

    const passwordHash = await argon2.hash(input.password);

    const user = await this.usersRepository.createUser({
      email,
      passwordHash,
      name: input.name.trim()
    });

    return this.sanitizeUser(user);
  }

  /** Finds a user by email and returns a sanitized profile. */
  async findByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersRepository.findByEmail(normalizedEmail);
    if (!user) throw new NotFoundException(USERS_ERROR_MESSAGES.USER_NOT_FOUND);
    return this.sanitizeUser(user);
  }

  /** Finds a user by id and returns a sanitized profile. */
  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(USERS_ERROR_MESSAGES.USER_NOT_FOUND);
    return this.sanitizeUser(user);
  }

  /** Finds a user by email including password hash for credential checks. */
  async findWithPasswordHashByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    return this.usersRepository.findByEmail(normalizedEmail);
  }

  /** Replaces a user's password with a freshly hashed value. */
  async updatePassword(userId: string, password: string) {
    const passwordHash = await argon2.hash(password);
    return this.usersRepository.updatePasswordHash(userId, passwordHash);
  }

  /** Removes passwordHash from a user-shaped object. */
  sanitizeUser<T extends { passwordHash?: unknown }>(user: T) {
    const { passwordHash: _passwordHash, ...rest } = user as any;
    return rest as Omit<T, "passwordHash">;
  }
}
