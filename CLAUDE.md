# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Decky Portal is a Steam Deck plugin (Decky Loader) that provides a floating in-game web browser (Picture-in-Picture). It lets users view websites like YouTube, Netflix, and Twitch in a popup window while gaming. Forked from [decky-pip](https://github.com/rossimo/decky-pip), now being overhauled into a full-featured browser companion.

**Current phase:** Phase 0 (Repo Foundations) — establishing build/test infrastructure before feature work begins.

## Commands

```bash
pnpm build            # Build with Rollup (@decky/rollup plugin) → dist/
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm format           # Prettier format src/**/*.{ts,tsx}
pnpm format:check     # Prettier check only
pnpm test             # Vitest run once
pnpm test:watch       # Vitest watch mode
pnpm test:coverage    # Vitest with coverage (80% thresholds for statements/functions/lines, 75% branches)
```

Run a single test file: `pnpm vitest run src/components/portal-view.test.tsx`

**Requirements:** Node >=22 (see .nvmrc), pnpm >=9

## Architecture

### JSX Configuration

This project does **not** use standard React JSX. The TSConfig maps JSX to Steam's internal React:
- `jsxFactory`: `window.SP_REACT.createElement`
- `jsxFragmentFactory`: `window.SP_REACT.Fragment`

The test setup (`src/__tests__/setup.ts`) initializes `window.SP_REACT` from the real React import. This is critical for tests to work.

### State Management

Uses **cotton-box** (not Redux/Context). Global state is defined in `src/hooks/global-state.tsx` as a `StateManager<State>` singleton. Key state fields: `viewMode`, `position`, `visible`, `margin`, `size`, `url`. State is persisted to localStorage under key `"portal"`.

Access state in components via the `useGlobalState()` hook which returns `{ state, setState, context }`.

### Core Components

- **`src/index.tsx`** — Plugin entry point. Registers global component and settings via `definePlugin()`.
- **`src/components/portal-view.tsx`** — Main browser view (~700 lines). Manages BrowserView lifecycle, calculates positioning to avoid Steam UI overlays (nav menu, QAM, virtual keyboard). Polls UI bounds every 250ms.
- **`src/components/settings.tsx`** — Quick Access Menu settings panel.
- **`src/components/modal.tsx`** — HOC (`modalWithState`) that wraps modals with global state context.
- **`src/components/url-modal.tsx`** — URL input modal.

### Geometry System

`src/lib/geometry.ts` implements rectangle intersection math to calculate safe areas for the browser overlay, preventing overlap with Steam's system UI elements.

### Key Constants (`src/lib/util.ts`)

- Screen: 854×534 (Steam Deck resolution)
- PiP window: ~341×184 (40% width, 1:1.85 aspect ratio)
- `ViewMode` enum: Expand (1), Picture (2), Closed (3)
- `Position` enum: 8 positions (TopLeft through Left)

### Browser Integration

Uses Steam's internal browser via `Router.WindowStore?.GamepadUIMainWindowInstance.CreateBrowserView()`. The BrowserView is managed with `LoadURL`, `SetBounds`, `SetVisible`, `Destroy`. Attached to `window.portal` for debugging.

### Testing

- Vitest with happy-dom environment
- `@decky/api` is aliased to `src/__mocks__/decky-api.ts` in vitest config
- Additional mocks in `src/__mocks__/` for steam-browser and localStorage
- Test files live alongside source as `*.test.{ts,tsx}` and in project root for lib utilities

### UI Library

Uses `@decky/ui` components (PanelSection, ButtonItem, ToggleField, SliderField, DropdownItem, ConfirmModal, showModal). Styling uses `quickAccessMenuClasses` and inline styles — no separate CSS files.

## Code Style

- Strict TypeScript (`strict: true`)
- Prettier: single quotes, trailing commas, 2-space indent, 100 char width, semicolons
- ESLint: unused vars allowed with `_` prefix, `no-explicit-any` is a warning, `no-console` is a warning
- Use strict equality (`===`/`!==`) for enum comparisons

## Policy

AI-generated code is permitted but must be reviewed before merge. No AI-generated visual/audio assets allowed. See `docs/AI_CODE_POLICY.md`.
