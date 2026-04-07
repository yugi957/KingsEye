import { test, expect } from '@playwright/test';

test.describe('Debug (New Game) screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=Enter FEN', { timeout: 10000 });
    await page.locator('text=Enter FEN').click();
    await page.waitForSelector('text=New Game', { timeout: 10000 });
  });

  test('"New Game" heading is visible after clicking Enter FEN', async ({ page }) => {
    await expect(page.locator('text=New Game')).toBeVisible();
  });

  test('FEN text input is present', async ({ page }) => {
    // Debug screen has two TextInput elements (title + FEN). The FEN input is multiline.
    const inputs = page.locator('input, textarea');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('"Open Position" button is present', async ({ page }) => {
    await expect(page.locator('text=Open Position')).toBeVisible();
  });

  test('sample position buttons are visible', async ({ page }) => {
    await expect(page.locator('text=Starting Position')).toBeVisible();
    await expect(page.locator('text=Sicilian (after 1.e4 c5 2.Nf3)')).toBeVisible();
    await expect(page.locator('text=Ruy Lopez (after 3.Bb5)')).toBeVisible();
    await expect(page.locator('text=Endgame (K+Q vs K)')).toBeVisible();
  });
});
