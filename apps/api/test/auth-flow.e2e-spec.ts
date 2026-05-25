import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as argon2 from "argon2";
import cookieParser from "cookie-parser";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module";
import { MailService } from "../src/mail/mail.service";
import { PrismaService } from "../src/prisma/prisma.service";

/** Normalizes set-cookie header values into cookie-pair strings. */
function toCookiePairs(setCookieHeader: string | string[] | undefined) {
  const cookieItems = Array.isArray(setCookieHeader) ? setCookieHeader : setCookieHeader ? [setCookieHeader] : [];
  return cookieItems.map((cookie) => cookie.split(";", 1)[0]!);
}

describe("auth flow e2e (phase 01-06)", () => {
  let app: INestApplication;
  let mailService: MailService;
  let prismaMock: any;
  let usersByEmail: Map<string, any>;
  let profilesByUserId: Map<string, any>;
  let refreshTokensById: Map<string, any>;
  let resetTokensById: Map<string, any>;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test?schema=public";
    process.env.JWT_ACCESS_SECRET ??= "x".repeat(40);
    process.env.JWT_REFRESH_SECRET ??= "y".repeat(40);
    process.env.JWT_ACCESS_TTL_SECONDS ??= "900";
    process.env.JWT_REFRESH_TTL_SECONDS ??= "604800";
    process.env.AUTH_ACCESS_COOKIE_NAME ??= "lenglish_access";
    process.env.AUTH_REFRESH_COOKIE_NAME ??= "lenglish_refresh";
    process.env.CORS_ORIGIN ??= "http://localhost:3000";
    process.env.API_PORT ??= "4000";
    process.env.PUBLIC_WEB_URL ??= "http://localhost:3000";

    usersByEmail = new Map();
    profilesByUserId = new Map();
    refreshTokensById = new Map();
    resetTokensById = new Map();

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
            name: data.profile.create.name,
            avatarPresetId: null,
            avatarUrl: null,
            targetToeicScore: null,
            bio: null,
            birthdate: null,
            currentEnglishLevel: null
          };
          const user = { id, email: data.email, passwordHash: data.passwordHash };
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
        findUnique: vi.fn(async ({ where }: any) => profilesByUserId.get(where.userId) ?? null),
        update: vi.fn(async ({ where, data }: any) => {
          const profile = profilesByUserId.get(where.userId);
          if (!profile) throw new Error("profile not found");
          Object.assign(profile, data);
          return profile;
        })
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

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
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

  it("covers register/login/profile/refresh/logout/reset contracts in one flow", async () => {
    const registerRes = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: "flow@example.com", password: "Strong1!", name: "Flow User" })
      .expect(201);

    expect(registerRes.headers["set-cookie"]?.length).toBeGreaterThan(0);

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: "flow@example.com", password: "Strong1!", name: "Flow User" })
      .expect(409);

    const loginRes = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "flow@example.com", password: "Strong1!" })
      .expect(201);

    const cookies = toCookiePairs(loginRes.headers["set-cookie"] as string | string[] | undefined);

    await request(app.getHttpServer()).get("/auth/me").set("Cookie", cookies).expect(200);

    await request(app.getHttpServer())
      .patch("/profile/me")
      .set("Cookie", cookies)
      .send({ name: "Flow Updated", targetToeicScore: 750, currentEnglishLevel: "Intermediate" })
      .expect(200);

    const refreshRes = await request(app.getHttpServer())
      .post("/auth/refresh")
      .set("Cookie", cookies)
      .expect(201);

    const rotatedCookies = toCookiePairs(refreshRes.headers["set-cookie"] as string | string[] | undefined);
    await request(app.getHttpServer()).post("/auth/logout").set("Cookie", rotatedCookies).expect(201);

    await request(app.getHttpServer())
      .post("/password-reset/request")
      .send({ email: "flow@example.com" })
      .expect(201);

    expect(mailService.getSentMessages().length).toBe(1);
    const token = new URL(mailService.getSentMessages()[0]!.resetUrl).searchParams.get("token")!;

    await request(app.getHttpServer())
      .post("/password-reset/confirm")
      .send({ token, password: "FreshStrong1!" })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "flow@example.com", password: "Strong1!" })
      .expect(401);

    const newLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "flow@example.com", password: "FreshStrong1!" })
      .expect(201);

    expect(newLogin.headers["set-cookie"]?.length).toBeGreaterThan(0);

    const user = usersByEmail.get("flow@example.com");
    await expect(argon2.verify(user.passwordHash, "FreshStrong1!")).resolves.toBe(true);
  });
});
