import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { ControlBar } from './control-bar';
import { useGlobalState } from '../hooks/global-state';
import { ViewMode } from '../lib/util';

vi.mock('../hooks/global-state', () => ({
  useGlobalState: vi.fn(),
}));

vi.mock('react-icons/fa', () => ({
  FaExpand: () => <span data-testid="icon-expand" />,
  FaCompress: () => <span data-testid="icon-compress" />,
  FaSearchPlus: () => <span data-testid="icon-search-plus" />,
  FaTimes: () => <span data-testid="icon-times" />,
  FaWindowMinimize: () => <span data-testid="icon-minimize" />,
}));

const createMockState = (viewMode: ViewMode, size = 1.0) => {
  let state = {
    viewMode,
    visible: true,
    position: 1,
    margin: 20,
    size,
    url: 'https://example.com',
  };

  const setState = vi.fn((updater: (s: typeof state) => typeof state) => {
    state = updater(state);
  });

  return { state, setState, getState: () => state };
};

describe('ControlBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders in Picture mode', () => {
    const { state, setState } = createMockState(ViewMode.Picture);
    vi.mocked(useGlobalState).mockReturnValue([state, setState, {}] as never);

    render(
      <ControlBar x={100} y={200} height={300} side="right" viewMode={ViewMode.Picture} />,
    );

    expect(screen.getByTestId('control-bar')).toBeTruthy();
  });

  it('renders in Expand mode', () => {
    const { state, setState } = createMockState(ViewMode.Expand);
    vi.mocked(useGlobalState).mockReturnValue([state, setState, {}] as never);

    render(
      <ControlBar x={0} y={30} height={474} side="right" viewMode={ViewMode.Expand} />,
    );

    expect(screen.getByTestId('control-bar')).toBeTruthy();
  });

  it('shows Cycle Size button only in Picture mode', () => {
    const { state, setState } = createMockState(ViewMode.Picture);
    vi.mocked(useGlobalState).mockReturnValue([state, setState, {}] as never);

    const { rerender } = render(
      <ControlBar x={0} y={100} height={300} side="right" viewMode={ViewMode.Picture} />,
    );

    expect(screen.getByLabelText('Cycle Size')).toBeTruthy();

    const expandState = createMockState(ViewMode.Expand);
    vi.mocked(useGlobalState).mockReturnValue([
      expandState.state,
      expandState.setState,
      {},
    ] as never);

    rerender(
      <ControlBar x={0} y={100} height={300} side="right" viewMode={ViewMode.Expand} />,
    );

    expect(screen.queryByLabelText('Cycle Size')).toBeNull();
  });

  it('shows FaExpand icon in Picture mode and FaCompress in Expand mode', () => {
    const { state, setState } = createMockState(ViewMode.Picture);
    vi.mocked(useGlobalState).mockReturnValue([state, setState, {}] as never);

    const { rerender } = render(
      <ControlBar x={0} y={100} height={300} side="right" viewMode={ViewMode.Picture} />,
    );

    expect(screen.getByTestId('icon-expand')).toBeTruthy();
    expect(screen.queryByTestId('icon-compress')).toBeNull();

    const expandState = createMockState(ViewMode.Expand);
    vi.mocked(useGlobalState).mockReturnValue([
      expandState.state,
      expandState.setState,
      {},
    ] as never);

    rerender(
      <ControlBar x={0} y={100} height={300} side="right" viewMode={ViewMode.Expand} />,
    );

    expect(screen.getByTestId('icon-compress')).toBeTruthy();
    expect(screen.queryByTestId('icon-expand')).toBeNull();
  });

  it('toggles viewMode when clicking Expand/Restore button', () => {
    const mock = createMockState(ViewMode.Picture);
    vi.mocked(useGlobalState).mockReturnValue([mock.state, mock.setState, {}] as never);

    render(
      <ControlBar x={0} y={100} height={300} side="right" viewMode={ViewMode.Picture} />,
    );

    fireEvent.click(screen.getByLabelText('Expand'));
    expect(mock.setState).toHaveBeenCalledTimes(1);
    expect(mock.getState().viewMode).toBe(ViewMode.Expand);
  });

  it('toggles viewMode back to Picture when clicking Expand in Expand mode', () => {
    const mock = createMockState(ViewMode.Expand);
    vi.mocked(useGlobalState).mockReturnValue([mock.state, mock.setState, {}] as never);

    render(
      <ControlBar x={0} y={100} height={300} side="right" viewMode={ViewMode.Expand} />,
    );

    fireEvent.click(screen.getByLabelText('Expand'));
    expect(mock.getState().viewMode).toBe(ViewMode.Picture);
  });

  it('sets viewMode to Closed when clicking Minimise', () => {
    const mock = createMockState(ViewMode.Picture);
    vi.mocked(useGlobalState).mockReturnValue([mock.state, mock.setState, {}] as never);

    render(
      <ControlBar x={0} y={100} height={300} side="right" viewMode={ViewMode.Picture} />,
    );

    fireEvent.click(screen.getByLabelText('Minimise'));
    expect(mock.getState().viewMode).toBe(ViewMode.Closed);
    expect(mock.getState().visible).toBe(true);
  });

  it('sets viewMode to Closed and visible to false when clicking Close', () => {
    const mock = createMockState(ViewMode.Picture);
    vi.mocked(useGlobalState).mockReturnValue([mock.state, mock.setState, {}] as never);

    render(
      <ControlBar x={0} y={100} height={300} side="right" viewMode={ViewMode.Picture} />,
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(mock.getState().viewMode).toBe(ViewMode.Closed);
    expect(mock.getState().visible).toBe(false);
  });

  it.each([
    [0.7, 1.0],
    [1.0, 1.3],
    [1.3, 0.7],
  ])('cycles size from %s to %s', (currentSize, expectedSize) => {
    const mock = createMockState(ViewMode.Picture, currentSize);
    vi.mocked(useGlobalState).mockReturnValue([mock.state, mock.setState, {}] as never);

    render(
      <ControlBar x={0} y={100} height={300} side="right" viewMode={ViewMode.Picture} />,
    );

    fireEvent.click(screen.getByLabelText('Cycle Size'));
    expect(mock.getState().size).toBe(expectedSize);
  });

  it('applies correct positioning styles from props', () => {
    const { state, setState } = createMockState(ViewMode.Picture);
    vi.mocked(useGlobalState).mockReturnValue([state, setState, {}] as never);

    render(
      <ControlBar x={150} y={250} height={400} side="left" viewMode={ViewMode.Picture} />,
    );

    const bar = screen.getByTestId('control-bar');
    expect(bar.style.left).toBe('150px');
    expect(bar.style.top).toBe('250px');
    expect(bar.style.width).toBe('48px');
    expect(bar.style.height).toBe('400px');

    const backdrop = screen.getByTestId('control-bar-backdrop');
    expect(backdrop.style.flexDirection).toBe('column');
  });
});
