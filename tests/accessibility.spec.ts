import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
  test("landing page has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("simulator view has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.locator("#start-simulator-button").click();
    await page.waitForSelector(".simulatorView", { state: "visible" });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("assistant view has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.locator("#start-assistant-button").click();
    await page.waitForSelector(".assistantView", { state: "visible" });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("quiz view has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.locator("#start-quiz-button").click();
    await page.waitForSelector(".quizView", { state: "visible" });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("myth buster view has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.locator("#start-myths-button").click();
    await page.waitForSelector(".mythsView", { state: "visible" });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("chatbot view has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.locator("#start-chatbot-button").click();
    await page.waitForSelector(".chatbotView", { state: "visible" });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("all interactive elements have accessible names", async ({ page }) => {
    await page.goto("/");

    // Check all buttons have accessible names
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasAccessibleName = await button.evaluate((el) => {
        const ariaLabel = el.getAttribute("aria-label");
        const textContent = el.textContent?.trim();
        return !!(ariaLabel || textContent);
      });
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test("page has proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Check for h1
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);

    // Check heading order (h1 should come before h2, etc.)
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();

    let previousLevel = 0;
    for (let i = 0; i < headingCount; i++) {
      const heading = headings.nth(i);
      const tagName = await heading.evaluate((el) => el.tagName);
      const level = parseInt(tagName.replace("H", ""));

      // Heading levels should not skip (e.g., h1 -> h3 is bad)
      if (previousLevel > 0) {
        expect(level).toBeLessThanOrEqual(previousLevel + 1);
      }
      previousLevel = level;
    }
  });
});
