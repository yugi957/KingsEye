# KingsEye Repository Learnings

Key facts about this codebase for future agents and sessions.

## Stack
- Expo 49 / React Native 0.72.10 / Node 20 (pinned via `.nvmrc`)
- Web bundler: Metro (not webpack). Output: `single` (generates `index.html`).
- Deployed on Vercel via `npm run build:web` → `dist/`
- Demo branch only — no Firebase, no Heroku, no camera hardware required

## Key File Locations
- Screens: `app/screens/` (Home, Game, Profile, Debug, Camera, Confirmation, Upload)
- Components: `app/components/` (AnalysisBar, HomeButton)
- Mock backend: `src/mock/` (auth.ts, store.ts, stockfish.ts)
- Auth swap: `FirebaseConfig.ts` re-exports from `src/mock/auth.ts`
- Node shims: `src/shims/empty.js` — stubs Node built-ins for Metro web build
- Stockfish binary: `node_modules/stockfish/src/stockfish.js` — committed to git via `.gitignore` exception; `scripts/postinstall.js` restores it after `npm install`

## Known Issues & Fixes Applied

### Node 24 / `node:sea` crash
- **Problem:** Node 24 adds `sea` to `process.binding('natives')`, which Expo 49 CLI tries to create as a directory `node:sea` — illegal on Windows (colon in path).
- **Fix:** `.nvmrc` pins Node 20. `package.json` has `"engines": ">=18 <21"`. Vercel reads `.nvmrc` automatically.

### `stockfish` npm package missing `src/stockfish.js`
- **Problem:** `stockfish` v16 doesn't ship `src/stockfish.js` (legacy v10). It's committed to git.
- **Fix:** `scripts/postinstall.js` runs `git checkout HEAD -- node_modules/stockfish/src/stockfish.js` if the file is missing. Runs automatically via `"postinstall"` in `package.json`.

### Metro can't resolve Node built-ins (fs, path, crypto, etc.)
- **Problem:** `stockfish.js` v10 requires Node built-ins inside `ENVIRONMENT_IS_NODE` guards. Metro resolves all `require()` statically.
- **Fix:** `metro.config.js` maps all Node built-in names to `src/shims/empty.js` via `resolver.extraNodeModules`.

### Expo `output: "static"` requires expo-router
- **Problem:** `output: "static"` in `app.json` requires expo-router (file-based routing). This app uses React Navigation.
- **Fix:** Changed to `output: "single"` which generates a proper `index.html` without expo-router.

### `react-native-vector-icons` invisible on web
- **Problem:** FontAwesome TTF not registered on web — Icon buttons render as invisible/blank.
- **Fix:** Add `@font-face` CSS in `web/index.html` (Expo HTML template override) pointing at the TTF bundled at `/assets/...Fonts/FontAwesome.ttf`.

### Stockfish analysis tab shows "Error"
- **Problem:** Legacy `stockfish.js` v10 spawns a Web Worker via relative URL. After Metro bundling the path is wrong — worker never loads, promise never resolves.
- **Fix:** Switch `src/mock/stockfish.ts` to `stockfish/src/stockfish-nnue-16-no-Worker.js` (synchronous, no Worker needed). Uses `addMessageListener` instead of `onmessage`. Add `wasm` to `assetExts` in `metro.config.js`.

### Layout broken on wide screens
- **Problem:** `Dimensions.get('window').width` on a 1440px desktop = 1440px wide panels. App was designed for 375px phone portrait.
- **Fix:** Add `maxWidth: 480, alignSelf: 'center'` to root containers in all screens.

### `react-native-picker-select` broken on web
- **Problem:** Incomplete web support; `Icon` prop depends on `react-native-vector-icons`.
- **Fix:** `Platform.OS === 'web'` branch uses native HTML `<select>`.

## Architecture: Demo vs Production
| Layer | Demo (this branch) | Production (main) |
|-------|-------------------|-------------------|
| Auth | Mock auto-login (`src/mock/auth.ts`) | Firebase Auth |
| Data | AsyncStorage / localStorage (`src/mock/store.ts`) | MongoDB via Heroku |
| Chess engine | In-browser Stockfish (`src/mock/stockfish.ts`) | Heroku `/evaluationScore` endpoint |
| Image input | File upload → AWS Lambda | Camera → AWS Lambda |
| Entry route | Home (skips login) | Login screen |

## AWS Lambda (YOLO/Chess Detection)
- Endpoint: `https://rbz0ltdjwg.execute-api.us-east-2.amazonaws.com/Development/process-image`
- Input: base64 image string (POST, `Content-Type: text/plain`)
- Output 200: FEN string (append `" w KQkq - 0 1"` for full FEN)
- Output 400: `{ error: string, image: base64_debug_image }`
- Image should be resized to 640×640 before sending
- The YOLO model itself is NOT in this repo — runs entirely on Lambda

## Navigation Routes (demo branch)
- `Home` (initial) → `Profile`, `Game`, `Debug`, `Upload`
- `Game` → `Home`
- `Upload` → `Game` (on success), `Home` (cancel)
- `Debug` → `Home`, `Game`
- `Profile` → `Home`

## Build & Deploy
```bash
nvm use 20
npm install          # postinstall restores stockfish.js
npm run build:web    # outputs to dist/
npx serve dist       # local preview
```
Vercel config in `vercel.json`: buildCommand=`npm run build:web`, outputDirectory=`dist`, SPA rewrite `/(.*) → /index.html`.

## chess.js Version Note
- App uses `chess.js ^1.0.0-beta.6`
- `react-native-chessboard-custom` depends on `chess.js ^0.12.1`
- Both coexist — different APIs. App code uses v1 beta API. Chessboard package bundles its own copy.
