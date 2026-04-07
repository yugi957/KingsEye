import { test, expect } from '@playwright/test';

test.describe('Critical User Journey tests', () => {

  test('CUJ 1: Browse and navigate to a game, then return home', async ({ page }) => {
    // 1. Load home
    await page.goto('/');
    await page.waitForSelector('text=Game Archive', { timeout: 10000 });

    // 2. Click "Italian Game" in list
    await page.locator('text=Italian Game').first().click();

    // 3. Assert Game screen loads — board images present (non-zero dimensions)
    await page.waitForTimeout(1000);
    const allImgs = page.locator('img');
    const imgCount = await allImgs.count();
    expect(imgCount).toBeGreaterThan(3);
    const firstImg = allImgs.first();
    const box = await firstImg.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);

    // 4. Click Home button (the homeIcon image)
    // HomeIcon is an <img> rendered in a TouchableOpacity in the title bar
    const homeIconImgs = page.locator('img');
    // The home icon is the first img in the title bar area
    // Click on the first pressable img (homeIcon.png rendered as img)
    await homeIconImgs.first().click();

    // 5. Assert back at Home — "Game Archive" heading visible
    await page.waitForSelector('text=Game Archive', { timeout: 10000 });
    await expect(page.locator('text=Game Archive')).toBeVisible();
  });

  test('CUJ 2: Enter FEN manually and open game for analysis', async ({ page }) => {
    // 1. Load home
    await page.goto('/');
    await page.waitForSelector('text=Enter FEN', { timeout: 10000 });

    // 2. Click "Enter FEN"
    await page.locator('text=Enter FEN').click();
    await page.waitForSelector('text=New Game', { timeout: 10000 });

    // 3. Click "Ruy Lopez (after 3.Bb5)" sample button
    await page.locator('text=Ruy Lopez (after 3.Bb5)').click();

    // 4. Assert Game screen loads — board present with non-zero dimensions
    await page.waitForTimeout(1000);
    const allImgs = page.locator('img');
    const imgCount = await allImgs.count();
    expect(imgCount).toBeGreaterThan(3);
    const firstImg = allImgs.first();
    const box = await firstImg.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);

    // 5. Click "Analysis" tab
    await page.locator('text=Analysis').click();

    // 6. Wait up to 15s — assert score is not "Error"
    await page.waitForFunction(
      () => {
        const testEl = document.querySelector('[data-testid="analysis-score"]');
        if (testEl) {
          const text = testEl.textContent?.trim() ?? '';
          return text !== '' && text !== 'Error' && text !== 'Loading';
        }
        const allElements = document.querySelectorAll('span, div, p');
        for (const el of allElements) {
          const text = el.textContent?.trim() ?? '';
          if (text && text !== 'Error' && text !== 'Loading' && text !== 'Notes notes') {
            if (/^[+-]?\d+(\.\d+)?$/.test(text) || /mate/i.test(text)) {
              return true;
            }
          }
        }
        return false;
      },
      { timeout: 15000 }
    );

    // Verify no Error text
    const errorText = page.locator('[data-testid="analysis-score"]');
    const count = await errorText.count();
    if (count > 0) {
      const text = await errorText.textContent();
      expect(text).not.toBe('Error');
    }
  });

  test('CUJ 3: Upload Photo flow — navigation only', async ({ page }) => {
    // 1. Load home
    await page.goto('/');
    await page.waitForSelector('text=Upload Photo', { timeout: 10000 });

    // 2. Click "Upload Photo"
    await page.locator('text=Upload Photo').click();

    // 3. Assert Camera screen — file input present
    await page.waitForSelector('input[type="file"]', { timeout: 10000 });
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveCount(1);

    // 4. Assert "Camera" heading visible
    await expect(page.locator('text=Camera')).toBeVisible();
  });
});
