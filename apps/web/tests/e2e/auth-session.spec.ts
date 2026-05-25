import { expect, test } from "@playwright/test";
import { expectProfilePage, loginThroughUi, signupThroughUi } from "./helpers/auth";

/** Covers signup, session persistence, logout, and login restore. */
test("auth session flow works end-to-end", async ({ page }) => {
  const seed = Date.now();
  const email = `wave5-auth-${seed}@example.com`;
  const password = "Strong1!";

  await page.goto("/login");
  await signupThroughUi(page, {
    name: "Wave 5 Auth",
    email,
    password
  });

  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("button", { name: "650" }).click();
  await page.getByRole("button", { name: "Lưu mục tiêu" }).click();

  await expect(page).toHaveURL(/\/profile$/);
  await expectProfilePage(page);

  await page.reload();
  await expect(page).toHaveURL(/\/profile$/);
  await expectProfilePage(page);

  await page.request.post(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/auth/logout`);

  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login\?next=%2Fprofile$/);

  await loginThroughUi(page, { email, password });
  await expect(page).toHaveURL(/\/profile$/);
  await expectProfilePage(page);
});
