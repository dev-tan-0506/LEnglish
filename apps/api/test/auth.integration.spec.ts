import { describe, expect, it, vi } from "vitest";
import { validate } from "class-validator";
import { ConflictException } from "@nestjs/common";
import { RegisterDto } from "../src/auth/dto/register.dto";
import { UsersService } from "../src/users/users.service";

describe("auth integration (phase 01-02)", () => {
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
});

