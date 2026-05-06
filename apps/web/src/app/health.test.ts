import { describe, expect, it } from "vitest";
import { HOME_HEALTH_COPY } from "./home-health-copy";

describe("home health copy", () => {
  it("exposes the foundation landing copy and future auth links", () => {
    expect(HOME_HEALTH_COPY.title).toBe("LEnglish");
    expect(HOME_HEALTH_COPY.authLink).toBe("/login");
    expect(HOME_HEALTH_COPY.profileLink).toBe("/profile");
  });
});
