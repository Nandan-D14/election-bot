import { test, expect } from '@playwright/test';

test('tabs render in header after leaving landing', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop-only');
  await page.goto('/');

  // Landing page shows FeatureCards. Jump to a view to reveal header nav.
  await page.locator('#start-simulator-button').click();

  await expect(page.locator('#tab-assistant')).toBeVisible();
  await expect(page.locator('#tab-simulator')).toBeVisible();
  await expect(page.locator('#tab-quiz')).toBeVisible();
  await expect(page.locator('#tab-myths')).toBeVisible();
  await expect(page.locator('#tab-chatbot')).toBeVisible();
});

test('simulator view uses fullscreen layout', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop-only');
  await page.goto('/');
  await page.locator('#start-simulator-button').click();

  const main = page.locator('main');
  await expect(main).toHaveClass(/mainFullscreen/);
  await expect(page.locator('#tab-simulator')).toHaveClass(/tabActive/);

  // Simulator view container should also be in fullscreen mode.
  await expect(page.locator('div[class*="simulatorViewFullscreen"]')).toBeVisible();
});

test('assistant view uses fullscreen layout', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop-only');
  await page.goto('/');
  await page.locator('#start-assistant-button').click();

  const main = page.locator('main');
  await expect(main).toHaveClass(/mainFullscreen/);
  await expect(page.locator('#tab-assistant')).toHaveClass(/tabActive/);

  // VoiceAssistant container should stretch and be visible.
  await expect(page.locator('div[class*="VoiceAssistant"][class*="container"], div[class*="VoiceAssistant-module"][class*="container"]').first()).toBeVisible();
});

test('mobile: tabs remain usable and views switch', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only');

  await page.goto('/');
  const startAssistant = page.locator('#start-assistant-button');
  await startAssistant.scrollIntoViewIfNeeded();
  await startAssistant.click();

  await page.locator('#tab-chatbot').click();
  await expect(page.locator('#tab-chatbot')).toHaveClass(/tabActive/);

  // Going back to landing on mobile (Home button is hidden in CSS).
  await page.goto('/');
  await expect(page.locator('#tab-assistant')).toHaveCount(0);
});

