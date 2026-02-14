import { vi } from 'vitest';

export const createSteamBrowserViewMock = () => ({
  GetBrowser: vi.fn(() => ({
    SetVisible: vi.fn(),
    SetBounds: vi.fn(),
  })),
  LoadURL: vi.fn(),
  Destroy: vi.fn(),
});
