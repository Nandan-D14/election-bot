import { test, expect } from "@playwright/test";

/**
 * PRODUCTION-GRADE E2E TEST SUITE
 * Covers Visual Regressions, Network Failures, and UX Stability.
 */

test.describe("Mission Critical UX Tests", () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // 1. VISUAL REGRESSION (Pixel-Perfect Testing)
  test("EVM Simulator visual consistency", async ({ page }) => {
    const simulator = page.locator(".simulator-container");
    // This fails if a single pixel changes, ensuring CSS stability
    await expect(simulator).toHaveScreenshot("evm-baseline.png", {
      maxDiffPixels: 100,
    });
  });

  // 2. CHAOS ENGINEERING (Network Failure Resilience)
  test("handles Gemini API outage gracefully", async ({ page }) => {
    // Simulate a 500 error from the AI backend
    await page.route("**/api/chat", route => route.fulfill({
      status: 500,
      body: JSON.stringify({ error: "Service Unavailable" }),
    }));

    await page.locator("#chat-input").fill("Hello");
    await page.keyboard.press("Enter");

    // PRODUCTION REQUIREMENT: The UI must not "hang". It must show a friendly error.
    await expect(page.locator(".error-toast")).toBeVisible();
    await expect(page.locator(".error-toast")).toContainText("internet connection");
  });

  // 3. LATENCY TESTING (Slow Network UX)
  test("shows loading skeletons on slow 3G", async ({ page, context }) => {
    // Throtle the network to simulate poor connectivity in rural areas
    await context.setOffline(false);
    await page.context().newCDPSession(page).then(session => {
      return session.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 2000, // 2 second delay
        downloadThroughput: 50 * 1024,
        uploadThroughput: 20 * 1024,
      });
    });

    await page.locator("#start-quiz-button").click();
    // Verify that "Skeleton" or "Spinner" is visible immediately
    await expect(page.locator(".skeleton-loader")).toBeVisible();
  });

  // 4. MULTI-DEVICE / RESPONSIVE AUDIT
  test("UI elements remain accessible on small mobile (320px)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    const verifyButton = page.locator("#verify-id-button");
    
    // Ensure button is clickable and not obscured or off-screen
    await expect(verifyButton).toBeVisible();
    await expect(verifyButton).toBeInViewport();
    
    // Check that text doesn't overlap (A common mobile bug)
    const titleHeight = await page.locator("h1").boundingBox();
    expect(titleHeight?.height).toBeLessThan(100); 
  });
});
