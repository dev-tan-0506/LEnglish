import { expect, Page } from "@playwright/test";

/** Completes signup from the auth card and waits for post-auth navigation. */
export async function signupThroughUi(page: Page, input: { name: string; email: string; password: string }) {
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByLabel("Name").fill(input.name);
  await page.getByLabel("Email").fill(input.email);
  await page.getByLabel("Password").fill(input.password);
  await page.getByRole("button", { name: "Create account" }).click();
}

/** Completes login from the auth card and waits for post-auth navigation. */
export async function loginThroughUi(page: Page, input: { email: string; password: string }) {
  await page.getByLabel("Email").fill(input.email);
  await page.getByLabel("Password").fill(input.password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

/** Asserts profile page shell is visible. */
export async function expectProfilePage(page: Page) {
  await expect(page.getByRole("heading", { name: "Hồ sơ của bạn" })).toBeVisible();
}
