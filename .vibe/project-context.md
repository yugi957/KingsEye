# Project Context

- **Name:** KingsEye
- **Stack:** React Native 0.72.10 / Expo 49 / TypeScript / Metro bundler / Node 20
- **Target:** Web (demo branch). `npm run build:web` → `dist/`. Deployed on Vercel.
- **Architecture:** Single-page Expo app with React Navigation (native stack). No expo-router. Mock backend replaces Firebase/Heroku.

## Mission

> **Get existing functionality working on the web. Do NOT add new features.**

Every screen already exists. Fix what's broken in the browser. If it's not in the DoD, don't touch it.

## Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Root navigator |
| `app/screens/Camera.tsx` | Web: file picker → Lambda; Native: camera |
| `app/screens/Game.tsx` | Chessboard + Analysis tab |
| `src/mock/stockfish.ts` | In-browser Stockfish (no-Worker NNUE) |
| `src/mock/store.ts` | AsyncStorage game CRUD, pre-seeded |
| `metro.config.js` | wasm assetExts + Node built-in shims |
| `docs/LEARNINGS.md` | Known issues and fixes — read before coding |
| `e2e/` | Playwright E2E tests |

## Anti-Patterns

1. No new screens, routes, or features
2. No Expo/RN/Metro upgrades (pinned: Expo 49, RN 0.72.10, Node 20)
3. No Firebase SDK — `FirebaseConfig.ts` re-exports `src/mock/auth.ts`
4. No server-side code — static SPA only
5. Notes tab and move nav are intentional placeholders — leave them

## Definition of Done

Done when all Playwright E2E tests pass locally:

- **Home** — 3 seeded games visible; star/trash icons not blank; both buttons present
- **Camera** — `<input type="file">` present; reachable from Home
- **Game** — board renders; icons not blank; Analysis tab shows a score (not "Error") within 15s; status `<select>` present
- **Profile** — loads; name/email visible; centered ≤480px
- **Debug** — FEN input present; navigates to Game
- **Build** — `npm run build:web` exits 0

## Commands

```bash
npm run build:web                          # build
npx serve dist                             # preview
npm test                                   # unit tests
npx playwright test                        # E2E (requires build + serve on :3000)
```
