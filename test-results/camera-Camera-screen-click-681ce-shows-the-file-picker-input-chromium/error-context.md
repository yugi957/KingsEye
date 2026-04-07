# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: camera.spec.ts >> Camera screen >> clicking Retake shows the file picker input
- Location: e2e\camera.spec.ts:27:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('input[type="file"]')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('input[type="file"]')
    9 × locator resolved to 0 elements
      - unexpected value "0"

```

# Page snapshot

```yaml
- generic [ref=e10]:
  - generic [ref=e16]: Camera
  - generic [ref=e21]:
    - generic [ref=e26]: Cancel
    - generic [ref=e31]: Retake
    - generic [ref=e36]: Accept
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Camera screen', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.waitForSelector('text=Upload Photo', { timeout: 10000 });
  7  |     await page.locator('text=Upload Photo').click();
  8  |     await page.waitForSelector('text=Camera', { timeout: 10000 });
  9  |   });
  10 | 
  11 |   test('"Camera" heading is visible after clicking Upload Photo', async ({ page }) => {
  12 |     await expect(page.locator('text=Camera')).toBeVisible();
  13 |   });
  14 | 
  15 |   test('chess.jpg preview image is visible on load', async ({ page }) => {
  16 |     // Camera screen should auto-load chess.jpg and show the image preview
  17 |     const img = page.locator('img').first();
  18 |     await expect(img).toBeVisible({ timeout: 5000 });
  19 |   });
  20 | 
  21 |   test('Accept, Retake, and Cancel buttons are visible on load', async ({ page }) => {
  22 |     await expect(page.locator('text=Accept')).toBeVisible({ timeout: 5000 });
  23 |     await expect(page.locator('text=Retake')).toBeVisible({ timeout: 5000 });
  24 |     await expect(page.locator('text=Cancel')).toBeVisible({ timeout: 5000 });
  25 |   });
  26 | 
  27 |   test('clicking Retake shows the file picker input', async ({ page }) => {
  28 |     // Wait for the image preview + buttons to appear
  29 |     await expect(page.locator('text=Retake')).toBeVisible({ timeout: 5000 });
  30 |     await page.locator('text=Retake').click();
  31 | 
  32 |     // After retake the file picker should be present
  33 |     const fileInput = page.locator('input[type="file"]');
> 34 |     await expect(fileInput).toHaveCount(1, { timeout: 5000 });
     |                             ^ Error: expect(locator).toHaveCount(expected) failed
  35 |     await expect(fileInput).toHaveAttribute('accept', 'image/*');
  36 |   });
  37 | 
  38 |   test('<input type="file"> element is present after clicking Retake', async ({ page }) => {
  39 |     await expect(page.locator('text=Retake')).toBeVisible({ timeout: 5000 });
  40 |     await page.locator('text=Retake').click();
  41 |     const fileInput = page.locator('input[type="file"]');
  42 |     await expect(fileInput).toHaveCount(1);
  43 |   });
  44 | 
  45 |   test('file input accept attribute is "image/*" after clicking Retake', async ({ page }) => {
  46 |     await expect(page.locator('text=Retake')).toBeVisible({ timeout: 5000 });
  47 |     await page.locator('text=Retake').click();
  48 |     const fileInput = page.locator('input[type="file"]');
  49 |     await expect(fileInput).toHaveAttribute('accept', 'image/*');
  50 |   });
  51 | });
  52 | 
```