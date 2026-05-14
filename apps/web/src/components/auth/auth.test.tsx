import { afterEach, describe, expect, it, vi } from "vitest";
import { login, register, requestPasswordReset, confirmPasswordReset } from "../../lib/api/auth";
import { authDestination, isStrongPassword } from "./auth.forms";
import { AuthCard } from "./AuthCard";
import { ResetPasswordForm } from "./ResetPasswordForm";

describe("auth frontend (phase 01-04)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends credentials with every auth API request", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await register({ email: "new@example.com", password: "Strong1!", name: "New" });
    await login({ email: "new@example.com", password: "Strong1!" });
    await requestPasswordReset({ email: "new@example.com" });
    await confirmPasswordReset({ token: "token", password: "Strong1!" });

    for (const call of fetchMock.mock.calls as unknown as Array<[string, RequestInit]>) {
      expect(call[1].credentials).toBe("include");
    }
  });

  it("keeps auth routing and password validation pure enough to test without token parsing", () => {
    expect(isStrongPassword("Strong1!")).toBe(true);
    expect(isStrongPassword("weakpass")).toBe(false);
    expect(authDestination({ id: "u1", email: "a@example.com", profile: null })).toBe("/onboarding");
    expect(
      authDestination({
        id: "u1",
        email: "a@example.com",
        profile: { targetToeicScore: 750 }
      })
    ).toBe("/profile");
  });

  it("exposes the expected auth card and reset form components", () => {
    expect(AuthCard).toBeTypeOf("function");
    expect(ResetPasswordForm).toBeTypeOf("function");
  });
});
