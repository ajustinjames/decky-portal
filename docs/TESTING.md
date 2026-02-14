# Testing Strategy

> This document defines how Decky Portal is tested — the tools, the architecture, the mocking approach, and the coverage goals. It is the companion to [Repo Improvements § 4](REPO_IMPROVEMENTS.md#4-testing-framework) which covers setup checklist items.

---

## 1. Why Vitest

| Criterion         | Vitest                                                         | Jest                                       |
| ----------------- | -------------------------------------------------------------- | ------------------------------------------ |
| ESM support       | Native — the project is `"type": "module"`                     | Requires experimental flags and transforms |
| Speed             | Uses Vite's transform pipeline; near-instant HMR in watch mode | Slower cold starts, heavier transform step |
| TypeScript        | First-class via esbuild/SWC, zero config                       | Needs `ts-jest` or Babel preset            |
| API compatibility | Drop-in Jest-compatible API (`describe`, `it`, `expect`)       | N/A                                        |
| React support     | Works with `@testing-library/react` and `jsdom` / `happy-dom`  | Same, but with more config boilerplate     |

**Decision:** Use **Vitest** as the test runner and assertion library.

---

## 2. Dependencies to Install

All as `devDependencies`:

```
vitest
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event
happy-dom
@vitest/coverage-v8
```

### Why `happy-dom` over `jsdom`

`happy-dom` is significantly faster and sufficient for the lightweight DOM operations Portal performs. If compatibility issues arise with Steam/Decky UI components, switch to `jsdom`.

---

## 3. Configuration

### `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/__tests__/**',
        'src/__mocks__/**',
        'src/types.d.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

### `src/__tests__/setup.ts`

Global setup that runs before every test file:

```ts
import '@testing-library/jest-dom/vitest';

// Provide a minimal localStorage stub for happy-dom
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });
```

---

## 4. Mocking Strategy

Decky Portal runs inside Steam's CEF (Chromium Embedded Framework) runtime, which provides globals and APIs that do not exist in a standard browser or Node.js environment. Tests must mock these boundaries.

### 4.1 `@decky/api` Mock

```ts
// src/__mocks__/@decky/api.ts
export const definePlugin = vi.fn((factory) => factory);

export const routerHook = {
  addGlobalComponent: vi.fn(),
  removeGlobalComponent: vi.fn(),
};

export const toaster = {
  toast: vi.fn(),
};
```

### 4.2 `@decky/ui` Mock

```ts
// src/__mocks__/@decky/ui.ts
import { vi } from 'vitest';

// Re-export stubs for every component the source code imports.
// These render their children so tests can assert on content.
export const PanelSection = ({ children }: any) => children;
export const PanelSectionRow = ({ children }: any) => children;
export const ButtonItem = ({ children, onClick }: any) => (
  <button onClick={onClick}>{children}</button>
);
export const DropdownItem = vi.fn(() => null);
export const SliderField = vi.fn(() => null);
export const ToggleField = vi.fn(() => null);
export const TextField = vi.fn(({ value, onChange }: any) => (
  <input value={value} onChange={onChange} />
));
export const ConfirmModal = ({ children, onOK, onCancel, ...rest }: any) => (
  <div>{children}</div>
);
export const showModal = vi.fn();
export const findModuleChild = vi.fn(() => vi.fn());
export const quickAccessMenuClasses = { Title: 'title-class' };

export const Router = {
  WindowStore: {
    GamepadUIMainWindowInstance: {
      CreateBrowserView: vi.fn(() => ({
        GetBrowser: vi.fn(() => ({
          SetVisible: vi.fn(),
          SetBounds: vi.fn(),
        })),
        LoadURL: vi.fn(),
        Destroy: vi.fn(),
      })),
    },
  },
};
export const WindowRouter = {};
export const getGamepadNavigationTrees = vi.fn(() => []);
```

### 4.3 `window.SP_REACT` Mock

The `tsconfig.json` uses `"jsxFactory": "window.SP_REACT.createElement"`. In tests, this global must exist:

```ts
// In src/__tests__/setup.ts (append to the setup file above)
import React from 'react';

(globalThis as any).window = globalThis.window ?? globalThis;
(globalThis as any).SP_REACT = React;
```

### 4.4 `cotton-box` / `cotton-box-react`

These are small, well-behaved libraries. Prefer using them **without mocking** in tests — create a real `StateManager` instance and assert against it. This gives higher confidence than stubbing state management.

### 4.5 `localStorage`

Already stubbed in the global setup file (§ 3). Call `localStorage.clear()` in a `beforeEach` to ensure test isolation:

```ts
beforeEach(() => {
  localStorage.clear();
});
```

---

## 5. Test Layers

Portal's tests are organised into three layers. Each layer has a different purpose, speed, and scope.

### 5.1 Unit Tests — Pure Logic

**What:** Functions with no React, no DOM, no side effects.

**Where:** `src/**/*.test.ts`

**Examples:**

| Module                            | Functions to test                                                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `geometry.tsx`                    | `intersectRectangles` — empty input, single rectangle, two overlapping, two non-overlapping, many rectangles, negative coordinates, zero-dimension rectangles |
| `util.tsx`                        | Enum values for `ViewMode` and `Position`, constant values (`SCREEN_WIDTH`, `PICTURE_WIDTH`, etc.)                                                            |
| `localStorage` migration (future) | Migration from `"pip"` key to `"portal"` key                                                                                                                  |

**Sample test — `intersectRectangles`:**

```ts
import { describe, it, expect } from 'vitest';
import { intersectRectangles } from '../geometry';

describe('intersectRectangles', () => {
  it('returns null for an empty array', () => {
    expect(intersectRectangles([])).toBeNull();
  });

  it('returns the same rectangle for a single-element array', () => {
    const rect = { x: 10, y: 20, width: 100, height: 50 };
    expect(intersectRectangles([rect])).toEqual(rect);
  });

  it('computes the overlap of two overlapping rectangles', () => {
    const a = { x: 0, y: 0, width: 100, height: 100 };
    const b = { x: 50, y: 50, width: 100, height: 100 };
    expect(intersectRectangles([a, b])).toEqual({
      x: 50, y: 50, width: 50, height: 50,
    });
  });

  it('returns null when rectangles do not overlap', () => {
    const a = { x: 0, y: 0, width: 50, height: 50 };
    const b = { x: 100, y: 100, width: 50, height: 50 };
    expect(intersectRectangles([a, b])).toBeNull();
  });

  it('returns null when rectangles share only an edge (zero area)', () => {
    const a = { x: 0, y: 0, width: 50, height: 50 };
    const b = { x: 50, y: 0, width: 50, height: 50 };
    expect(intersectRectangles([a, b])).toBeNull();
  });

  it('handles three overlapping rectangles', () => {
    const rects = [
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 25, y: 25, width: 100, height: 100 },
      { x: 50, y: 50, width: 100, height: 100 },
    ];
    expect(intersectRectangles(rects)).toEqual({
      x: 50, y: 50, width: 50, height: 50,
    });
  });
});
```

### 5.2 Component Tests — React Components in Isolation

**What:** Render a single component with mocked dependencies and assert on its output and behaviour.

**Where:** `src/**/*.test.tsx`

**Tools:** `@testing-library/react`, `@testing-library/user-event`

**Examples:**

| Component        | What to test                                                                                                                                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Settings`       | Renders Open button when `viewMode` is `Closed`. Renders address, expand toggle, position dropdown, size slider, margin slider, and Close button when open. Clicking Open updates state to `ViewMode.Picture`. Clicking Close updates state to `ViewMode.Closed`. |
| `UrlModal`       | Renders with current URL pre-filled. Updating the text field and clicking OK writes the new URL to state. Clicking Cancel does not change the URL. Hides browser view on mount, restores on unmount.                                                              |
| `modalWithState` | Wraps a component with `GlobalContext.Provider` and passes the `StateManager` through.                                                                                                                                                                            |

**Pattern:**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StateManager } from 'cotton-box';
import { GlobalContext, State } from '../global-state';
import { Settings } from '../settings';

const renderWithState = (overrides: Partial<State> = {}) => {
  const defaultState: State = {
    viewMode: ViewMode.Closed,
    visible: true,
    position: Position.TopRight,
    margin: 30,
    size: 1,
    url: 'https://example.com',
    ...overrides,
  };
  const manager = new StateManager<State>(defaultState);

  return {
    manager,
    ...render(
      <GlobalContext.Provider value={manager}>
        <Settings />
      </GlobalContext.Provider>,
    ),
  };
};
```

### 5.3 Integration Tests — Multi-Component Flows

**What:** Test larger flows that span multiple components or simulate realistic user journeys.

**Where:** `src/__tests__/integration/`

**Examples:**

| Flow                       | Steps                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Open → Set URL → Close     | Render `Settings` → click Open → click Address → enter URL → confirm → click Close → verify state transitions.                       |
| Position change avoids QAM | Provide mock `getGamepadNavigationTrees` returning a QAM tree → render `Pip` → assert that the computed bounds avoid the QAM region. |
| Persistence round-trip     | Set state → verify `localStorage` is written → re-initialise state from `localStorage` → verify values match.                        |

---

## 6. Testing Conventions

### 6.1 File Naming

- Test files are co-located with their source: `geometry.tsx` → `geometry.test.ts`.
- Integration tests live in `src/__tests__/integration/`.
- Shared test utilities and fixtures live in `src/__tests__/helpers/`.

### 6.2 Test Structure

Follow the Arrange–Act–Assert pattern:

```ts
it('does something', () => {
  // Arrange
  const input = createTestData();

  // Act
  const result = functionUnderTest(input);

  // Assert
  expect(result).toEqual(expected);
});
```

### 6.3 Naming

- `describe` blocks use the module or function name.
- `it` blocks start with a verb: `it('returns null when…')`, `it('renders the Open button')`.

### 6.4 Avoid

- **Snapshot tests** — they tend to bitrot and provide low signal in a UI that changes frequently during an overhaul.
- **Testing implementation details** — assert on behaviour and output, not internal state shapes or private method calls.
- **Large integration tests that replace unit tests** — unit tests should cover edge cases; integration tests cover the happy path and critical flows.

---

## 7. Coverage Targets

Coverage is enforced in CI via the thresholds in `vitest.config.ts`. The initial targets are:

| Metric     | Target | Rationale                                                                          |
| ---------- | ------ | ---------------------------------------------------------------------------------- |
| Statements | 80%    | High enough to catch regressions, low enough to avoid tests-for-the-sake-of-tests. |
| Branches   | 75%    | Branch coverage is harder to achieve in UI code with many conditional renders.     |
| Functions  | 80%    | Every public function should be exercised.                                         |
| Lines      | 80%    | Mirrors statement coverage.                                                        |

These targets apply to **new and modified code**. Legacy code that is about to be refactored may temporarily fall below the threshold — this is acceptable as long as the trend is upward.

> **Open Question:** Should coverage thresholds be enforced as CI *failures* immediately, or start as *warnings* and tighten over the first few sprints?

---

## 8. Scripts Summary

Add the following to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

| Script               | Purpose                                                     |
| -------------------- | ----------------------------------------------------------- |
| `pnpm test`          | Run all tests once (CI, pre-commit).                        |
| `pnpm test:watch`    | Run tests in watch mode during development.                 |
| `pnpm test:coverage` | Run tests and generate a coverage report.                   |
| `pnpm test:ui`       | Open Vitest's browser-based UI for interactive exploration. |

---

## 9. Future Considerations

| Topic                         | Notes                                                                                                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **End-to-end testing**        | Not feasible today — the plugin runs inside Steam's CEF runtime on a Steam Deck. If Decky ever provides a headless test harness or emulator, E2E tests should be added. |
| **Visual regression testing** | Could be introduced later with tools like Playwright's screenshot comparison, but requires a way to render the plugin UI outside the Deck.                              |
| **Performance benchmarks**    | If the PiP window or UI avoidance logic introduces measurable lag, add benchmark tests for critical paths (`intersectRectangles`, bounds computation).                  |
| **Mutation testing**          | Tools like Stryker can verify that tests actually catch bugs. Consider adding in a later phase once baseline coverage is solid.                                         |

---

## 10. Checklist — First Test PR

The first testing PR should accomplish the following:

- [ ] Install all dependencies listed in § 2.
- [ ] Create `vitest.config.ts` per § 3.
- [ ] Create `src/__tests__/setup.ts` per § 3.
- [ ] Create `src/__mocks__/@decky/api.ts` and `src/__mocks__/@decky/ui.ts` per § 4.
- [ ] Add `SP_REACT` global mock to the setup file per § 4.3.
- [ ] Write unit tests for `intersectRectangles` per § 5.1.
- [ ] Write unit tests for `util.tsx` enums and constants.
- [ ] Add `test`, `test:watch`, and `test:coverage` scripts to `package.json`.
- [ ] Add `coverage/` to `.gitignore`.
- [ ] Confirm `pnpm test` passes with zero failures.
- [ ] Confirm `pnpm test:coverage` generates a report meeting initial thresholds.
