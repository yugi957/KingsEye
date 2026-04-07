# Global Agent Instructions
You are an expert software architect. Write clean, secure, and optimized code while strictly adhering to the project context and constraints.

## Primary Directives
1. **Plan Before Coding**: For any task touching >2 files, output an architectural plan first.
2. **Minimal Diff**: Only modify files explicitly required.
3. **Run Checks**: Always run linting and testing commands after making logic changes.
4. **Follow Conventions**: Match the existing code style. Prefer clarity over cleverness.

---

# Project Context

- **Name:** KingsEye
- **Stack:** React Native 0.72.10 / Expo 49 / TypeScript / Metro bundler / Node 20
- **Target:** Web only (demo branch). Deployed on Vercel. `npm run build:web` → `dist/`.
- **Architecture:** Single-page Expo app with React Navigation (native stack). No expo-router. Mock backend replaces Firebase/Heroku for demo purposes.

> Full context: `.vibe/project-context.md` — read it before making any changes.

---

## MISSION (demo branch)

> **Get existing functionality working on the web. Do NOT add new features.**

Every screen already exists. The only job is to make them work correctly in a browser. If something is not in the Definition of Done below, do not touch it.

## Project Architecture & Directory Map

```
KingsEye/
├── App.tsx                        # Root navigator (React Navigation stack)
├── FirebaseConfig.ts              # Re-exports src/mock/auth.ts (no real Firebase)
├── app/
│   ├── screens/
│   │   ├── Home.tsx               # Game archive list + Upload Photo / Enter FEN buttons
│   │   ├── Camera.tsx             # Web: file picker → AWS Lambda; Native: device camera
│   │   ├── Game.tsx               # Chessboard + move history + Analysis tab
│   │   ├── Profile.tsx            # User info, edit name/photo, sign out
│   │   └── Debug.tsx              # Manual FEN entry → Game
│   ├── components/
│   │   ├── AnalysisBar.tsx        # Stockfish eval score + principal variation
│   │   └── HomeButton.tsx
│   └── styles/globalStyles.ts
├── src/
│   ├── mock/
│   │   ├── auth.ts                # Demo auto-login (no Firebase)
│   │   ├── store.ts               # AsyncStorage game CRUD (pre-seeded with 3 games)
│   │   └── stockfish.ts           # In-browser Stockfish (no-Worker NNUE variant)
│   └── shims/empty.js             # Stubs Node built-ins for Metro web build
├── metro.config.js                # wasm assetExts + Node built-in shims
├── vercel.json                    # buildCommand, outputDirectory, SPA rewrite
├── docs/LEARNINGS.md              # Known issues and fixes — READ BEFORE CODING
└── e2e/                           # Playwright end-to-end tests
```

## Anti-Patterns — NEVER DO THIS

1. **Do not add new screens, routes, or features.** Fix what's broken; don't build new things.
2. **Do not upgrade Expo, React Native, or Metro.** Pinned to Expo 49 / RN 0.72.10 / Node 20.
3. **Do not restore or re-add Firebase SDK.** `FirebaseConfig.ts` re-exports `src/mock/auth.ts`.
4. **Do not add server-side code or API routes.** Static SPA deployed to Vercel.
5. **Do not implement the Notes tab** — placeholder, leave as-is.
6. **Do not implement move back/forward navigation** in Game — commented out, leave as-is.
7. **Do not use `output: "static"` in app.json** — requires expo-router. Use `output: "single"`.
8. **Do not write unit tests for UI rendering or navigation** — use Playwright E2E.

## Definition of Done (DoD)

The web app is done when **all Playwright E2E tests pass locally**:

1. **Home** — 3 pre-seeded games visible; star/trash icons render (not blank); both buttons visible
2. **Camera** — `<input type="file">` present on web; reachable from Home
3. **Game** — board renders; icons not blank; Analysis tab shows a score (not "Error") after ≤15s; status `<select>` present
4. **Profile** — loads; name and email visible; centered ≤480px
5. **Debug** — FEN input present; navigate works
6. **Build** — `npm run build:web` exits 0

## Useful Project Commands

- **Build for web:** `npm run build:web`
- **Preview build:** `npx serve dist`
- **Unit tests:** `npm test`
- **E2E tests:** `npm run build:web && npx serve dist -p 3000 & sleep 2 && npx playwright test`


## Extended Capabilities
ALWAYS read `.vibe/mcp-triggers.md` before executing complex tasks or using external tools.

---

# Operational Rules

## 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).
- If something goes sideways, STOP and re-plan immediately — don't keep pushing.
- Use plan mode for verification steps, not just building.
- Write detailed specs upfront to reduce ambiguity.

## 2. Subagent Strategy
- Use subagents liberally to keep main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, throw more compute at it via subagents.
- One task per subagent for focused execution.

## 3. Self-Improvement Loop
- After ANY correction from the user: update `.vibe/lessons.md` with the pattern.
- Write rules for yourself that prevent the same mistake.
- Ruthlessly iterate on these lessons until mistake rate drops.
- Review `.vibe/lessons.md` at session start for relevant patterns.

## 4. Verification Before Done
- Never mark a task complete without proving it works.
- Diff behavior between main and your changes when relevant.
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness.

## 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution."
- Skip this for simple, obvious fixes — don't over-engineer.
- Challenge your own work before presenting it.

## 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests — then resolve them.
- Zero context switching required from the user.
- Go fix failing CI tests without being told how.

## 7. Task Management
1. **Plan First**: Write plan to `.vibe/todo.md` with checkable items.
2. **Verify Plan**: Check in before starting implementation.
3. **Track Progress**: Mark items complete as you go.
4. **Explain Changes**: High-level summary at each step.
5. **Document Results**: Add review section to `.vibe/todo.md`.
6. **Capture Lessons**: Update `.vibe/lessons.md` after corrections.

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.


---

# MCP Tool Triggers
- Database/SQL: Use postgres MCP to inspect live schema.
- GitHub/VC: Use github MCP to read issues and draft PRs.
- UI/Browser: Use puppeteer MCP to inspect localhost rendering.
- API/Docs: Use context7 MCP for framework documentation.
- Planning: Use sequential-thinking MCP before writing code.
- Search/Research: Use tavily MCP for web search and real-time information.


---

## Lessons & Self-Correction
Read `.vibe/lessons.md` at the start of each session. After ANY user correction, immediately add the pattern to `.vibe/lessons.md`.
