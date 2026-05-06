import { describe, expect, it, vi, beforeAll, afterAll, beforeEach } from "vitest";
import { validate } from "class-validator";
import { ConflictException } from "@nestjs/common";
import { RegisterDto } from "../src/auth/dto/register.dto";
import { UsersService } from "../src/users/users.service";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import cookieParser from "cookie-parser";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import * as argon2 from "argon2";

describe("auth integration (phase 01-02)", () => {
  let app: INestApplication;
  let prismaMock: any;
  let usersByEmail: Map<string, any>;
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

    usersByEmail = new Map<string, any>();
    refreshTokensById = new Map<string, any>();

    prismaMock = {
      user: {
        findUnique: vi.fn(async ({ where, include }: any) => {
          if (where?.email) {
            const u = usersByEmail.get(where.email);
            if (!u) return null;
            return include?.profile ? u : { ...u, profile: undefined };
          }
          if (where?.id) {
            for (const u of usersByEmail.values()) {
              if (u.id === where.id) return include?.profile ? u : { ...u, profile: undefined };
            }
            return null;
          }
          return null;
        }),
        create: vi.fn(async ({ data, include }: any) => {
          const id = `u_${usersByEmail.size + 1}`;
          const created = {
            id,
            email: data.email,
            passwordHash: data.passwordHash,
            profile: { id: `p_${usersByEmail.size + 1}`, userId: id, name: data.profile.create.name }
          };
          usersByEmail.set(created.email, created);
          return include?.profile ? created : { ...created, profile: undefined };
        })
      },
      refreshToken: {
        create: vi.fn(async ({ data }: any) => {
          const id = `rt_${refreshTokensById.size + 1}`;
          const record = {
            id,
            userId: data.userId,
            tokenHash: data.tokenHash,
            expiresAt: data.expiresAt,
            revokedAt: null,
            replacedById: null
          };
          refreshTokensById.set(id, record);
          return record;
        }),
        findFirst: vi.fn(async ({ where }: any) => {
          const now = new Date();
          for (const rt of refreshTokensById.values()) {
            if (where?.tokenHash && rt.tokenHash !== where.tokenHash) continue;
            if (where?.revokedAt === null && rt.revokedAt !== null) continue;
            if (where?.expiresAt?.gt && !(rt.expiresAt > now)) continue;
            return rt;
          }
          return null;
        }),
        update: vi.fn(async ({ where, data }: any) => {
          const rt = refreshTokensById.get(where.id);
          if (!rt) throw new Error("refresh token not found");
          Object.assign(rt, data);
          return rt;
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
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    usersByEmail.clear();
    refreshTokensById.clear();
  });

  it("rejects weak passwords that do not meet D-04", async () => {
    const dto = new RegisterDto();
    dto.email = "user@example.com";
    dto.name = "Test User";
    dto.password = "password"; // missing uppercase, number, special char

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("accepts a strong password that meets D-04", async () => {
    const dto = new RegisterDto();
    dto.email = "user@example.com";
    dto.name = "Test User";
    dto.password = "Strong1!";

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it("normalizes email to lowercase and never returns passwordHash", async () => {
    const prismaMock = {
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({
          id: "u_1",
          email: "test@example.com",
          passwordHash: "secret-hash",
          profile: { id: "p_1", userId: "u_1", name: "Test" }
        })
      }
    };

    const service = new UsersService(prismaMock as any);
    const user = await service.createUser({
      email: "TEST@Example.com",
      password: "Strong1!",
      name: "Test"
    });

    expect(prismaMock.user.create).toHaveBeenCalled();
    const call = prismaMock.user.create.mock.calls[0]?.[0];
    expect(call.data.email).toBe("test@example.com");

    expect((user as any).passwordHash).toBeUndefined();
    expect(user.email).toBe("test@example.com");
  });

  it("throws 409 conflict for duplicate email", async () => {
    const prismaMock = {
      user: {
        findUnique: vi.fn().mockResolvedValue({ id: "u_existing" })
      }
    };

    const service = new UsersService(prismaMock as any);

    await expect(
      service.createUser({
        email: "test@example.com",
        password: "Strong1!",
        name: "Test"
      })
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("register sets httpOnly cookies and allows immediate access", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: "user1@example.com", password: "Strong1!", name: "User 1" })
      .expect(201);

    expect(res.body.email).toBe("user1@example.com");
    expect(res.body.passwordHash).toBeUndefined();

    const cookies = res.headers["set-cookie"] as string[] | undefined;
    expect(cookies).toBeTruthy();
    expect(cookies!.some((c) => c.includes("HttpOnly"))).toBe(true);
    expect(cookies!.some((c) => c.includes("SameSite=Lax"))).toBe(true);
  });

  it("login sets cookies and rejects invalid credentials", async () => {
    // Arrange: create a user directly via prisma mock for login flow.
    const passwordHash = await argon2.hash("Strong1!");
    await prismaMock.user.create({
      data: {
        email: "user2@example.com",
        passwordHash,
        profile: { create: { name: "User 2" } }
      },
      include: { profile: true }
    });

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "user2@example.com", password: "Wrong1!" })
      .expect(401);

    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "user2@example.com", password: "Strong1!" })
      .expect(201);

    const cookies = res.headers["set-cookie"] as string[] | undefined;
    expect(cookies).toBeTruthy();
    expect(cookies!.some((c) => c.includes("HttpOnly"))).toBe(true);
  });

  it("refresh rotates refresh token and logout revokes it", async () => {
    const registerRes = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: "user3@example.com", password: "Strong1!", name: "User 3" })
      .expect(201);

    const setCookies = registerRes.headers["set-cookie"] as string[];
    const accessCookie = setCookies.find((c) => c.startsWith("lenglish_access="))!;
    const refreshCookie = setCookies.find((c) => c.startsWith("lenglish_refresh="))!;

    const accessPair = accessCookie.split(";", 1)[0]!;
    const refreshPair = refreshCookie.split(";", 1)[0]!;

    const refreshRes = await request(app.getHttpServer())
      .post("/auth/refresh")
      .set("Cookie", [accessPair, refreshPair])
      .expect(201);

    const refreshSetCookies = refreshRes.headers["set-cookie"] as string[];
    const newRefreshCookie = refreshSetCookies.find((c) => c.startsWith("lenglish_refresh="))!;
    const newRefreshPair = newRefreshCookie.split(";", 1)[0]!;
    expect(newRefreshPair).not.toBe(refreshPair);

    // Replay old refresh token should fail after rotation.
    await request(app.getHttpServer())
      .post("/auth/refresh")
      .set("Cookie", [accessPair, refreshPair])
      .expect(401);

    // Logout should revoke the active refresh token and clear cookies.
    const logoutRes = await request(app.getHttpServer())
      .post("/auth/logout")
      .set("Cookie", [accessPair, newRefreshPair])
      .expect(201);

    const logoutCookies = logoutRes.headers["set-cookie"] as string[] | undefined;
    expect(logoutCookies).toBeTruthy();
    expect(logoutCookies!.some((c) => c.includes("lenglish_access="))).toBe(true);
    expect(logoutCookies!.some((c) => c.includes("lenglish_refresh="))).toBe(true);

    await request(app.getHttpServer())
      .post("/auth/refresh")
      .set("Cookie", [accessPair, newRefreshPair])
      .expect(401);
  });

  it("GET /auth/me is protected and returns current user for valid access cookie", async () => {
    await request(app.getHttpServer()).get("/auth/me").expect(401);

    const registerRes = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: "user4@example.com", password: "Strong1!", name: "User 4" })
      .expect(201);

    const setCookies = registerRes.headers["set-cookie"] as string[];
    const accessCookie = setCookies.find((c) => c.startsWith("lenglish_access="))!;
    const accessPair = accessCookie.split(";", 1)[0]!;

    const meRes = await request(app.getHttpServer())
      .get("/auth/me")
      .set("Cookie", [accessPair])
      .expect(200);

    expect(meRes.body.email).toBe("user4@example.com");
    expect(meRes.body.passwordHash).toBeUndefined();
  });

  it("public routes remain public under the global guard", async () => {
    await request(app.getHttpServer()).get("/health").expect(200);
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "nobody@example.com", password: "Strong1!" })
      .expect(401);
  });
});
