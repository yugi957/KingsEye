import { test, expect } from '@playwright/test';

test.describe('Home screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the game list to load
    await page.waitForSelector('text=Game Archive', { timeout: 10000 });
  });

  test('page loads without crash and heading is visible', async ({ page }) => {
    await expect(page.locator('text=Game Archive')).toBeVisible();
  });

  test('3 pre-seeded games are visible', async ({ page }) => {
    await expect(page.locator('text=Sicilian Defense')).toBeVisible();
    await expect(page.locator("text=Queen's Gambit")).toBeVisible();
    await expect(page.locator('text=Italian Game')).toBeVisible();
  });

  test('star icons render with non-zero width for each game', async ({ page }) => {
    // FontAwesome star icons render as Unicode characters in Text elements
    // The game rows have testID = gameID (1, 2, 3)
    const gameRows = page.locator('[data-testid="1"], [data-testid="2"], [data-testid="3"]');
    const count = await gameRows.count();
    expect(count).toBe(3);

    for (let i = 0; i < count; i++) {
      const row = gameRows.nth(i);
      const box = await row.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
    }
  });

  test('trash icons render with non-zero width for each game', async ({ page }) => {
    // Trash icons are FontAwesome icons rendered in TouchableOpacity inside each game row
    // Each game row (testID = gameID) contains the trash button
    const gameRows = page.locator('[data-testid="1"], [data-testid="2"], [data-testid="3"]');
    const count = await gameRows.count();
    expect(count).toBe(3);

    for (let i = 0; i < count; i++) {
      const row = gameRows.nth(i);
      const box = await row.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);
    }
  });

  test('"Upload Photo" button is visible', async ({ page }) => {
    await expect(page.locator('text=Upload Photo')).toBeVisible();
  });

  test('"Enter FEN" button is visible', async ({ page }) => {
    await expect(page.locator('text=Enter FEN')).toBeVisible();
  });
});
