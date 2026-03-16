# KingsEye

A chess companion app. Log in, review past games on an interactive board, get Stockfish engine analysis (best moves, evaluation score, principal variation), and scan physical boards with your camera to import positions.

### Demo video
[![King's Eye Demo](https://github.com/yugi957/KingsEye/assets/74220837/1a6090ba-dbec-4dd8-a27e-4b79d195942e)](https://drive.google.com/file/d/1rVLODHcqqeoMd1b_u2NQpbmCA7T3kGP_/view?usp=sharing)

---

## Branches

| Branch | Description |
|---|---|
| `main` | Full-stack app — Expo + Firebase Auth + MongoDB + Heroku backend |
| `demo` | Browser-only build — no backend, no auth, no camera (see below) |

---

## Demo Branch — Changes from Production

The `demo` branch removes all external dependencies so the app builds and runs as a fully static web page. No server, no Firebase account, no camera hardware required.

### What changed

| Layer | Production | Demo |
|---|---|---|
| **Auth** | Firebase Auth (email/password + Google Sign-In) | Auto-logged in as "Demo User" — no credentials needed |
| **Entry screen** | Login → Signup → Home | Starts directly at Home |
| **User/game data** | MongoDB Atlas via Heroku Express API | `AsyncStorage` (browser `localStorage`) |
| **Chess engine** | Heroku `/evaluationScore` + `/principalVariation` endpoints (Node.js Stockfish server) | In-browser Stockfish via the `stockfish` npm package |
| **Camera / OCR** | `expo-camera` + AWS Lambda image processing | Replaced with a FEN-paste screen |

---

### New files (demo branch only)

**`src/mock/auth.ts`**
Drop-in replacement for `FirebaseConfig.ts`. Exports a mock `FIREBASE_AUTH` object with a pre-set demo user (`demo@kingseye.app`). `signOut()` is a no-op. No Firebase SDK is initialized.

**`src/mock/store.ts`**
`AsyncStorage`-backed game and user store. Replaces all Heroku fetch calls for game CRUD (`getGames`, `saveGame`, `updateGame`, `deleteGame`) and user profile (`getUser`, `setUserData`). Pre-seeded on first load with three annotated sample games:
- *Sicilian Defense* (Win as White)
- *Queen's Gambit* (Loss as Black)
- *Italian Game* (Draw as White)

**`src/mock/stockfish.ts`**
Runs the Stockfish chess engine entirely in the browser using the `stockfish` npm package (already in the repo). A single shared engine instance is reused across all analysis requests. Exposes `getEvaluationScore(fen)` and `getPrincipalVariation(fen)` with the same return shapes as the Heroku endpoints. Analysis runs at depth 12.

---

### Modified files (demo branch)

**`FirebaseConfig.ts`**
Re-exports `FIREBASE_AUTH` and `FIREBASE_APP` from `src/mock/auth.ts`. All screens import from this file unchanged — the swap is transparent.

**`App.tsx`**
- `initialRouteName` changed from `'Login'` to `'Home'`
- `Login`, `Signup`, and `Camera` screens removed from the navigator

**`app/screens/Home.tsx`**
- `fetch('https://kingseye-1cd08c4764e5.herokuapp.com/getGames...')` → `getGames()` from mock store
- `fetch('.../deleteGame')` → `deleteGame()` from mock store
- `fetch('.../updateGame')` → `updateGame()` from mock store
- "Take Picture" button replaced with "New Game (FEN)" navigating to the FEN screen

**`app/screens/Game.tsx`**
- `fetch('.../updateGame')` → `updateGame()` from mock store
- `fetch('.../getUser')` → `getUser()` from mock store

**`app/screens/Profile.tsx`**
- `fetch('.../getUser')` → `getUser()` from mock store
- `fetch('.../setUserData')` → `setUserData()` from mock store
- Sign Out navigates to Home instead of Login
- Delete Account shows a "not available in demo" message instead of calling the API

**`app/components/AnalysisBar.tsx`**
- `fetch('.../evaluationScore')` + `fetch('.../principalVariation')` → `analyzePosition()` from `src/mock/stockfish.ts`
- Uses a `cancelled` flag to discard results from stale FEN requests when the user navigates moves quickly

**`app/screens/Debug.tsx`**
Completely replaced. The original screen used `expo-camera` and AWS Lambda — both unavailable in a web build. The demo version is a FEN-paste interface with four preset positions:
- Starting Position
- Sicilian Defense (after 1.e4 c5 2.Nf3)
- Ruy Lopez (after 3.Bb5)
- K+Q vs K endgame

**`app.json`**
Added `"web": { "bundler": "metro", "output": "static" }` for `expo export --platform web`.

---

## Deploying the demo

Only the repo root is deployed (no separate backend folder).

| Setting | Value |
|---|---|
| Repository branch | `demo` |
| Root directory | `/` (repo root) |
| Build command | `./node_modules/.bin/expo export --platform web` |
| Output directory | `dist` |

> **Note:** Use `./node_modules/.bin/expo` instead of `npx expo` to avoid npx pulling the latest Expo version (55+), which is incompatible with the Expo 49 packages installed in this repo.

---

## Production Setup

### Prerequisites
- Node.js 18+
- Firebase project with Email/Password auth enabled
- MongoDB Atlas cluster (`kings-eye`)
- Heroku app with the Express server from `src/server.js` deployed

### Install & run

```bash
npm install

# Copy stockfish.js into node_modules (see note below)
cp src/stockfish.js node_modules/stockfish/src/stockfish.js

# Start the Heroku backend (separate terminal)
node src/server.js

# Start Expo
npx expo start
```

> **Stockfish note:** The `stockfish` npm package is missing a file after `npm install`. Copy `src/stockfish.js` into `node_modules/stockfish/src/` manually.

### Server URL
```
https://kingseye-1cd08c4764e5.herokuapp.com/
```

### API reference

```bash
# Best move
curl "https://kingseye-1cd08c4764e5.herokuapp.com/bestMove?fen=<FEN>"
# → {"firstMove":"b8c6","secondMove":"b1c3"}

# Evaluation score
curl "https://kingseye-1cd08c4764e5.herokuapp.com/evaluationScore?fen=<FEN>"
# → {"evaluation": 17}          (positive = white advantage)
# → {"evaluation": "Mate in -2"} (negative = black mates)

# Principal variation
curl "https://kingseye-1cd08c4764e5.herokuapp.com/principalVariation?fen=<FEN>"
# → {"moves":["a3a5","d3c5",...]}
```
