# Repo Improvements — Pre-Portal Checklist

> This document catalogues every infrastructure, tooling, and housekeeping task that **must** be completed before Portal feature work begins. Each section includes context on *why* the change matters and a concrete checklist of deliverables.

---

## 1. Rebrand: Remove Upstream Fork References

The repo was forked from `rossimo/decky-pip`. Several files still carry the old name, description, author metadata, and repository URLs. These need to be updated so that contributors, the Decky store, and package tooling all refer to the correct project.

### What needs to change

- [x] **`package.json`** — Update `name` from `decky-pip` to `decky-portal`.
- [x] **`package.json`** — Update `description` to reflect Portal's purpose.
- [x] **`package.json`** — Update `repository.url`, `bugs.url`, and `homepage` to the Portal repo.
- [x] **`package.json`** — Update `keywords` (replace `pip` with `portal`, `browser`, etc.).
- [x] **`package.json`** — Add Portal author/maintainer while preserving original attribution.
- [x] **`plugin.json`** — Change `name` from `"Picture in Picture"` to `"Portal"`.
- [x] **`plugin.json`** — Update `author` to reflect current maintainership (keep BSD-3-Clause attribution to Ross Squires in `LICENSE` and a credits section).
- [x] **`plugin.json`** — Update `publish.description` and `publish.image`.
- [x] **`plugin.json`** — Update `publish.tags` to include `portal`, `browser`, `streaming`.
- [x] **`src/index.tsx`** — Change the `name` returned by `definePlugin` from `"Picture in Picture"` to `"Portal"`.
- [x] **`src/index.tsx`** — Update the `titleView` text.
- [x] **`src/index.tsx`** — Rename the global component key from `"PictureInPicture"` to `"Portal"`.
- [x] **`README.md`** (root) — Rewrite to describe Portal. The current root README still references the original PiP plugin and its screenshots.
- [x] **`deck.json`** — Reviewed deployment target settings; no changes required.

### Why this matters

Leftover fork metadata causes confusion for contributors, may appear on the Decky store listing, and makes the project look unfinished.

---

## 2. Linting

There is currently **no linter** configured in the repo. This means code style, unused imports, and potential bugs go undetected until someone reads the code manually.

### Deliverables

- [x] Install ESLint and appropriate plugins: `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, `eslint-plugin-react-hooks`.
- [x] Create an `.eslintrc.cjs` (or `eslint.config.mjs` for flat config) with sensible defaults for a React + TypeScript project.
- [x] Add a `lint` script to `package.json`: `"lint": "eslint src --ext .ts,.tsx"`.
- [x] Add a `lint:fix` script: `"lint:fix": "eslint src --ext .ts,.tsx --fix"`.
- [x] Run the linter against the existing codebase and fix any errors before merging.
- [x] Ensure `noUnusedLocals` and `noUnusedParameters` in `tsconfig.json` are kept as-is (they complement ESLint).

### Recommended rules to enable

| Rule                                 | Reason                                                                                                                                 |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `@typescript-eslint/no-explicit-any` | Warn — the codebase currently uses `any` in several places (`pip.tsx`, `index.tsx`). Flag them so they can be addressed incrementally. |
| `react-hooks/rules-of-hooks`         | Error — prevents hooks from being called conditionally.                                                                                |
| `react-hooks/exhaustive-deps`        | Warn — catches missing dependencies in `useEffect`.                                                                                    |
| `no-console`                         | Warn — prevents accidental `console.log` shipping in production.                                                                       |

---

## 3. Formatting

There is currently **no formatter** configured. Consistent formatting removes style debates from code review and keeps diffs clean.

### Deliverables

- [x] Install Prettier: `pnpm add -D prettier`.
- [x] Create a `.prettierrc` with project-agreed settings (suggested starting point below).
- [x] Create a `.prettierignore` to skip `node_modules`, `out`, `dist`, and `pnpm-lock.yaml`.
- [x] Add a `format` script: `"format": "prettier --write \"src/**/*.{ts,tsx}\""`.
- [x] Add a `format:check` script: `"format:check": "prettier --check \"src/**/*.{ts,tsx}\""`.
- [ ] Run the formatter against the existing codebase in a standalone commit so the diff is isolated. (Formatting is complete; isolated commit still pending.)
- [x] Install `eslint-config-prettier` to disable ESLint rules that conflict with Prettier.

### Suggested `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 100
}
```

> **Open Question:** Confirm tab width and print width preferences before committing the config. Answer: Looks good!

---

## 4. Testing Framework

There are currently **zero tests** in the repo — no test runner, no test files, no coverage reporting. The Testing Strategy is detailed in full in [TESTING.md](TESTING.md); this section covers only the setup deliverables.

### Deliverables

- [x] Install Vitest and supporting packages (see [TESTING.md](TESTING.md) for the full dependency list).
- [x] Create a `vitest.config.ts` at the project root.
- [x] Add a `test` script: `"test": "vitest run"`.
- [x] Add a `test:watch` script: `"test:watch": "vitest"`.
- [x] Add a `test:coverage` script: `"test:coverage": "vitest run --coverage"`.
- [x] Create a `src/__tests__/` directory for unit tests.
- [x] Create a `src/__mocks__/` directory for shared mocks (Decky API, Steam browser, `localStorage`).
- [x] Write baseline tests for the existing pure-logic modules before any refactoring:
  - [x] `geometry.tsx` — `intersectRectangles` (pure function, easiest starting point).
  - [x] `util.tsx` — enum validity, constant values.
  - [x] `globalState.tsx` — state initialisation and `useGlobalState` behaviour.
- [x] Ensure coverage report output is added to `.gitignore`.

---

## 5. Continuous Integration (CI)

There is **no CI pipeline**. PRs can be merged with broken builds, lint failures, or test regressions.

### Deliverables

- [x] Create `.github/workflows/ci.yml` with a pipeline that runs on `push` and `pull_request` to `main`.
- [x] Pipeline steps:
  1. Checkout code.
  2. Set up Node (match version in an `.nvmrc` or `package.json` `engines` field).
  3. Install dependencies via `pnpm install --frozen-lockfile`.
  4. Run `pnpm lint`.
  5. Run `pnpm format:check`.
  6. Run `pnpm test:coverage`.
  7. Run `pnpm build`.
- [x] Add an `.nvmrc` file specifying the Node.js version the project targets.
- [x] Add an `engines` field to `package.json` to document the minimum Node and pnpm versions.
- [x] Consider adding a branch protection rule that requires the CI check to pass before merge. (Manual GitHub repository setting.)

---

## 6. `.gitignore` Improvements

The current `.gitignore` is adequate but has gaps.

### Deliverables

- [x] Add `coverage/` (Vitest coverage output).
- [x] Add `*.tsbuildinfo` (TypeScript incremental build cache).
- [x] Add `.eslintcache`.
- [x] Confirm `out/` and `dist/` are already covered (they are).
- [x] Remove `lib-cov` (leftover from Istanbul v1, no longer relevant).

---

## 7. TypeScript Config Hardening

The existing `tsconfig.json` is solid. A few improvements will catch more bugs and align with modern best practices.

### Deliverables

- [x] Add `"forceConsistentCasingInFileNames": true` — prevents casing-related import bugs on case-insensitive file systems.
- [x] Add `"skipLibCheck": true` — speeds up compilation by skipping type-checking of declaration files in `node_modules`.
- [x] Add `"resolveJsonModule": true` — allows importing JSON files (useful if bookmark data or config is stored as JSON).
- [x] Consider adding `"isolatedModules": true` — required for compatibility with tools like Vitest and esbuild that process files individually.
- [x] Review `"noUnusedLocals"` and `"noUnusedParameters"` — keep as `true`, they complement ESLint.

---

## 8. `localStorage` Key Migration

The current state is persisted under the key `"pip"`. This should be migrated to `"portal"` to match the rebrand.

### Deliverables

- [ ] Write a one-time migration function that:
  1. Reads `localStorage.getItem('pip')`.
  2. If data exists and `'portal'` does not, copies the data to `'portal'` and removes `'pip'`.
  3. If both exist, prefers `'portal'` (the migrated key).
- [x] Update `src/index.tsx` to read/write under `'portal'`.
- [ ] Add a unit test for the migration logic.

> Decision: For a greenfield setup with no legacy installs, migration from `pip` to `portal` is intentionally skipped.

---

## 9. Source File Naming & Organisation

Before new features add dozens of files, establish a clear directory convention.

### Deliverables

- [x] Decide on a file naming convention and document it (recommended: `kebab-case.tsx` for components, `kebab-case.ts` for non-JSX modules).
- [x] Rename existing files to match the convention if needed (e.g., `globalState.tsx` → `global-state.tsx`, `urlModal.tsx` → `url-modal.tsx`, `useUIComposition.tsx` → `use-ui-composition.tsx`).
- [x] Create a `src/components/` directory for React components.
- [x] Create a `src/hooks/` directory for custom hooks.
- [x] Create a `src/lib/` or `src/utils/` directory for pure utility functions (geometry, constants, helpers).
- [x] Update all internal import paths after restructuring.
- [x] Ensure the build still compiles cleanly after renames.

**Decision:** Use `kebab-case` for all source filenames. Organize by responsibility: UI in `src/components/`, hooks in `src/hooks/`, and shared non-UI modules in `src/lib/`.

> **Open Question:** Should component and hook tests live alongside their source files (`Button.test.tsx` next to `Button.tsx`) or in a centralised `__tests__/` directory? Both are valid — decide before writing tests. Answer: I like tests next to the source so I remember to write them.

---

## 10. Root `README.md` Rewrite

The root README is a leftover from the upstream fork and still says "Picute in Picture" (with a typo). It needs a full rewrite.

### Deliverables

- [x] Write a new `README.md` that includes:
  - Project name, tagline, and a brief description.
  - A screenshot or GIF (can be a placeholder until new branding is ready).
  - Installation instructions (Decky store or manual sideload).
  - Development setup instructions (`pnpm install`, `pnpm build`, deployment to Deck).
  - Link to the `docs/` folder for detailed documentation.
  - Licence and attribution (BSD-3-Clause, credit to Ross Squires).
- [x] Remove or replace the existing `picture.jpg` and `expand.jpg` screenshots.

---

## 11. Dependency Audit

Review current dependencies for relevance, maintenance status, and bundle size.

### Deliverables

- [x] **`lodash`** — Only `merge` and `isEqual` are used. Consider replacing with smaller alternatives or native equivalents to reduce bundle size:
  - `isEqual` → `JSON.stringify` comparison (already shallow) or a lightweight deep-equal utility.
  - `merge` → spread operator or `structuredClone` (if deep clone is truly needed).
- [x] **`@types/lodash`** — Remove if Lodash is removed.
- [x] **`@types/webpack`** — Not referenced anywhere in the codebase. Likely a leftover. Remove.
- [x] **`cotton-box` / `cotton-box-react`** — Evaluate whether this state management library is still the best fit as features grow, or whether a simpler React Context + `useReducer` pattern would suffice.
- [x] Run `pnpm audit` and resolve any reported vulnerabilities.
- [x] Run `pnpm outdated` and update non-breaking dependencies.

**Step 11 outcome:** `lodash` and `@types/lodash` were removed after replacing `merge` and `isEqual` with native/local logic. `@types/webpack` was already removed. `pnpm audit` reports no known vulnerabilities. `pnpm outdated` reports only major-version upgrades (or intentionally pinned React type majors), so no non-breaking dependency updates were available to apply. `cotton-box` / `cotton-box-react` remain in place for now because current state usage is simple and stable; reevaluate during larger state-management refactors.

---

## 12. Update npm Packages

All dependencies should be brought to their latest compatible versions before feature work begins. This reduces the surface area for known bugs, ensures access to the latest APIs, and prevents a painful bulk-upgrade later.

> **Research date:** February 2026 — re-run `pnpm outdated` before executing to catch any releases since this doc was written.

### Existing `devDependencies`

| Package                            | Installed | Target      | Bump      | Notes                                                                                                                             |
| ---------------------------------- | --------- | ----------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@decky/rollup`                    | ^1.0.1    | **1.0.2**   | Patch     | Safe.                                                                                                                             |
| `@decky/ui`                        | ^4.9.0    | **^4.11.1** | Minor     | Safe — active development, no breaking changes within 4.x.                                                                        |
| `@types/react`                     | 18.3.3    | **18.3.28** | Patch     | ⚠️ **Stay on 18.x** — Decky runs React 18. The latest `@types/react` on npm is 19.x which is incompatible. Keep pinned (no caret). |
| `@types/react-dom`                 | 18.3.0    | **18.3.7**  | Patch     | ⚠️ Same as `@types/react` — stay on 18.x, keep pinned.                                                                             |
| `@types/webpack`                   | ^5.28.5   | **Remove**  | —         | Not used anywhere. Leftover from the fork.                                                                                        |
| `eslint`                           | ^9.39.2   | **^9.39.2** | ✅ Current | ESLint 10.0.0 has been released — **do not upgrade yet**. Plugin ecosystem is still catching up. Stay on 9.x.                     |
| `@eslint/js`                       | ^9.39.2   | **^9.39.2** | ✅ Current | Tied to ESLint — stay on 9.x.                                                                                                     |
| `@typescript-eslint/eslint-plugin` | ^8.55.0   | **^8.55.0** | ✅ Current | Already at latest.                                                                                                                |
| `@typescript-eslint/parser`        | ^8.55.0   | **^8.55.0** | ✅ Current | Already at latest.                                                                                                                |
| `eslint-plugin-react`              | ^7.37.5   | **^7.37.5** | ✅ Current | Already at latest.                                                                                                                |
| `eslint-plugin-react-hooks`        | ^7.0.1    | **^7.0.1**  | ✅ Current | Already at latest.                                                                                                                |
| `rollup`                           | ^4.22.5   | **^4.57.1** | Minor     | Safe — many minor releases, no breaking changes within 4.x.                                                                       |
| `typescript`                       | ^5.6.2    | **^5.9.3**  | Minor     | Safe — three minor versions ahead (5.7, 5.8, 5.9).                                                                                |

### Existing `dependencies`

| Package            | Installed | Target       | Bump            | Notes                                                                                                                                                         |
| ------------------ | --------- | ------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@decky/api`       | ^1.1.2    | **^1.1.3**   | Patch           | Safe.                                                                                                                                                         |
| `@types/lodash`    | ^4.17.13  | **^4.17.23** | Patch           | Safe. Remove entirely if Lodash is dropped (see §11).                                                                                                         |
| `cotton-box`       | ^0.3.0    | **^0.14.0**  | Minor (pre-1.0) | ✅ Safe despite the large version jump. The APIs the project uses (`StateManager`, `.get()`, `.set()`, `.watch()`) have not changed. See research notes below. |
| `cotton-box-react` | ^0.3.0    | **^0.14.0**  | Minor (pre-1.0) | ✅ Same as `cotton-box` — `useStateValue` is unchanged. Must upgrade in lockstep with `cotton-box`.                                                            |
| `lodash`           | ^4.17.21  | **^4.17.23** | Patch           | Safe. Extremely stable.                                                                                                                                       |
| `react-icons`      | ^5.3.0    | **^5.5.0**   | Minor           | Safe — only adds new icon sets.                                                                                                                               |
| `tslib`            | ^2.7.0    | **^2.8.1**   | Minor           | Safe.                                                                                                                                                         |

### New packages (not yet installed)

| Package                       | Version     | Category                    | Notes                                                      |
| ----------------------------- | ----------- | --------------------------- | ---------------------------------------------------------- |
| `prettier`                    | **^3.8.1**  | Formatter                   | Stable.                                                    |
| `eslint-config-prettier`      | **^10.1.8** | Lint/Format bridge          | Peer requires `eslint >=7.0.0` — compatible with ESLint 9. |
| `vitest`                      | **^4.0.18** | Test runner                 | Requires Node ^20 \|\| ^22 \|\| >=24. Current Node 22.x ✅. |
| `@vitest/coverage-v8`         | **^4.0.18** | Coverage provider           | Must match Vitest major.minor.                             |
| `@testing-library/react`      | **^16.3.2** | Component testing           | Supports React 18 ✅.                                       |
| `@testing-library/jest-dom`   | **^6.9.1**  | DOM matchers                | Stable.                                                    |
| `@testing-library/user-event` | **^14.6.1** | User interaction simulation | Stable.                                                    |
| `happy-dom`                   | **^20.6.1** | Lightweight DOM for Vitest  | Fast alternative to jsdom.                                 |

### `cotton-box` upgrade research (0.3 → 0.14)

The `cotton-box` and `cotton-box-react` packages are pre-1.0, so minor bumps can theoretically contain breaking changes. A changelog review of all 11 intermediate releases confirms:

- **`StateManager`** constructor, `.get()`, `.set()`, `.watch()` — **no breaking changes** across the entire range.
- **`.watch()` callback** gained an optional second parameter (`StateChangeEventType`) in 0.3.0 itself. Existing callbacks that ignore it are unaffected.
- **`useStateValue`** — unchanged throughout.
- **Removed APIs** (`Equality`, `StateManagerScopeProvider`, `useScoped`, `Watcher.refresh`) are not used by this project.
- **New transitive dependency:** `@glyph-cat/equality@^1.0.0` will be auto-installed by pnpm.

**Verdict:** Upgrade to 0.14.0 with no code changes required.

### ⚠️ Version pinning warnings

1. **`@types/react` and `@types/react-dom` must stay pinned to 18.x.** The latest tags on npm now point to 19.x. Always install with an explicit version: `pnpm add -D @types/react@18.3.28 @types/react-dom@18.3.7`.
2. **ESLint must stay on 9.x** until the TypeScript ESLint and React plugins officially support ESLint 10.
3. **`@vitest/coverage-v8` must match the Vitest version.** Always upgrade them together.

### Checklist

- [x] Run `pnpm outdated` to confirm versions haven't moved since this doc was written.
- [x] Update `devDependencies` in `package.json` per the table above.
- [x] Update `dependencies` in `package.json` per the table above.
- [x] Remove `@types/webpack` from `devDependencies`.
- [x] Run `pnpm install` and verify the lockfile updates cleanly.
- [x] Run `pnpm build` to confirm the project compiles with the new versions.
- [x] Run `pnpm lint` to confirm no new lint errors.
- [x] Run `pnpm audit` and resolve any advisories.
- [ ] Commit the lockfile update in an isolated commit titled `chore: update dependencies`.

--

## Definition of Done

All items above are considered **done** when:

1. Every checklist item is ticked.
2. The CI pipeline passes on `main`.
3. `pnpm lint`, `pnpm format:check`, `pnpm test`, and `pnpm build` all succeed locally with zero warnings or errors.
4. A contributor can clone the repo, run `pnpm install`, and have a working development environment with lint, format, and test tooling out of the box.
