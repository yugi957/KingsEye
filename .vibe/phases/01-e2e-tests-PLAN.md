# Phase 1: E2E Test Suite

**Goal:** Playwright tests covering all CUJs pass locally against `npx serve dist`.
**Done when:** `npx playwright test` exits 0 with no failures.

---

## Prerequisites (complete before writing tests)

- [ ] Working-tree changes committed (Camera.tsx, App.tsx, Home.tsx, Upload.tsx deleted)
- [ ] `npm run build:web` exits 0
- [ ] `npx serve dist -p 3000` serves the app in a browser without a blank screen

---

## Wave 1 — Setup (no parallelism, must finish first)

### Task 1.1 — Install Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

**Acceptance:** `node_modules/@playwright/test` exists, `npx playwright --version` prints a version.

---

### Task 1.2 — Write `playwright.config.ts`

**File:** `playwright.config.ts` (project root)

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
```

**Acceptance:** `npx playwright test --list` runs without config errors.

---

### Task 1.3 — Add `test:e2e` script to `package.json`

Add to `scripts`:
```json
"test:e2e": "npx serve dist -p 3000 & sleep 3 && npx playwright test --reporter=list; kill %1"
```

**Acceptance:** `package.json` contains `"test:e2e"`.

---

## Wave 2 — Screen-level tests (can be written in parallel)

### Task 2.1 — `e2e/home.spec.ts`

**What to test:**
- Page loads at `/` — no crash, title or heading visible
- 3 game list items present (seeded: Sicilian Defense, Queen's Gambit, Italian Game)
- Each item has a star icon element with non-zero width (FontAwesome rendered, not blank)
- Each item has a trash icon element with non-zero width
- "Upload Photo" button visible
- "Enter FEN" button visible

**Key selectors** (React Native Web maps `testID` → `data-testid`):
- Game items: locate by game titles ("Sicilian Defense", "Queen's Gambit", "Italian Game")
- Buttons: locate by text content ("Upload Photo", "Enter FEN")
- Icons: locate by the `<Text>` elements adjacent to game items, assert `boundingBox().width > 0`

**Acceptance:** All 7 assertions pass.

---

### Task 2.2 — `e2e/debug.spec.ts`

**What to test:**
- Click "Enter FEN" from Home → "New Game" heading visible
- FEN text input (`<input>` or `<textarea>`) is present
- "Open Position" button is present
- All 4 sample position buttons visible by label text:
  - "Starting Position"
  - "Sicilian (after 1.e4 c5 2.Nf3)"
  - "Ruy Lopez (after 3.Bb5)"
  - "Endgame (K+Q vs K)"

**Acceptance:** All assertions pass.

---

### Task 2.3 — `e2e/camera.spec.ts`

**What to test:**
- Click "Upload Photo" from Home → "Camera" heading visible
- `<input type="file">` element is present in DOM
- `accept` attribute is `"image/*"`

**Acceptance:** All assertions pass.

---

### Task 2.4 — `e2e/profile.spec.ts`

**What to test:**
- Click profile icon on Home → "Profile" heading visible
- Text "demo@kingseye.app" is visible
- Text "Demo" is visible (first name)
- Text "User" is visible (last name)
- Root container width ≤ 480px (use `boundingBox()`)

**Acceptance:** All assertions pass.

---

## Wave 3 — Game screen test (depends on Wave 2 navigation working)

### Task 3.1 — `e2e/game.spec.ts`

**What to test:**
- From Home, click "Sicilian Defense" → Game screen loads
- Chessboard container is present and has non-zero dimensions
- Game title text "Sicilian Defense" is visible
- Home button icon has non-zero width (not blank)
- Save button icon has non-zero width (not blank)
- Status `<select>` element is present with 4 options (Playing, Win, Draw, Loss)
- Click "Analysis" tab → wait up to 15s → score text is not "Error" and not empty string

**Note on Analysis tab:** Use `waitForFunction` polling — do NOT use a fixed sleep.
```ts
await page.waitForFunction(
  () => {
    const el = document.querySelector('[data-testid="analysis-score"]');
    return el && el.textContent !== 'Error' && el.textContent !== 'Loading' && el.textContent.trim() !== '';
  },
  { timeout: 15000 }
);
```
If `data-testid` isn't on AnalysisBar, locate by text content instead.

**Acceptance:** All assertions pass including Analysis tab score.

---

## Wave 4 — Full CUJ tests (depends on all screen tests passing)

### Task 4.1 — `e2e/cuj.spec.ts`

**CUJ 1: Browse and navigate to a game**
1. Load `/`
2. Click "Italian Game" in the list
3. Assert Game screen loads — board container has non-zero dimensions
4. Click Home button
5. Assert back at Home — "Game Archive" heading visible

**CUJ 2: Enter FEN manually → Game**
1. Load `/`
2. Click "Enter FEN"
3. Click "Ruy Lopez (after 3.Bb5)" sample button
4. Assert Game screen loads — board container has non-zero dimensions
5. Click "Analysis" tab
6. Wait up to 15s — assert score is not "Error"

**CUJ 3: Upload Photo flow (navigation only — no actual file upload)**
1. Load `/`
2. Click "Upload Photo"
3. Assert Camera screen — `<input type="file">` present
4. Assert "Camera" heading visible

**Acceptance:** All 3 CUJs pass end-to-end.

---

## Verification

Run the full suite:

```bash
npm run build:web
npm run test:e2e
```

Expected output:
```
✓ home.spec.ts (7)
✓ debug.spec.ts (6)
✓ camera.spec.ts (3)
✓ profile.spec.ts (5)
✓ game.spec.ts (7)
✓ cuj.spec.ts (3 journeys)
```

**Phase is complete when exit code is 0 and no tests are skipped.**

---

## Out of Scope

- Actual file upload to AWS Lambda (network call — not testable without a running server)
- Star/delete persistence across reload
- Notes tab
- Move navigation (commented out)
- Any screen not listed above
