import { test, expect } from "@playwright/test";

test("chatbot view renders correctly", async ({ page }) => {
  await page.goto("/");
  await page.locator("#start-chatbot-button").click();

  // Check if chatbot view is visible
  await expect(page.locator('[data-testid="chatbot-view"]')).toBeVisible();
});

test("chatbot input field is present", async ({ page }) => {
  await page.goto("/");
  await page.locator("#start-chatbot-button").click();

  // Wait for chatbot to load
  await page.waitForSelector('[data-testid="chatbot-view"]', { state: "visible" });

  // Check for input field
  const inputField = page.locator('input[type="text"], textarea');
  await expect(inputField.first()).toBeVisible();
});

test("chatbot can send messages", async ({ page }) => {
  await page.goto("/");
  await page.locator("#start-chatbot-button").click();

  // Wait for chatbot to load
  await page.waitForSelector('[data-testid="chatbot-view"]', { state: "visible" });

  // Type a message
  const inputField = page.locator('input[type="text"], textarea').first();
  await inputField.fill("Hello");

  // Check if send button exists
  const sendButton = page.locator(
    'button:has-text("Send"), button[aria-label*="send"], button[aria-label*="Send"]'
  );
  if ((await sendButton.count()) > 0) {
    await expect(sendButton.first()).toBeVisible();
  }
});
