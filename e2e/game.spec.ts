import { test, expect } from '@playwright/test';

test.describe('Game screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for Home to load
    await page.waitForSelector('text=Game Archive', { timeout: 10000 });
    // Click the Sicilian Defense game row
    await page.locator('text=Sicilian Defense').first().click();
    // Wait for Game screen to load — the status <select> is unique to the Game screen
    await page.waitForSelector('select', { timeout: 15000 });
    // Give the board time to render its images
    await page.waitForTimeout(1000);
  });

  test('game title "Sicilian Defense" is visible', async ({ page }) => {
    // The Home screen keeps its list in the DOM (React Navigation stack).
    // The first 'text=Sicilian Defense' match is the hidden Home list item (width=0).
    // The second match is the visible Game screen title bar element.
    const titleEl = page.locator('text=Sicilian Defense').nth(1);
    await expect(titleEl).toBeVisible();
  });

  test('chessboard container is present and has non-zero dimensions', async ({ page }) => {
    // react-native-chessboard renders chess piece images from its assets directory
    await page.waitForSelector('img[src*="react-native-chessboard"]', { timeout: 10000 });

    const pieceImages = page.locator('img[src*="react-native-chessboard"]');
    const pieceCount = await pieceImages.count();
    expect(pieceCount).toBeGreaterThan(0);

    const firstPiece = pieceImages.first();
    const box = await firstPiece.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('status <select> element is present with 4 options', async ({ page }) => {
    const select = page.locator('select');
    await expect(select).toBeVisible();

    const options = select.locator('option');
    await expect(options).toHaveCount(4);
    await expect(options.nth(0)).toHaveText('Playing');
    await expect(options.nth(1)).toHaveText('Win');
    await expect(options.nth(2)).toHaveText('Draw');
    await expect(options.nth(3)).toHaveText('Loss');
  });

  test('Analysis tab shows a score within 15 seconds', async ({ page }) => {
    // Click the Analysis tab
    await page.locator('text=Analysis').click();

    // Wait for the score to appear in AnalysisBar.
    // The score renders as text in a styled box (white/black/grey background).
    // Score format from Stockfish: "0.50", "-1.20", "+0.30", "Mate in 3"
    // Must NOT be "Loading" or "Error".
    // NOTE: board rank numbers (1-8) are also in the DOM — we require a decimal point
    // or the word "Mate" to distinguish a real score from board coordinate digits.
    await page.waitForFunction(
      () => {
        // Check data-testid first (if present)
        const testEl = document.querySelector('[data-testid="analysis-score"]');
        if (testEl) {
          const text = testEl.textContent?.trim() ?? '';
          return text !== '' && text !== 'Error' && text !== 'Loading';
        }
        // Fallback: look for Stockfish score format.
        // Centipawn scores always have a decimal: "0.00", "-1.20", "+0.50"
        // Mate scores are full phrases: "Mate in 3"
        // Board rank digits (1-8) are single characters — excluded by requiring decimal or "Mate"
        const allElements = document.querySelectorAll('div, span');
        for (const el of allElements) {
          const text = el.textContent?.trim() ?? '';
          // Centipawn format: optional sign, digits, decimal point, digits (e.g. "0.50", "-1.20")
          if (/^[+-]?\d+\.\d+$/.test(text)) return true;
          // Mate format: "Mate in N"
          if (/^Mate in \d+$/i.test(text)) return true;
        }
        return false;
      },
      { timeout: 15000 }
    );

    // After the wait resolves, confirm no "Error" text is visible
    const errorLocator = page.locator('[data-testid="analysis-score"]');
    const count = await errorLocator.count();
    if (count > 0) {
      const text = await errorLocator.textContent();
      expect(text?.trim()).not.toBe('Error');
      expect(text?.trim()).not.toBe('');
    } else {
      // No data-testid: verify the score element on screen is not "Error"
      // The AnalysisBar score box is the only styled score-like element visible
      const errorText = page.locator('text=Error').first();
      const isVisible = await errorText.isVisible().catch(() => false);
      expect(isVisible).toBe(false);
    }
  });
});
