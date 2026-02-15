import { FaCompress, FaExpand, FaSearchPlus, FaTimes, FaWindowMinimize } from 'react-icons/fa';

import { useGlobalState } from '../hooks/global-state';
import { ViewMode } from '../lib/util';

const SIZE_STEPS = [0.7, 1.0, 1.3];

interface ControlBarProps {
  x: number;
  y: number;
  height: number;
  side: 'left' | 'right';
  viewMode: ViewMode;
}

export const BAR_WIDTH = 48;
const BUTTON_SIZE = 44;

export const ControlBar = ({ x, y, height, side: _side, viewMode }: ControlBarProps) => {
  const [{ size }, setState] = useGlobalState();

  const toggleExpand = () => {
    setState((s) => ({
      ...s,
      viewMode: viewMode === ViewMode.Expand ? ViewMode.Picture : ViewMode.Expand,
    }));
  };

  const minimise = () => {
    setState((s) => ({
      ...s,
      viewMode: ViewMode.Closed,
    }));
  };

  const close = () => {
    setState((s) => ({
      ...s,
      viewMode: ViewMode.Closed,
      visible: false,
    }));
  };

  const cycleSize = () => {
    const currentIndex = SIZE_STEPS.indexOf(size);
    const nextIndex = (currentIndex + 1) % SIZE_STEPS.length;
    setState((s) => ({
      ...s,
      size: SIZE_STEPS[nextIndex],
    }));
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    width: BUTTON_SIZE,
    minHeight: BUTTON_SIZE,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  };

  return (
    <div
      data-testid="control-bar"
      style={{
        position: 'absolute',
        zIndex: 7001,
        left: x,
        top: y,
        width: BAR_WIDTH,
        height,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        data-testid="control-bar-backdrop"
        style={{
          background: 'rgba(40, 40, 40, 0.6)',
          borderRadius: BAR_WIDTH / 2,
          flex: '0 1 auto',
          minHeight: 0,
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          padding: `${BAR_WIDTH / 2}px 0`,
        }}
      >
        {viewMode === ViewMode.Picture && (
          <button aria-label="Cycle Size" style={buttonStyle} onClick={cycleSize}>
            <FaSearchPlus />
          </button>
        )}
        <button aria-label="Expand" style={buttonStyle} onClick={toggleExpand}>
          {viewMode === ViewMode.Picture ? <FaExpand /> : <FaCompress />}
        </button>
        <button aria-label="Minimise" style={buttonStyle} onClick={minimise}>
          <FaWindowMinimize />
        </button>
        <button aria-label="Close" style={buttonStyle} onClick={close}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};
