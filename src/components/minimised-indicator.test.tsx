import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { MinimisedIndicator } from './minimised-indicator';
import { useGlobalState } from '../hooks/global-state';
import { Position, SCREEN_HEIGHT, SCREEN_WIDTH, ViewMode } from '../lib/util';

vi.mock('../hooks/global-state', () => ({
  useGlobalState: vi.fn(),
}));

vi.mock('react-icons/fa', () => ({
  FaTv: () => <span data-testid="icon-tv" />,
}));

const INDICATOR_SIZE = 48;

const createMockState = (previousViewMode = ViewMode.Picture) => {
  let state = {
    viewMode: ViewMode.Minimised,
    previousViewMode,
    visible: true,
    position: Position.TopRight,
    margin: 20,
    size: 1,
    url: 'https://example.com',
    controlBar: true,
  };

  const setState = vi.fn((updater: (s: typeof state) => typeof state) => {
    state = updater(state);
  });

  return { state, setState, getState: () => state };
};

const fullScreenBounds = (margin: number) => ({
  x: margin,
  y: margin,
  width: SCREEN_WIDTH - margin * 2,
  height: SCREEN_HEIGHT - margin * 2,
});

describe('MinimisedIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with data-testid', () => {
    const { state, setState } = createMockState();
    vi.mocked(useGlobalState).mockReturnValue([state, setState, {}] as never);

    render(<MinimisedIndicator position={Position.TopRight} bounds={fullScreenBounds(20)} />);

    expect(screen.getByTestId('minimised-indicator')).toBeTruthy();
  });

  it('restores to previousViewMode on click', () => {
    const mock = createMockState(ViewMode.Expand);
    vi.mocked(useGlobalState).mockReturnValue([mock.state, mock.setState, {}] as never);

    render(<MinimisedIndicator position={Position.TopRight} bounds={fullScreenBounds(20)} />);

    fireEvent.click(screen.getByTestId('minimised-indicator'));
    expect(mock.getState().viewMode).toBe(ViewMode.Expand);
  });

  it('restores to Picture mode by default', () => {
    const mock = createMockState(ViewMode.Picture);
    vi.mocked(useGlobalState).mockReturnValue([mock.state, mock.setState, {}] as never);

    render(<MinimisedIndicator position={Position.TopLeft} bounds={fullScreenBounds(30)} />);

    fireEvent.click(screen.getByTestId('minimised-indicator'));
    expect(mock.getState().viewMode).toBe(ViewMode.Picture);
  });

  it('positions at TopLeft corner with margin', () => {
    const { state, setState } = createMockState();
    vi.mocked(useGlobalState).mockReturnValue([state, setState, {}] as never);

    render(<MinimisedIndicator position={Position.TopLeft} bounds={fullScreenBounds(30)} />);

    const el = screen.getByTestId('minimised-indicator');
    expect(el.style.left).toBe('30px');
    expect(el.style.top).toBe('30px');
  });

  it('positions at BottomRight corner', () => {
    const { state, setState } = createMockState();
    vi.mocked(useGlobalState).mockReturnValue([state, setState, {}] as never);

    render(<MinimisedIndicator position={Position.BottomRight} bounds={fullScreenBounds(20)} />);

    const el = screen.getByTestId('minimised-indicator');
    expect(el.style.left).toBe(`${SCREEN_WIDTH - INDICATOR_SIZE - 20}px`);
    expect(el.style.top).toBe(`${SCREEN_HEIGHT - INDICATOR_SIZE - 20}px`);
  });

  it('positions at Top center', () => {
    const { state, setState } = createMockState();
    vi.mocked(useGlobalState).mockReturnValue([state, setState, {}] as never);

    render(<MinimisedIndicator position={Position.Top} bounds={fullScreenBounds(20)} />);

    const el = screen.getByTestId('minimised-indicator');
    expect(el.style.left).toBe(`${(SCREEN_WIDTH - INDICATOR_SIZE) / 2}px`);
    expect(el.style.top).toBe('20px');
  });

  it('adjusts position when QAM reduces available width', () => {
    const { state, setState } = createMockState();
    vi.mocked(useGlobalState).mockReturnValue([state, setState, {}] as never);

    const qamBounds = { x: 20, y: 20, width: 534, height: SCREEN_HEIGHT - 40 };

    render(<MinimisedIndicator position={Position.TopRight} bounds={qamBounds} />);

    const el = screen.getByTestId('minimised-indicator');
    expect(el.style.left).toBe(`${20 + 534 - INDICATOR_SIZE}px`);
    expect(el.style.top).toBe('20px');
  });
});
