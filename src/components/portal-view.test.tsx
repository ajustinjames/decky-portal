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

vi.mock('./minimised-indicator', () => ({
  MinimisedIndicator: ({ position, margin }: { position: number; margin: number }) => (
    <div data-testid="minimised-indicator" data-position={position} data-margin={margin} />
  ),
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
  previousViewMode: ViewMode.Picture,
  visible: true,
  position,
  margin,
  size: 1,
  url: 'https://netflix.com',
});

// BAR_WIDTH = 48
// PICTURE_WIDTH = 854 * 0.4 = 341.6
// PICTURE_HEIGHT = 341.6 / 1.85 ≈ 184.6486
// browserWidth in picture mode = 341.6 - 48 = 293.6

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

  it('creates browser view when minimised (keeps it alive) and renders indicator', () => {
    vi.mocked(useGlobalState).mockReturnValue([createState(ViewMode.Minimised)] as never);

    const { container } = render(<PortalViewOuter />);

    expect(createBrowserView).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[data-testid="minimised-indicator"]')).toBeTruthy();
  });

  it('sets bounds to 0x0 and hides browser when minimised', async () => {
    vi.mocked(useGlobalState).mockReturnValue([createState(ViewMode.Minimised)] as never);

    render(<PortalView />);

    await waitFor(() => {
      expect(setBounds).toHaveBeenCalled();
    });

    const [x, y, width, height] = setBounds.mock.calls[setBounds.mock.calls.length - 1];
    expect(x).toBe(0);
    expect(y).toBe(0);
    expect(width).toBe(0);
    expect(height).toBe(0);
    expect(setVisible).toHaveBeenCalledWith(false);
  });

  it('renders gracefully when decky main window instance is unavailable', () => {
    vi.mocked(useGlobalState).mockReturnValue([createState(ViewMode.Picture)] as never);

    const original = Router.WindowStore!.GamepadUIMainWindowInstance;
    Router.WindowStore!.GamepadUIMainWindowInstance = undefined as never;

    try {
      const { container } = render(<PortalView />);
      expect(container.querySelector('[data-testid="control-bar"]')).toBeTruthy();
      expect(createBrowserView).not.toHaveBeenCalled();
    } finally {
      Router.WindowStore!.GamepadUIMainWindowInstance = original;
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

    // TopRight → bar on left, browserX = bounds.x + 48
    const [x, y, width, height] = setBounds.mock.calls[setBounds.mock.calls.length - 1];
    expect(x).toBeCloseTo(540.4, 3);
    expect(y).toBeCloseTo(20, 3);
    expect(width).toBeCloseTo(293.6, 3);
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

    // Expand mode → bar on right, browserX = bounds.x, browserWidth = 494 - 48 = 446
    const [x, y, width, height] = setBounds.mock.calls[setBounds.mock.calls.length - 1];
    expect(x).toBe(130);
    expect(y).toBe(30);
    expect(width).toBe(446);
    expect(height).toBe(234);
  });

  it.each([
    // bar on right: browserX = bounds.x, browserWidth = 293.6
    // bar on left: browserX = bounds.x + 48, browserWidth = 293.6
    [Position.Top, 256.2, 20],          // bar right
    [Position.TopRight, 540.4, 20],     // bar left: 492.4 + 48
    [Position.Right, 540.4, 174.6757],  // bar left: 492.4 + 48
    [Position.BottomRight, 540.4, 329.3514], // bar left: 492.4 + 48
    [Position.Bottom, 256.2, 329.3514], // bar right
    [Position.BottomLeft, 20, 329.3514], // bar right
    [Position.Left, 20, 174.6757],      // bar right
    [Position.TopLeft, 20, 20],         // bar right
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
    expect(width).toBeCloseTo(293.6, 3);
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
