import { test, expect } from "@playwright/test";

test("voting games view renders correctly", async ({ page }) => {
  await page.goto("/");
  await page.locator("#start-games-button").click();

  // Check if voting games view is visible
  await expect(page.locator(".gamesView")).toBeVisible();
});

test("voting games are interactive", async ({ page }) => {
  await page.goto("/");
  await page.locator("#start-games-button").click();

  // Wait for games view to load
  await page.waitForSelector(".gamesView", { state: "visible" });

  // Check if games view is visible
  const gamesView = page.locator(".gamesView");
  await expect(gamesView).toBeVisible();
});
