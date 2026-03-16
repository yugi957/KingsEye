# KingsEye Web Fix Plan

## Context

The app deploys on Vercel (demo branch, Expo 49 / Node 20) but has several broken features on web:
- Save/rename/home buttons in Game screen are non-functional
- Analysis tab shows "Error" instead of engine evaluation
- Layout doesn't display well on web (designed for phone portrait, renders oddly in browser)
- The main feature — photo → YOLO → FEN — is missing from web (replaced by FEN paste only)

**Decisions:** Stay on Expo 49 / Node 20 (no Expo upgrade). Add file upload for the camera feature (sends to existing AWS Lambda endpoint, same pipeline as native).

---

## Requirements (Definition of Done)

The web app is considered done when all of the following are true:

1. **Home screen** loads pre-seeded games, star/delete/navigate all work
2. **Game screen** — save button persists changes to AsyncStorage, home button navigates, title and player name rename works inline, status picker works
3. **Analysis tab** — Stockfish engine loads and returns an evaluation score + principal variation without error
4. **Layout** — app is usable at typical browser widths (1024px+); board, tabs, and player info are visible without scrolling off-screen
5. **Upload screen** — user can pick an image file from disk, it is sent to the AWS Lambda endpoint, and on success they are taken to the Game screen with the detected FEN; error states (bad image, server error) are shown clearly
6. **Navigation** — all routes are reachable and back/home navigation works on every screen
7. **Build** — `npm run build:web` succeeds with exit 0 and Vercel deployment completes

---

## Root Cause Analysis of Current Bugs

### 1. Save / Home buttons broken (Game.tsx)
- **Cause:** `react-native-vector-icons` does not load on web without a font registration step. The `Icon` component renders nothing (invisible buttons) or throws. The home icon and save icon are both Icon-based touchables.
- **Fix:** Register the FontAwesome font for web via a CSS `@font-face` rule in the Expo web template, or replace Icon-based buttons with text/emoji fallbacks using a `Platform.OS === 'web'` guard.

### 2. Analysis tab shows "Error" (AnalysisBar.tsx + stockfish.ts)
- **Cause:** `stockfish.js` (the legacy v10 asm.js file committed to git) uses `Worker` internally. In the browser, `require('stockfish')` returns a factory that tries to spawn a Web Worker pointing at a relative URL — but after the Metro bundle the path is wrong (the worker script isn't separately served). The engine never initializes, `engine.onmessage` never fires, and the promise never resolves, causing the catch block to set `evScore = 'Error'`.
- **Fix:** Use `stockfish/src/stockfish-nnue-16-no-Worker.js` (the no-worker NNUE variant that ships with the package and runs synchronously in the main thread), replacing the engine initialization in `src/mock/stockfish.ts`. This requires updating the mock to use the different message API (`addMessageListener` / `postMessage`).

### 3. Layout broken on web (Game.tsx styles)
- **Cause:** `Dimensions.get('window').width` returns the browser window width, so `tabContentContainer` uses `width: Dimensions.get('window').width - 20` which on a 1440px monitor makes the tab panel 1420px wide — wider than the board. Similarly, the `square` container uses `alignItems: 'center'` / `justifyContent: 'center'` without a `maxWidth`, so the board expands to fill the window.
- **Fix:** Cap the game screen at a max width of ~480px using `maxWidth` and `alignSelf: 'center'` on the root container. Make `tabContentContainer` use `width: '100%'` instead of `Dimensions.get('window').width - 20`.

### 4. `react-native-picker-select` broken on web (Game.tsx status dropdown)
- **Cause:** `react-native-picker-select` has incomplete web support and often renders nothing or throws on Metro web bundles. The `Icon` prop also depends on `react-native-vector-icons`.
- **Fix:** On web, swap to a native `<select>` element via a `Platform.OS === 'web'` branch. On native, keep `RNPickerSelect`.

### 5. No image upload / camera feature
- **Cause:** Camera.tsx was removed from the demo navigator. The Demo branch only has FEN paste (Debug.tsx).
- **Fix:** Add a new `Upload.tsx` screen that: (a) renders an HTML `<input type="file" accept="image/*">` on web, (b) resizes the image to 640×640 (reusing `ImageManipulator` which has a web implementation), (c) converts to base64, (d) POSTs to the same AWS Lambda URL used in Camera.tsx, (e) navigates to Game screen on success (creating a new game via `saveGame()` in mock/store), (f) shows the debug image error modal on failure. Replace the "New Game (FEN)" button on Home with two buttons: "Upload Photo" and "Enter FEN".

### 6. `react-native-vector-icons` font not loading on web
- **Cause:** Web requires the font to be explicitly registered. Expo's Metro web bundler does not auto-load native font assets.
- **Fix:** Add a `web/index.html` override (Expo supports this) or inject a `<style>` tag in the Expo web entry that registers the FontAwesome TTF from `node_modules/@expo/vector-icons`.

---

## Implementation Plan

### Phase 1 — Fix icons on web (unblocks buttons)
**File:** `web/index.html` (new file, Expo reads this as the HTML template override)

Add `@font-face` for FontAwesome pointing at the TTF already bundled at:
`/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf`

This unblocks every `Icon`-based button across all screens.

### Phase 2 — Fix Stockfish analysis
**File:** `src/mock/stockfish.ts`

Replace the engine initialization with the no-Worker NNUE variant:
```ts
const Stockfish = require('stockfish/src/stockfish-nnue-16-no-Worker');
engine = Stockfish();
// API uses addMessageListener instead of onmessage
engine.addMessageListener((msg: string) => { ... });
```
The rest of the parsing logic (score cp, score mate, bestmove) is identical — only the engine factory and listener registration change.

Also update `metro.config.js`: the no-Worker variant loads a `.wasm` file at runtime — add `'wasm'` to `assetExts` so Metro serves it correctly.

### Phase 3 — Fix web layout
**File:** `app/screens/Game.tsx`

- Add `maxWidth: 480, alignSelf: 'center', width: '100%'` to `gameContainer` and `square` styles
- Change `tabContentContainer` width from `Dimensions.get('window').width - 20` to `'100%'`
- Change `tabArea` `alignSelf` to `'stretch'`

**File:** `app/screens/Home.tsx`, `app/screens/Profile.tsx`, `app/screens/Debug.tsx`
- Wrap root container with `maxWidth: 480, alignSelf: 'center'` for consistent centering on wide screens

### Phase 4 — Fix status picker on web
**File:** `app/screens/Game.tsx`

Add a `Platform.OS === 'web'` check around the status picker:
```tsx
import { Platform } from 'react-native';

// web branch:
<select value={gameStatus} onChange={e => setGameStatus(e.target.value)}>
  <option value="Playing">Playing</option>
  ...
</select>

// native branch: existing RNPickerSelect
```

### Phase 5 — Add Upload screen
**New file:** `app/screens/Upload.tsx`

Implements:
- HTML file input (`<input type="file">` wrapped in a TouchableOpacity shim for web)
- Preview of selected image
- Resize via `expo-image-manipulator` (same as Camera.tsx lines 121-130)
- Base64 encode + POST to AWS Lambda (same `sendBase64Image` logic as Camera.tsx lines 146-167)
- On success: call `saveGame()` from `src/mock/store`, navigate to `Game` screen with new game item
- On 400 error: show debug image modal (same CustomAlert pattern as Camera.tsx)
- Loading spinner during upload

**File:** `App.tsx` — add `Upload` to the Stack.Navigator

**File:** `app/screens/Home.tsx` — replace "New Game (FEN)" with two buttons:
- "Upload Photo" → navigates to `Upload`
- "Enter FEN" → navigates to `Debug` (existing)

---

## Critical Files

| File | Change |
|------|--------|
| `web/index.html` | New — FontAwesome font registration |
| `src/mock/stockfish.ts` | Swap engine to no-Worker NNUE variant |
| `metro.config.js` | Add `wasm` to `assetExts` |
| `app/screens/Game.tsx` | Layout maxWidth, picker web compat |
| `app/screens/Home.tsx` | Two buttons: Upload + FEN |
| `app/screens/Profile.tsx` | maxWidth layout |
| `app/screens/Debug.tsx` | maxWidth layout |
| `app/screens/Upload.tsx` | New upload screen |
| `App.tsx` | Add Upload route |

---

## Reusable Code to Reference

- `app/screens/Camera.tsx` lines 121-167 — `resizeImage()`, `fetchAndConvertToBlob()`, `readBlobAsBase64()`, `sendBase64Image()` — copy directly into Upload.tsx
- `app/screens/Camera.tsx` lines 217-237 — `CustomAlert` modal — copy into Upload.tsx
- `src/mock/store.ts` `saveGame()` — use to persist the game after successful YOLO detection
- `app/screens/Debug.tsx` lines 31-48 — `validateAndOpen()` pattern — use for navigate-to-Game after save

---

## Verification

1. `npm run build:web` — must exit 0 with no errors
2. `npx serve dist` — open in browser, verify:
   - Home screen: 3 seeded games visible, star/delete work, both buttons visible
   - Game screen: board renders at ~480px max, save button saves (alert confirms), home button returns to home, title edit works, analysis tab shows a score (e.g. `+0.25`) and moves
   - Upload screen: file picker opens, selecting a chess board image sends to Lambda, success or error handled
   - Profile screen: centered, edit/save works
3. `nvm use 20 && npm run build:web` — verify Node version constraint is respected
4. Deploy to Vercel — confirm production URL works end-to-end

---

## What Is NOT In Scope

- Upgrading Expo / React Native version
- Notes tab implementation (currently placeholder text — leave as-is)
- Move back/forward navigation arrows in Game screen (commented out — leave as-is)
- Production Firebase auth / MongoDB (demo branch only)
- WebRTC live camera (file upload only for web)
