import { expect, test } from "@playwright/test";

test("home page renders the workspace foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LEnglish" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Auth routes coming soon" })).toBeVisible();
});
