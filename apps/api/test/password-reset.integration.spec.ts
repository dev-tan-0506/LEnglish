import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as argon2 from "argon2";
import cookieParser from "cookie-parser";
import crypto from "node:crypto";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module";
import { MailService } from "../src/mail/mail.service";
import { PrismaService } from "../src/prisma/prisma.service";

describe("password reset integration (phase 01-03)", () => {
  let app: INestApplication;
  let mailService: MailService;
  let prismaMock: any;
  let usersByEmail: Map<string, any>;
  let profilesByUserId: Map<string, any>;
  let refreshTokensById: Map<string, any>;
  let resetTokensById: Map<string, any>;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL =
      process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/test?schema=public";
    process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "x".repeat(40);
    process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "y".repeat(40);
    process.env.JWT_ACCESS_TTL_SECONDS = process.env.JWT_ACCESS_TTL_SECONDS ?? "900";
    process.env.JWT_REFRESH_TTL_SECONDS = process.env.JWT_REFRESH_TTL_SECONDS ?? "604800";
    process.env.AUTH_ACCESS_COOKIE_NAME = process.env.AUTH_ACCESS_COOKIE_NAME ?? "lenglish_access";
    process.env.AUTH_REFRESH_COOKIE_NAME = process.env.AUTH_REFRESH_COOKIE_NAME ?? "lenglish_refresh";
    process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";
    process.env.API_PORT = process.env.API_PORT ?? "4000";
    process.env.PUBLIC_WEB_URL = "http://localhost:3000";

    usersByEmail = new Map<string, any>();
    profilesByUserId = new Map<string, any>();
    refreshTokensById = new Map<string, any>();
    resetTokensById = new Map<string, any>();

    prismaMock = {
      user: {
        findUnique: vi.fn(async ({ where, include }: any) => {
          const user = where?.email
            ? usersByEmail.get(where.email)
            : [...usersByEmail.values()].find((candidate) => candidate.id === where?.id);
          if (!user) return null;
          const profile = profilesByUserId.get(user.id);
          return include?.profile ? { ...user, profile } : user;
        }),
        create: vi.fn(async ({ data, include }: any) => {
          const id = `u_${usersByEmail.size + 1}`;
          const profile = {
            id: `p_${usersByEmail.size + 1}`,
            userId: id,
            name: data.profile.create.name
          };
          const user = {
            id,
            email: data.email,
            passwordHash: data.passwordHash
          };
          usersByEmail.set(user.email, user);
          profilesByUserId.set(id, profile);
          return include?.profile ? { ...user, profile } : user;
        }),
        update: vi.fn(async ({ where, data }: any) => {
          const user = [...usersByEmail.values()].find((candidate) => candidate.id === where.id);
          if (!user) throw new Error("user not found");
          Object.assign(user, data);
          return user;
        })
      },
      profile: {
        findUnique: vi.fn(),
        update: vi.fn()
      },
      refreshToken: {
        create: vi.fn(async ({ data }: any) => {
          const id = `rt_${refreshTokensById.size + 1}`;
          const record = { id, ...data, revokedAt: null, replacedById: null };
          refreshTokensById.set(id, record);
          return record;
        }),
        findFirst: vi.fn(async ({ where }: any) => {
          const now = new Date();
          return (
            [...refreshTokensById.values()].find((token) => {
              if (where?.tokenHash && token.tokenHash !== where.tokenHash) return false;
              if (where?.revokedAt === null && token.revokedAt !== null) return false;
              if (where?.expiresAt?.gt && !(token.expiresAt > now)) return false;
              return true;
            }) ?? null
          );
        }),
        update: vi.fn(async ({ where, data }: any) => {
          const token = refreshTokensById.get(where.id);
          if (!token) throw new Error("refresh token not found");
          Object.assign(token, data);
          return token;
        }),
        updateMany: vi.fn(async ({ where, data }: any) => {
          let count = 0;
          for (const token of refreshTokensById.values()) {
            if (token.userId === where.userId && token.revokedAt === where.revokedAt) {
              Object.assign(token, data);
              count += 1;
            }
          }
          return { count };
        })
      },
      passwordResetToken: {
        create: vi.fn(async ({ data }: any) => {
          const id = `prt_${resetTokensById.size + 1}`;
          const record = { id, ...data, consumedAt: null };
          resetTokensById.set(id, record);
          return record;
        }),
        findFirst: vi.fn(async ({ where }: any) => {
          const now = new Date();
          return (
            [...resetTokensById.values()].find((token) => {
              if (where?.tokenHash && token.tokenHash !== where.tokenHash) return false;
              if (where?.consumedAt === null && token.consumedAt !== null) return false;
              if (where?.expiresAt?.gt && !(token.expiresAt > now)) return false;
              return true;
            }) ?? null
          );
        }),
        update: vi.fn(async ({ where, data }: any) => {
          const token = resetTokensById.get(where.id);
          if (!token) throw new Error("reset token not found");
          Object.assign(token, data);
          return token;
        })
      }
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    );
    await app.init();
    mailService = app.get(MailService);
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    usersByEmail.clear();
    profilesByUserId.clear();
    refreshTokensById.clear();
    resetTokensById.clear();
    mailService.clearSentMessages();
  });

  /** Registers a known account through the public auth endpoint. */
  async function registerUser(email: string) {
    return request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password: "Strong1!", name: "Reset User" })
      .expect(201);
  }

  it("returns the same public response for known and unknown emails", async () => {
    await registerUser("known@example.com");

    const known = await request(app.getHttpServer())
      .post("/password-reset/request")
      .send({ email: "known@example.com" })
      .expect(201);

    const unknown = await request(app.getHttpServer())
      .post("/password-reset/request")
      .send({ email: "unknown@example.com" })
      .expect(201);

    expect(known.body).toEqual(unknown.body);
    expect(known.body.ok).toBe(true);
    expect(mailService.getSentMessages()).toHaveLength(1);
  });

  it("hashes reset tokens, enforces expiry, and rejects reused tokens", async () => {
    await registerUser("reset@example.com");

    await request(app.getHttpServer())
      .post("/password-reset/request")
      .send({ email: "reset@example.com" })
      .expect(201);

    const sent = mailService.getSentMessages()[0]!;
    const token = new URL(sent.resetUrl).searchParams.get("token")!;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const stored = [...resetTokensById.values()][0]!;

    expect(stored.tokenHash).toBe(tokenHash);
    expect(stored.tokenHash).not.toBe(token);

    stored.expiresAt = new Date(Date.now() - 1000);
    await request(app.getHttpServer())
      .post("/password-reset/confirm")
      .send({ token, password: "NewStrong1!" })
      .expect(400);

    stored.expiresAt = new Date(Date.now() + 60_000);
    await request(app.getHttpServer())
      .post("/password-reset/confirm")
      .send({ token, password: "NewStrong1!" })
      .expect(201);

    expect(stored.consumedAt).toBeInstanceOf(Date);
    expect(prismaMock.refreshToken.updateMany).toHaveBeenCalled();

    await request(app.getHttpServer())
      .post("/password-reset/confirm")
      .send({ token, password: "Another1!" })
      .expect(400);
  });

  it("allows login with the new password after reset confirmation", async () => {
    await registerUser("login-after-reset@example.com");

    await request(app.getHttpServer())
      .post("/password-reset/request")
      .send({ email: "login-after-reset@example.com" })
      .expect(201);

    const token = new URL(mailService.getSentMessages()[0]!.resetUrl).searchParams.get("token")!;

    await request(app.getHttpServer())
      .post("/password-reset/confirm")
      .send({ token, password: "FreshStrong1!" })
      .expect(201);

    const user = usersByEmail.get("login-after-reset@example.com")!;
    await expect(argon2.verify(user.passwordHash, "FreshStrong1!")).resolves.toBe(true);

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "login-after-reset@example.com", password: "FreshStrong1!" })
      .expect(201);
  });
});
