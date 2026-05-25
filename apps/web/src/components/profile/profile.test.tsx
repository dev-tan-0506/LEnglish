import { afterEach, describe, expect, it, vi } from "vitest";
import { getMyProfile, updateMyProfile, uploadAvatar } from "../../services/profile";
import { ENGLISH_LEVEL_OPTIONS, PRESET_AVATAR_OPTIONS, TARGET_TOEIC_OPTIONS } from "../../consts/profile.consts";
import { OnboardingScoreSelector } from "./OnboardingScoreSelector";
import { ProfileForm } from "./ProfileForm";

describe("profile frontend (phase 01-05)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends credentials with profile API requests", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await getMyProfile();
    await updateMyProfile({ name: "Test", targetToeicScore: 750, currentEnglishLevel: "Intermediate" });
    await uploadAvatar({ presetAvatarId: "owl-blue" });

    for (const call of fetchMock.mock.calls as unknown as Array<[string, RequestInit]>) {
      expect(call[1].credentials).toBe("include");
    }
  });

  it("keeps TOEIC and English-level options aligned with backend contract values", () => {
    expect(TARGET_TOEIC_OPTIONS.map((item) => item.value)).toEqual([450, 600, 750, 900]);
    expect(ENGLISH_LEVEL_OPTIONS.map((item) => item.value)).toEqual([
      "Newbie",
      "Beginner",
      "Intermediate",
      "Upper-Intermediate",
      "Advanced"
    ]);
    expect(PRESET_AVATAR_OPTIONS).toEqual([
      "owl-blue",
      "fox-green",
      "cat-violet",
      "bear-amber",
      "panda-mint",
      "robot-cyan"
    ]);
  });

  it("exposes onboarding and profile form components", () => {
    expect(OnboardingScoreSelector).toBeTypeOf("function");
    expect(ProfileForm).toBeTypeOf("function");
  });
});


