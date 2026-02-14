import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { StateManager } from 'cotton-box';

vi.mock('@decky/ui', () => ({
  quickAccessMenuClasses: {
    Title: 'title',
  },
}));

vi.mock('./components/pip', () => ({
  PipOuter: () => <div>Pip Outer</div>,
}));

vi.mock('./components/settings', () => ({
  Settings: () => <div>Settings</div>,
}));

vi.mock('./lib/storage', () => ({
  PORTAL_STORAGE_KEY: 'decky.portal.test',
  getPersistedPortalState: vi.fn(() => ({
    margin: 15,
    size: 1.2,
    url: 'https://youtube.com',
  })),
}));

describe('plugin entrypoint', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('registers and deregisters global components', async () => {
    const { default: plugin } = await import('./index');
    const { routerHook } = await import('@decky/api');

    expect(plugin.name).toBe('Portal');
    expect(routerHook.addGlobalComponent).toHaveBeenCalledWith('Portal', expect.any(Function));

    plugin.onDismount();

    expect(routerHook.removeGlobalComponent).toHaveBeenCalledWith('Portal');
  });

  it('persists watched state values', async () => {
    await import('./index');
    const { routerHook } = await import('@decky/api');
    const { PORTAL_STORAGE_KEY } = await import('./lib/storage');

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    const globalComponentFactory = vi.mocked(routerHook.addGlobalComponent).mock.calls[0][1] as
      | (() => React.ReactElement)
      | undefined;

    expect(globalComponentFactory).toBeDefined();

    const provider = globalComponentFactory!();
    const stateManager = provider.props.value as StateManager<any>;

    stateManager.set({
      viewMode: 2,
      visible: true,
      position: 3,
      margin: 45,
      size: 1.3,
      url: 'https://example.com',
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      PORTAL_STORAGE_KEY,
      JSON.stringify({
        position: 3,
        margin: 45,
        size: 1.3,
        url: 'https://example.com',
      }),
    );
  });
});
