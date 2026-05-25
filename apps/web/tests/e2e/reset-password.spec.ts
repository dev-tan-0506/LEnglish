import { expect, test } from "@playwright/test";
import { readLatestResetMessage } from "./helpers/mailbox";

/** Covers password reset request, confirmation, and login with new password. */
test("user can reset password and sign in with the new password", async ({ page }) => {
  const seed = Date.now();
  const email = `wave5-reset-${seed}@example.com`;
  const oldPassword = "Strong1!";
  const newPassword = "FreshStrong1!";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  await page.goto("/login");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByLabel("Name").fill("Wave 5 Reset");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(oldPassword);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);

  await page.request.post(`${apiUrl}/auth/logout`);

  await page.goto("/login");
  await page.getByRole("button", { name: "Forgot password" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByText("If the account exists, a reset email has been sent.")).toBeVisible();

  const message = await readLatestResetMessage(apiUrl);
  expect(message.email).toBe(email);

  await page.goto(message.resetUrl);
  await page.getByLabel("New password").fill(newPassword);
  await page.getByLabel("Confirm password").fill(newPassword);
  await page.getByRole("button", { name: "Reset password" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(oldPassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Email or password is incorrect.")).toBeVisible();

  await page.getByLabel("Password").fill(newPassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
});
