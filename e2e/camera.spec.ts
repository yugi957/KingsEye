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

  test('chess.jpg preview image is visible on load', async ({ page }) => {
    // Camera screen should auto-load chess.jpg and show the image preview
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 5000 });
  });

  test('Accept, Retake, and Cancel buttons are visible on load', async ({ page }) => {
    await expect(page.locator('text=Accept')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Retake')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Cancel')).toBeVisible({ timeout: 5000 });
  });

  test('clicking Retake shows the file picker input', async ({ page }) => {
    // Wait for the image preview + buttons to appear
    await expect(page.locator('text=Retake')).toBeVisible({ timeout: 5000 });
    await page.locator('text=Retake').click();

    // After retake the file picker should be present
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveCount(1, { timeout: 5000 });
    await expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  test('<input type="file"> element is present after clicking Retake', async ({ page }) => {
    await expect(page.locator('text=Retake')).toBeVisible({ timeout: 5000 });
    await page.locator('text=Retake').click();
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveCount(1);
  });

  test('file input accept attribute is "image/*" after clicking Retake', async ({ page }) => {
    await expect(page.locator('text=Retake')).toBeVisible({ timeout: 5000 });
    await page.locator('text=Retake').click();
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveAttribute('accept', 'image/*');
  });
});
