import { vi } from 'vitest';

export const definePlugin = vi.fn((factory: unknown) => factory);

export const routerHook = {
  addGlobalComponent: vi.fn(),
  removeGlobalComponent: vi.fn(),
};

export const toaster = {
  toast: vi.fn(),
};
