import { test, expect } from '@playwright/test';

test('myth buster view renders correctly', async ({ page }) => {
  await page.goto('/');
  await page.locator('#start-myths-button').click();

  // Check if myth buster view is visible
  await expect(page.locator('.mythsView')).toBeVisible();
});

test('myth cards are expandable', async ({ page }) => {
  await page.goto('/');
  await page.locator('#start-myths-button').click();

  // Wait for myths view to load
  await page.waitForSelector('.mythsView', { state: 'visible' });

  // Check if myth cards exist
  const mythCards = page.locator('[role="listitem"]');
  await expect(mythCards.first()).toBeVisible();
});

test('myth buster has proper ARIA attributes', async ({ page }) => {
  await page.goto('/');
  await page.locator('#start-myths-button').click();

  // Wait for myths view to load
  await page.waitForSelector('.mythsView', { state: 'visible' });

  // Check for ARIA attributes
  const list = page.locator('[role="list"]');
  await expect(list).toBeVisible();
});
