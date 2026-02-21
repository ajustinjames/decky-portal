import { FaTv } from 'react-icons/fa';

import { useGlobalState } from '../hooks/global-state';
import { Position, ViewMode } from '../lib/util';

const INDICATOR_SIZE = 48;

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MinimisedIndicatorProps {
  position: Position;
  bounds: Bounds;
}

const getIndicatorPosition = (position: Position, bounds: Bounds) => {
  const farX = bounds.x + bounds.width - INDICATOR_SIZE;
  const farY = bounds.y + bounds.height - INDICATOR_SIZE;
  const centerX = bounds.x + (bounds.width - INDICATOR_SIZE) / 2;
  const centerY = bounds.y + (bounds.height - INDICATOR_SIZE) / 2;

  switch (position) {
    case Position.TopLeft:
      return { left: bounds.x, top: bounds.y };
    case Position.Top:
      return { left: centerX, top: bounds.y };
    case Position.TopRight:
      return { left: farX, top: bounds.y };
    case Position.Right:
      return { left: farX, top: centerY };
    case Position.BottomRight:
      return { left: farX, top: farY };
    case Position.Bottom:
      return { left: centerX, top: farY };
    case Position.BottomLeft:
      return { left: bounds.x, top: farY };
    case Position.Left:
      return { left: bounds.x, top: centerY };
  }
};

export const MinimisedIndicator = ({ position, bounds }: MinimisedIndicatorProps) => {
  const [, setState] = useGlobalState();

  const restore = () => {
    setState((s) => ({
      ...s,
      viewMode:
        s.previousViewMode === ViewMode.Minimised || s.previousViewMode === ViewMode.Closed
          ? ViewMode.Picture
          : s.previousViewMode,
    }));
  };

  const { left, top } = getIndicatorPosition(position, bounds);

  return (
    <button
      data-testid="minimised-indicator"
      onClick={restore}
      style={{
        position: 'absolute',
        zIndex: 7001,
        left,
        top,
        width: INDICATOR_SIZE,
        height: INDICATOR_SIZE,
        borderRadius: INDICATOR_SIZE / 2,
        background: 'rgba(40, 40, 40, 0.6)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      <FaTv />
    </button>
  );
};
