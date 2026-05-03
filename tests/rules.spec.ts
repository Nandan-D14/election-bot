import { test, expect } from '@playwright/test';

test('voting rules view renders correctly', async ({ page }) => {
  await page.goto('/');
  await page.locator('#start-rules-button').click();

  // Check if voting rules view is visible
  await expect(page.locator('.rulesView')).toBeVisible();
});

test('voting rules content is accessible', async ({ page }) => {
  await page.goto('/');
  await page.locator('#start-rules-button').click();

  // Wait for rules view to load
  await page.waitForSelector('.rulesView', { state: 'visible' });

  // Check if content is visible
  const rulesView = page.locator('.rulesView');
  await expect(rulesView).toBeVisible();
});
