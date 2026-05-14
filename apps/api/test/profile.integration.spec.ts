import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import cookieParser from "cookie-parser";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("profile integration (phase 01-03)", () => {
  let app: INestApplication;
  let prismaMock: any;
  let usersByEmail: Map<string, any>;
  let profilesByUserId: Map<string, any>;
  let refreshTokensById: Map<string, any>;

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
    process.env.PUBLIC_WEB_URL = process.env.PUBLIC_WEB_URL ?? "http://localhost:3000";

    usersByEmail = new Map<string, any>();
    profilesByUserId = new Map<string, any>();
    refreshTokensById = new Map<string, any>();

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
          const user = {
            id,
            email: data.email,
            passwordHash: data.passwordHash
          };
          usersByEmail.set(user.email, user);
          profilesByUserId.set(id, profile);
          return include?.profile ? { ...user, profile } : user;
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
          for (const token of refreshTokensById.values()) {
            if (token.userId === where.userId && token.revokedAt === where.revokedAt) {
              Object.assign(token, data);
            }
          }
          return { count: 0 };
        })
      },
      passwordResetToken: {
        create: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn()
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
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    usersByEmail.clear();
    profilesByUserId.clear();
    refreshTokensById.clear();
  });

  /** Registers a test user and returns cookie pairs for authenticated requests. */
  async function registerAndCookies(email: string, name: string) {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password: "Strong1!", name })
      .expect(201);

    const cookies = res.headers["set-cookie"] as unknown as string[];
    return cookies.map((cookie) => cookie.split(";", 1)[0]!);
  }

  it("protects profile routes and scopes view/update to the authenticated user", async () => {
    await request(app.getHttpServer()).get("/profile/me").expect(401);

    const firstCookies = await registerAndCookies("profile1@example.com", "Profile One");
    const secondCookies = await registerAndCookies("profile2@example.com", "Profile Two");

    const updateRes = await request(app.getHttpServer())
      .patch("/profile/me")
      .set("Cookie", firstCookies)
      .send({
        name: "Updated One",
        targetToeicScore: 750,
        bio: "Working toward a stronger listening score.",
        birthdate: "1994-02-03",
        currentEnglishLevel: "Intermediate",
        userId: "u_2"
      })
      .expect(400);

    expect(updateRes.body.message).toContain("property userId should not exist");

    const validUpdate = await request(app.getHttpServer())
      .patch("/profile/me")
      .set("Cookie", firstCookies)
      .send({
        name: "Updated One",
        targetToeicScore: 750,
        bio: "Working toward a stronger listening score.",
        birthdate: "1994-02-03",
        currentEnglishLevel: "Intermediate"
      })
      .expect(200);

    expect(validUpdate.body.name).toBe("Updated One");
    expect(validUpdate.body.targetToeicScore).toBe(750);
    expect(validUpdate.body.currentEnglishLevel).toBe("Intermediate");

    await request(app.getHttpServer())
      .patch("/profile/me")
      .set("Cookie", secondCookies)
      .send({ name: "Second Changed", targetToeicScore: 600 })
      .expect(200);

    const firstProfile = await request(app.getHttpServer())
      .get("/profile/me")
      .set("Cookie", firstCookies)
      .expect(200);

    expect(firstProfile.body.name).toBe("Updated One");
    expect(firstProfile.body.targetToeicScore).toBe(750);
  });

  it("rejects invalid TOEIC score and English level values", async () => {
    const cookies = await registerAndCookies("invalid-profile@example.com", "Invalid Profile");

    await request(app.getHttpServer())
      .patch("/profile/me")
      .set("Cookie", cookies)
      .send({ targetToeicScore: 500 })
      .expect(400);

    await request(app.getHttpServer())
      .patch("/profile/me")
      .set("Cookie", cookies)
      .send({ currentEnglishLevel: "Expert" })
      .expect(400);
  });

  it("supports preset avatars and validates custom avatar uploads", async () => {
    const cookies = await registerAndCookies("avatar@example.com", "Avatar User");

    const presetRes = await request(app.getHttpServer())
      .post("/profile/avatar")
      .set("Cookie", cookies)
      .field("presetAvatarId", "owl-blue")
      .expect(201);

    expect(presetRes.body.avatarPresetId).toBe("owl-blue");
    expect(presetRes.body.avatarUrl).toBeNull();

    await request(app.getHttpServer())
      .post("/profile/avatar")
      .set("Cookie", cookies)
      .attach("file", Buffer.from("not an image"), {
        filename: "note.txt",
        contentType: "text/plain"
      })
      .expect(400);

    const uploadRes = await request(app.getHttpServer())
      .post("/profile/avatar")
      .set("Cookie", cookies)
      .attach("file", Buffer.from([0x89, 0x50, 0x4e, 0x47]), {
        filename: "avatar.png",
        contentType: "image/png"
      })
      .expect(201);

    expect(uploadRes.body.avatarPresetId).toBeNull();
    expect(uploadRes.body.avatarUrl).toMatch(/^\/uploads\/avatars\/.+\.png$/);
  });
});
