import { Router, WindowRouter, getGamepadNavigationTrees } from '@decky/ui';
import { useEffect, useState } from 'react';

import { useGlobalState } from '../hooks/global-state';
import { intersectRectangles } from '../lib/geometry';
import { UIComposition, useUIComposition } from '../hooks/use-ui-composition';
import {
  PICTURE_HEIGHT,
  PICTURE_WIDTH,
  Position,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  ViewMode,
} from '../lib/util';

interface BrowserProps {
  url: string;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BrowserHandle {
  SetVisible(visible: boolean): void;
  SetBounds(x: number, y: number, width: number, height: number): void;
}

interface BrowserViewHandle {
  GetBrowser(): BrowserHandle;
  LoadURL(url: string): void;
  Destroy(): void;
}

interface MainWindowInstance {
  CreateBrowserView(name: string): BrowserViewHandle;
}

interface NavTree {
  id?: string;
  m_Root?: {
    m_element?: {
      ownerDocument?: {
        defaultView?: DeckWindow | null;
      };
    };
  };
}

interface DeckWindow {
  document: {
    hidden: boolean;
  };
  screenLeft?: number;
  screenTop?: number;
  outerWidth?: number;
  outerHeight?: number;
}

const Browser = ({ url, visible, x, y, width, height }: BrowserProps) => {
  useUIComposition(UIComposition.Notification);

  const [handles] = useState<{ browser: BrowserHandle; view: BrowserViewHandle } | null>(() => {
    const root = Router.WindowStore?.GamepadUIMainWindowInstance as
      | (WindowRouter & MainWindowInstance)
      | undefined;
    if (!root) {
      return null;
    }

    const view = root.CreateBrowserView('portal');
    const browser = view.GetBrowser();

    (window as unknown as { portal?: BrowserViewHandle }).portal = view;

    return {
      view,
      browser,
    };
  });

  useEffect(() => {
    handles?.browser.SetVisible(visible);
  }, [handles, visible]);

  useEffect(() => {
    handles?.view.LoadURL(url);
  }, [url, handles]);

  useEffect(() => {
    handles?.browser.SetBounds(x, y, width, height);
  }, [handles, x, y, width, height]);

  useEffect(() => {
    return () => handles?.view.Destroy();
  }, [handles]);

  return null;
};

const getBounds = (windowView?: DeckWindow | null) => {
  return {
    x: windowView?.screenLeft ?? 0,
    y: windowView?.screenTop ?? 0,
    width: windowView?.outerWidth ?? 0,
    height: windowView?.outerHeight ?? 0,
  };
};

const getOwnerWindow = (trees: NavTree[], id: string) => {
  return (
    trees.find((tree) => tree.id === id)?.m_Root?.m_element?.ownerDocument?.defaultView ?? null
  );
};

const getDeckComponentBounds = () => {
  const trees = getGamepadNavigationTrees() as NavTree[];

  const nav = getOwnerWindow(trees, 'MainNavMenuContainer');
  const navHidden = nav?.document.hidden ?? true;
  const navBounds = navHidden ? null : getBounds(nav);

  const qam = getOwnerWindow(trees, 'QuickAccess-NA');
  const qamHidden = qam?.document.hidden ?? true;
  const qamBounds = qamHidden ? null : getBounds(qam);

  const virtualKeyboard = getOwnerWindow(trees, 'virtual keyboard');
  const virtualKeyboardHidden = !virtualKeyboard;
  // this is a guess, gotta figure out how to inspect to keyboard DOM
  const virtualKeyboardBounds = virtualKeyboardHidden
    ? null
    : {
        x: 0,
        y: SCREEN_HEIGHT - 240,
        width: SCREEN_WIDTH,
        height: 240,
      };

  return {
    nav: navBounds,
    qam: qamBounds,
    virtualKeyboard: virtualKeyboardBounds,
  };
};

const areRectanglesEqual = (
  first: { x: number; y: number; width: number; height: number } | null,
  second: { x: number; y: number; width: number; height: number } | null,
) => {
  if (!first && !second) {
    return true;
  }

  if (!first || !second) {
    return false;
  }

  return (
    first.x === second.x &&
    first.y === second.y &&
    first.width === second.width &&
    first.height === second.height
  );
};

const areDeckComponentBoundsEqual = (
  first: ReturnType<typeof getDeckComponentBounds>,
  second: ReturnType<typeof getDeckComponentBounds>,
) => {
  return (
    areRectanglesEqual(first.nav, second.nav) &&
    areRectanglesEqual(first.qam, second.qam) &&
    areRectanglesEqual(first.virtualKeyboard, second.virtualKeyboard)
  );
};

const useDeckComponentBounds = () => {
  const [state, setState] = useState(getDeckComponentBounds());

  useEffect(() => {
    const interval = setInterval(() => {
      setState((current) => {
        const next = getDeckComponentBounds();
        return areDeckComponentBoundsEqual(next, current) ? current : next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return state;
};

export const PortalView = () => {
  const { nav, qam, virtualKeyboard } = useDeckComponentBounds();
  const [{ viewMode, position, size, url, visible, ...settings }] = useGlobalState();

  const pictureWidth = PICTURE_WIDTH * size;
  const pictureHeight = PICTURE_HEIGHT * size;

  const availableBounds = [
    {
      x: 0,
      y: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    },
  ];

  if (nav) {
    availableBounds.push({
      x: nav.width,
      y: 0,
      width: SCREEN_WIDTH - nav.width,
      height: SCREEN_HEIGHT,
    });
  }

  if (qam) {
    availableBounds.push({
      x: 0,
      y: 0,
      width: SCREEN_WIDTH - qam.width,
      height: SCREEN_HEIGHT,
    });
  }

  if (virtualKeyboard) {
    availableBounds.push({
      x: 0,
      y: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT - virtualKeyboard.height,
    });
  }

  const bounds = intersectRectangles(availableBounds) ?? {
    x: 0,
    y: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  };

  const margin = viewMode === ViewMode.Expand ? 30 : settings.margin;

  bounds.x += margin;
  bounds.y += margin;
  bounds.width -= margin * 2;
  bounds.height -= margin * 2;

  switch (viewMode) {
    case ViewMode.Expand:
      {
        // do nothing, screen is calculated initially to fullscreen
      }
      break;

    case ViewMode.Picture:
      {
        switch (position) {
          case Position.Top:
            {
              bounds.x += bounds.width / 2 - pictureWidth / 2;
            }
            break;
          case Position.TopRight:
            {
              bounds.x += bounds.width - pictureWidth;
            }
            break;
          case Position.Right:
            {
              bounds.x += bounds.width - pictureWidth;
              bounds.y += bounds.height / 2 - pictureHeight / 2;
            }
            break;
          case Position.BottomRight:
            {
              bounds.x += bounds.width - pictureWidth;
              bounds.y += bounds.height - pictureHeight;
            }
            break;
          case Position.Bottom:
            {
              bounds.x += bounds.width / 2 - pictureWidth / 2;
              bounds.y += bounds.height - pictureHeight;
            }
            break;
          case Position.BottomLeft:
            {
              bounds.y += bounds.height - pictureHeight;
            }
            break;
          case Position.Left:
            {
              bounds.y += bounds.height / 2 - pictureHeight / 2;
            }
            break;
          case Position.TopLeft:
            {
              // do nothing, screen is calculated initially to top left
            }
            break;
        }

        bounds.width = pictureWidth;
        bounds.height = pictureHeight;
      }
      break;
  }

  return <Browser url={url} visible={visible} {...bounds} />;
};

export const PortalViewOuter = () => {
  const [{ viewMode }] = useGlobalState();

  if (viewMode === ViewMode.Closed) {
    return null;
  }

  return <PortalView />;
};
