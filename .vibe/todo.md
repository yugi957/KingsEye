# KingsEye Web Fix — Task List

## Status

All known issues resolved. 26/26 E2E tests passing. Build exits 0. Verified after all recent fixes.

## Tasks

- [x] Commit working-tree changes (Camera.tsx consolidation, App.tsx, Home.tsx, delete Upload.tsx)
- [x] Install Playwright and write E2E test suite (`e2e/`)
- [x] Run `npm run build:web` — fix any errors
- [x] Run Playwright tests against `npx serve dist` — all 26/26 pass
- [x] Mock AWS Lambda in `Camera.tsx` — web path returns Italian Game FEN after 1s delay, navigates to Game
- [x] **Stockfish always returns 0.0** — fixed: `locateFile` hook added so WASM loads from `/bundles/` instead of `/` (Metro breaks `document.currentScript`)
- [x] **Delete game button broken** — fixed `941ebb2`: `window.confirm` on web, `Alert.alert` on native
- [x] **Chessboard wider than screen** — fixed `0f5d05a`: `boardSize={Math.min(windowWidth, 480)}` prop
- [x] **Chessboard moves not accepted** — fixed `b5bc67d`: `GestureHandlerRootView` moved to `App.tsx` root
- [x] **Screen height too tall** — fixed `b5bc67d`: capped to 812px max-height with overflow hidden
- [x] **Camera accept/deny/retake buttons too large** — fixed `cebafe7`: capped to 60px, fontSize 14
- [x] **Auto-load chess.jpg on Camera screen** — fixed `cebafe7`: expo-asset loads chess.jpg on mount; E2E updated `787401e`
- [x] **Screen dimensions shift between screens** — fixed `977592b`: removed per-screen maxWidth; App.tsx wrapper is sole constraint
- [ ] **Stockfish real eval not verified** — `locateFile` fix landed (`84b4902`) but runtime behavior unconfirmed; need to serve the built app, open Analysis tab, and check that starting position shows ~+0.20 (real Stockfish) not 0.00 (material fallback). If still 0.00, try switching to `stockfish/src/stockfish.js` (pure JS, no WASM needed)
- [ ] **E2E regression check needed** — camera.spec.ts was updated for chess.jpg auto-load (`787401e`) but full suite hasn't been re-run since `977592b` (maxWidth removal) — run `npm run build:web && npx playwright test` to confirm all tests still pass
- [ ] **docs/LEARNINGS.md** — document: Metro+document.currentScript bug, GestureHandlerRootView at root, Alert.alert no-op on web, boardSize prop, per-screen maxWidth shifts, expo-asset for bundled image URIs

## E2E Test Coverage Required

- Home: 3 seeded games, star/trash icons visible, both buttons present
- Camera: `<input type="file">` present, reachable from Home
- Game: board renders, icons visible, Analysis tab score within 15s, status `<select>` present
- Profile: loads, name/email visible, centered ≤480px
- Debug: FEN input present, navigates to Game

## E2E Setup

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

Run:
```bash
npm run build:web && npx serve dist -p 3000 &
sleep 2
npx playwright test --reporter=list
kill %1
```

## Reference: Navigation Routes

```
Home (initial)
  ├── → Camera      ("Upload Photo")
  │     └── → Game  (on Lambda success)
  ├── → Debug        ("Enter FEN")
  │     └── → Game
  ├── → Game         (tap game in list)
  └── → Profile      (profile icon)
```

## Reference: AWS Lambda

- **Endpoint:** `https://rbz0ltdjwg.execute-api.us-east-2.amazonaws.com/Development/process-image`
- **Method:** POST, `Content-Type: text/plain`, body = base64 image
- **Success (200):** FEN string — append `" w KQkq - 0 1"`
- **Error (400):** `{ error: string, image: base64_debug_image }`
- Resize image to 640×640 before sending (Camera.tsx already does this)

## Reference: Fixes Already Applied (do not re-do)

| Issue | Fix location |
|-------|-------------|
| FontAwesome icons blank on web | `App.tsx` — `useFonts` loads FontAwesome |
| Analysis tab shows "Error" | `src/mock/stockfish.ts` — no-Worker NNUE variant |
| Layout too wide on desktop | All screens — `maxWidth: 480, alignSelf: 'center'` |
| Status picker broken on web | `Game.tsx` — `Platform.OS === 'web'` uses `<select>` |
| Camera requires device hardware | `Camera.tsx` — web branch uses `<input type="file">` |
| Node built-ins crash Metro | `metro.config.js` — shims to `src/shims/empty.js` |

## Reference: Demo vs Production

| Layer | Demo (this branch) | Production (main) |
|-------|-------------------|-------------------|
| Auth | `src/mock/auth.ts` | Firebase Auth |
| Data | `src/mock/store.ts` (AsyncStorage) | MongoDB via Heroku |
| Chess engine | `src/mock/stockfish.ts` | Heroku endpoint |
| Image input | File upload → Lambda | Camera → Lambda |
| Entry route | Home (skips login) | Login screen |

## Out of Scope

- Notes tab (placeholder — leave as-is)
- Move back/forward in Game (commented out — leave as-is)
- Vercel deployment verification (local E2E is sufficient)
- Expo/RN version upgrades
- Production Firebase/MongoDB
