import { test } from '@playwright/test';

test('diagnose analysis tab DOM after COOP/COEP', async ({ page }) => {
  // Capture ALL console messages and network requests
  const consoleMessages: string[] = [];
  const networkRequests: string[] = [];

  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    consoleMessages.push(`[pageerror] ${err.message}`);
  });
  page.on('request', req => {
    if (req.url().includes('wasm') || req.url().includes('stockfish')) {
      networkRequests.push(`REQ: ${req.method()} ${req.url()}`);
    }
  });
  page.on('response', resp => {
    if (resp.url().includes('wasm') || resp.url().includes('stockfish')) {
      networkRequests.push(`RES: ${resp.status()} ${resp.headers()['content-type'] || 'no-ct'} ${resp.url()}`);
    }
  });

  await page.goto('/');
  await page.waitForSelector('text=Game Archive', { timeout: 15000 });
  await page.locator('text=Sicilian Defense').first().click();
  await page.waitForSelector('select', { timeout: 15000 });
  await page.waitForTimeout(1000);

  // Click analysis tab
  await page.locator('text=Analysis').click();

  // Wait and check score at intervals
  for (const delay of [2000, 3000, 5000]) {
    await page.waitForTimeout(delay);
    const score = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('div, span'));
      for (const el of els) {
        const text = (el as HTMLElement).innerText?.trim() ?? '';
        if (/^[+-]?\d+\.\d+$/.test(text) || /^Mate in \d+$/i.test(text) || text === 'Error' || text === 'Loading') {
          return text;
        }
      }
      return 'not found';
    });
    console.log(`Score at checkpoint: "${score}"`);
    if (score !== 'Loading' && score !== 'not found') break;
  }

  console.log('=== Network requests (wasm/stockfish) ===');
  networkRequests.forEach(r => console.log(r));

  console.log('=== Console messages ===');
  consoleMessages.forEach(m => console.log(m));

  const sabAvailable = await page.evaluate(() => typeof SharedArrayBuffer !== 'undefined');
  console.log('SharedArrayBuffer available:', sabAvailable);
});
