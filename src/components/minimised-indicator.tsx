import { FaTv } from 'react-icons/fa';

import { useGlobalState } from '../hooks/global-state';
import { Position, SCREEN_HEIGHT, SCREEN_WIDTH } from '../lib/util';

const INDICATOR_SIZE = 48;

interface MinimisedIndicatorProps {
  position: Position;
  margin: number;
}

const getIndicatorPosition = (position: Position, margin: number) => {
  const farX = SCREEN_WIDTH - INDICATOR_SIZE - margin;
  const farY = SCREEN_HEIGHT - INDICATOR_SIZE - margin;
  const centerX = (SCREEN_WIDTH - INDICATOR_SIZE) / 2;
  const centerY = (SCREEN_HEIGHT - INDICATOR_SIZE) / 2;

  switch (position) {
    case Position.TopLeft:
      return { left: margin, top: margin };
    case Position.Top:
      return { left: centerX, top: margin };
    case Position.TopRight:
      return { left: farX, top: margin };
    case Position.Right:
      return { left: farX, top: centerY };
    case Position.BottomRight:
      return { left: farX, top: farY };
    case Position.Bottom:
      return { left: centerX, top: farY };
    case Position.BottomLeft:
      return { left: margin, top: farY };
    case Position.Left:
      return { left: margin, top: centerY };
  }
};

export const MinimisedIndicator = ({ position, margin }: MinimisedIndicatorProps) => {
  const [, setState] = useGlobalState();

  const restore = () => {
    setState((s) => ({
      ...s,
      viewMode: s.previousViewMode,
    }));
  };

  const { left, top } = getIndicatorPosition(position, margin);

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
