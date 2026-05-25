import { expect, test } from "@playwright/test";
import { expectProfilePage, signupThroughUi } from "./helpers/auth";

/** Covers profile editing and protected-route redirects. */
test("profile page saves updates and protected route redirects when signed out", async ({ page }) => {
  const seed = Date.now();
  const email = `wave5-profile-${seed}@example.com`;
  const password = "Strong1!";

  await page.goto("/login");
  await signupThroughUi(page, {
    name: "Wave 5 Profile",
    email,
    password
  });

  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("button", { name: "700" }).click();
  await page.getByRole("button", { name: "Lưu mục tiêu" }).click();

  await expect(page).toHaveURL(/\/profile$/);
  await expectProfilePage(page);

  await page.getByLabel("Tên hiển thị").fill("Tên Đã Cập Nhật");
  await page.getByRole("button", { name: "Intermediate" }).click();
  await page.getByRole("button", { name: "Lưu hồ sơ" }).click();
  await expect(page.getByText("Lưu hồ sơ thành công.")).toBeVisible();

  await page.request.post(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/auth/logout`);
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login\?next=%2Fprofile$/);
});
