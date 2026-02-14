import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';
import { Router } from '@decky/ui';

import { PortalView, PortalViewOuter } from './portal-view';
import { useGlobalState } from '../hooks/global-state';
import { Position, ViewMode } from '../lib/util';

const getGamepadNavigationTrees = vi.fn();
const createBrowserView = vi.fn();
const setVisible = vi.fn();
const setBounds = vi.fn();
const loadURL = vi.fn();
const destroy = vi.fn();
const useUIComposition = vi.fn();

vi.mock('../hooks/global-state', () => ({
  useGlobalState: vi.fn(),
}));

vi.mock('../hooks/use-ui-composition', () => ({
  UIComposition: {
    Notification: 1,
  },
  useUIComposition: (...args: unknown[]) => useUIComposition(...args),
}));

vi.mock('@decky/ui', () => ({
  Router: {
    WindowStore: {
      GamepadUIMainWindowInstance: {
        CreateBrowserView: (...args: unknown[]) => createBrowserView(...args),
      },
    },
  },
  WindowRouter: {},
  getGamepadNavigationTrees: (...args: unknown[]) => getGamepadNavigationTrees(...args),
}));

const createState = (viewMode: ViewMode, position = Position.TopRight, margin = 20) => ({
  viewMode,
  visible: true,
  position,
  margin,
  size: 1,
  url: 'https://netflix.com',
});

describe('PortalView and PortalViewOuter', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    createBrowserView.mockReturnValue({
      GetBrowser: () => ({
        SetVisible: setVisible,
        SetBounds: setBounds,
      }),
      LoadURL: loadURL,
      Destroy: destroy,
    });

    getGamepadNavigationTrees.mockReturnValue([]);
  });

  it('returns null from outer component when closed', () => {
    vi.mocked(useGlobalState).mockReturnValue([createState(ViewMode.Closed)] as never);

    const { container } = render(<PortalViewOuter />);

    expect(container).toBeEmptyDOMElement();
    expect(createBrowserView).not.toHaveBeenCalled();
  });

  it('renders portal view from outer component when open', () => {
    vi.mocked(useGlobalState).mockReturnValue([createState(ViewMode.Picture)] as never);

    render(<PortalViewOuter />);

    expect(createBrowserView).toHaveBeenCalledTimes(1);
  });

  it('throws when decky main window instance is unavailable', () => {
    vi.mocked(useGlobalState).mockReturnValue([createState(ViewMode.Picture)] as never);

    const errorSpy = vi.spyOn(globalThis.console, 'error').mockImplementation(() => {});
    const original = Router.WindowStore!.GamepadUIMainWindowInstance;
    Router.WindowStore!.GamepadUIMainWindowInstance = undefined as never;

    try {
      expect(() => render(<PortalView />)).toThrow('Unable to access Decky main window instance');
    } finally {
      Router.WindowStore!.GamepadUIMainWindowInstance = original;
      errorSpy.mockRestore();
    }
  });

  it('creates browser view and updates visibility, url, and bounds in picture mode', async () => {
    vi.mocked(useGlobalState).mockReturnValue([
      createState(ViewMode.Picture, Position.TopRight, 20),
    ] as never);

    const { unmount } = render(<PortalView />);

    await waitFor(() => {
      expect(setVisible).toHaveBeenCalledWith(true);
      expect(loadURL).toHaveBeenCalledWith('https://netflix.com');
      expect(setBounds).toHaveBeenCalled();
    });

    const [x, y, width, height] = setBounds.mock.calls[setBounds.mock.calls.length - 1];
    expect(x).toBeCloseTo(492.4, 3);
    expect(y).toBeCloseTo(20, 3);
    expect(width).toBeCloseTo(341.6, 3);
    expect(height).toBeCloseTo(184.6486, 3);

    unmount();
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(useUIComposition).toHaveBeenCalledWith(1);
  });

  it('uses expanded layout margin and deck component bounds intersection', async () => {
    getGamepadNavigationTrees.mockReturnValue([
      {
        id: 'MainNavMenuContainer',
        m_Root: {
          m_element: {
            ownerDocument: {
              defaultView: {
                document: { hidden: false },
                screenLeft: 0,
                screenTop: 0,
                outerWidth: 100,
                outerHeight: 534,
              },
            },
          },
        },
      },
      {
        id: 'QuickAccess-NA',
        m_Root: {
          m_element: {
            ownerDocument: {
              defaultView: {
                document: { hidden: false },
                screenLeft: 0,
                screenTop: 0,
                outerWidth: 200,
                outerHeight: 534,
              },
            },
          },
        },
      },
      {
        id: 'virtual keyboard',
        m_Root: {
          m_element: {
            ownerDocument: {
              defaultView: {
                document: { hidden: false },
              },
            },
          },
        },
      },
    ]);

    vi.mocked(useGlobalState).mockReturnValue([
      createState(ViewMode.Expand, Position.BottomRight, 10),
    ] as never);

    render(<PortalView />);

    await waitFor(() => {
      expect(setBounds).toHaveBeenCalled();
    });

    const [x, y, width, height] = setBounds.mock.calls[setBounds.mock.calls.length - 1];
    expect(x).toBe(130);
    expect(y).toBe(30);
    expect(width).toBe(494);
    expect(height).toBe(234);
  });

  it.each([
    [Position.Top, 256.2, 20],
    [Position.TopRight, 492.4, 20],
    [Position.Right, 492.4, 174.6757],
    [Position.BottomRight, 492.4, 329.3514],
    [Position.Bottom, 256.2, 329.3514],
    [Position.BottomLeft, 20, 329.3514],
    [Position.Left, 20, 174.6757],
    [Position.TopLeft, 20, 20],
  ])('places picture mode correctly for position %s', async (position, expectedX, expectedY) => {
    vi.mocked(useGlobalState).mockReturnValue([
      createState(ViewMode.Picture, position as Position, 20),
    ] as never);

    render(<PortalView />);

    await waitFor(() => {
      expect(setBounds).toHaveBeenCalled();
    });

    const [x, y, width, height] = setBounds.mock.calls[setBounds.mock.calls.length - 1];
    expect(x).toBeCloseTo(expectedX, 3);
    expect(y).toBeCloseTo(expectedY, 3);
    expect(width).toBeCloseTo(341.6, 3);
    expect(height).toBeCloseTo(184.6486, 3);
  });

  it('updates deck component bounds only when interval polling detects changes', async () => {
    vi.useFakeTimers();

    let callCount = 0;
    getGamepadNavigationTrees.mockImplementation(() => {
      callCount += 1;

      if (callCount < 3) {
        return [];
      }

      return [
        {
          id: 'QuickAccess-NA',
          m_Root: {
            m_element: {
              ownerDocument: {
                defaultView: {
                  document: { hidden: false },
                  screenLeft: 0,
                  screenTop: 0,
                  outerWidth: 200,
                  outerHeight: 534,
                },
              },
            },
          },
        },
      ];
    });

    vi.mocked(useGlobalState).mockReturnValue([createState(ViewMode.Picture)] as never);

    try {
      render(<PortalView />);

      expect(setBounds).toHaveBeenCalled();
      const initialCalls = setBounds.mock.calls.length;

      act(() => {
        vi.advanceTimersByTime(250);
      });
      expect(setBounds).toHaveBeenCalledTimes(initialCalls);

      act(() => {
        vi.advanceTimersByTime(250);
      });
      expect(setBounds.mock.calls.length).toBeGreaterThan(initialCalls);
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps same bounds when polling returns equal non-null rectangles', () => {
    vi.useFakeTimers();

    getGamepadNavigationTrees.mockReturnValue([
      {
        id: 'QuickAccess-NA',
        m_Root: {
          m_element: {
            ownerDocument: {
              defaultView: {
                document: { hidden: false },
                screenLeft: 0,
                screenTop: 0,
                outerWidth: 200,
                outerHeight: 534,
              },
            },
          },
        },
      },
    ]);

    vi.mocked(useGlobalState).mockReturnValue([createState(ViewMode.Picture)] as never);

    try {
      render(<PortalView />);

      const initialCalls = setBounds.mock.calls.length;

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(setBounds).toHaveBeenCalledTimes(initialCalls);
    } finally {
      vi.useRealTimers();
    }
  });
});
