import { test } from '@playwright/test';

test('diagnose analysis tab DOM after COOP/COEP', async ({ page }) => {
  // Capture console errors from the page
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    consoleMessages.push(`[pageerror] ${err.message}`);
  });

  await page.goto('/');
  await page.waitForSelector('text=Game Archive', { timeout: 10000 });
  await page.locator('text=Sicilian Defense').first().click();
  await page.waitForSelector('select', { timeout: 15000 });
  await page.waitForTimeout(1000);

  // Click analysis tab and wait longer
  await page.locator('text=Analysis').click();
  await page.waitForTimeout(20000);

  const scoreArea = await page.evaluate(() => {
    const results: any[] = [];
    document.querySelectorAll('div, span').forEach(el => {
      const text = (el as HTMLElement).innerText?.trim() ?? el.textContent?.trim() ?? '';
      if (text && (
        text === 'Error' ||
        text === 'Loading' ||
        /^[+-]?\d+\.\d+$/.test(text) ||
        /^Mate in \d+$/i.test(text)
      )) {
        const htmlEl = el as HTMLElement;
        results.push({
          tag: el.tagName,
          text,
          class: el.className.substring(0, 80),
          offsetParent: htmlEl.offsetParent !== null,
          opacity: getComputedStyle(el).opacity,
          rect: htmlEl.getBoundingClientRect(),
        });
      }
    });
    return results;
  });

  console.log('=== Score area elements ===');
  console.log(JSON.stringify(scoreArea.slice(0, 10), null, 2));

  console.log('=== Console messages (errors/warnings) ===');
  consoleMessages.filter(m => m.includes('error') || m.includes('Error') || m.includes('SharedArray') || m.includes('wasm') || m.includes('Stockfish') || m.includes('pageerror')).forEach(m => console.log(m));

  // Check SharedArrayBuffer availability
  const sabAvailable = await page.evaluate(() => typeof SharedArrayBuffer !== 'undefined');
  console.log('SharedArrayBuffer available:', sabAvailable);
});
