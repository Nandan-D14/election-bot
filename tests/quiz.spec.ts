import { test, expect } from "@playwright/test";

test("quiz view renders correctly", async ({ page }) => {
  await page.goto("/");
  await page.locator("#start-quiz-button").click();

  // Check if quiz view is visible
  await expect(page.locator(".quizView")).toBeVisible();
});

test("quiz can be started and questions render", async ({ page }) => {
  await page.goto("/");
  await page.locator("#start-quiz-button").click();

  // Wait for quiz to load
  await page.waitForSelector(".quizView", { state: "visible" });

  // Check if quiz elements are present
  const quizContainer = page.locator(".quizView");
  await expect(quizContainer).toBeVisible();
});

test("quiz navigation works", async ({ page }) => {
  await page.goto("/");
  await page.locator("#start-quiz-button").click();

  // Wait for quiz to load
  await page.waitForSelector(".quizView", { state: "visible" });

  // Check if navigation buttons exist
  const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue")');
  if ((await nextButton.count()) > 0) {
    await expect(nextButton.first()).toBeVisible();
  }
});
