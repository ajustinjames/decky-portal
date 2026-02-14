import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StateManager } from 'cotton-box';

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');

  return {
    ...actual,
    useContext: vi.fn(),
  };
});

vi.mock('cotton-box-react', () => ({
  useStateValue: vi.fn(),
}));

import { useContext } from 'react';
import { useStateValue } from 'cotton-box-react';
import { GlobalContext, State, useGlobalState } from './globalState';
import { Position, ViewMode } from './util';

const createInitialState = (): State => ({
  viewMode: ViewMode.Closed,
  visible: true,
  position: Position.TopRight,
  margin: 30,
  size: 1,
  url: 'https://netflix.com',
});

describe('globalState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads the initial state from context', () => {
    const stateManager = new StateManager<State>(createInitialState());
    vi.mocked(useContext).mockReturnValue(stateManager as never);
    vi.mocked(useStateValue).mockReturnValue(stateManager.get());

    const [state, setState, context] = useGlobalState();

    expect(state).toEqual(createInitialState());
    expect(typeof setState).toBe('function');
    expect(context).toBe(stateManager);
    expect(useContext).toHaveBeenCalledWith(GlobalContext);
    expect(useStateValue).toHaveBeenCalledWith(stateManager);
  });

  it('updates state through setState helper', () => {
    const stateManager = new StateManager<State>(createInitialState());
    vi.mocked(useContext).mockReturnValue(stateManager as never);
    vi.mocked(useStateValue).mockReturnValue(stateManager.get());

    const [, setState] = useGlobalState();

    setState((state) => ({
      ...state,
      viewMode: ViewMode.Picture,
      url: 'https://youtube.com',
    }));

    expect(stateManager.get().viewMode).toBe(ViewMode.Picture);
    expect(stateManager.get().url).toBe('https://youtube.com');
  });
});
