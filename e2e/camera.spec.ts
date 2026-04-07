import { test, expect } from '@playwright/test';

test.describe('Camera screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=Upload Photo', { timeout: 10000 });
    await page.locator('text=Upload Photo').click();
    await page.waitForSelector('text=Camera', { timeout: 10000 });
  });

  test('"Camera" heading is visible after clicking Upload Photo', async ({ page }) => {
    await expect(page.locator('text=Camera')).toBeVisible();
  });

  test('<input type="file"> element is present in DOM', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveCount(1);
  });

  test('file input accept attribute is "image/*"', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveAttribute('accept', 'image/*');
  });
});
