import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { UrlModal } from './url-modal';
import { useGlobalState } from '../hooks/global-state';
import { Position, ViewMode } from '../lib/util';

vi.mock('../hooks/global-state', () => ({
  useGlobalState: vi.fn(),
}));

vi.mock('@decky/ui', () => ({
  ConfirmModal: ({ children, onOK, onCancel }: any) => (
    <div>
      <button onClick={onOK}>OK</button>
      <button onClick={onCancel}>Cancel</button>
      {children}
    </div>
  ),
  TextField: ({ value, onChange }: any) => (
    <input aria-label="url" value={value} onChange={onChange} />
  ),
}));

const createState = () => ({
  viewMode: ViewMode.Picture,
  visible: true,
  position: Position.TopRight,
  margin: 30,
  size: 1,
  url: 'https://netflix.com',
});

describe('UrlModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hides on mount and restores visibility on unmount', () => {
    let state = createState();
    const setGlobalState = vi.fn((updater: (s: typeof state) => typeof state) => {
      state = updater(state);
    });

    vi.mocked(useGlobalState).mockReturnValue([state, setGlobalState] as never);

    const { unmount } = render(<UrlModal closeModal={() => {}} />);

    expect(state.visible).toBe(false);

    unmount();

    expect(state.visible).toBe(true);
  });

  it('updates url and visibility when confirmed', () => {
    let state = createState();
    const setGlobalState = vi.fn((updater: (s: typeof state) => typeof state) => {
      state = updater(state);
    });

    vi.mocked(useGlobalState).mockReturnValue([state, setGlobalState] as never);

    render(<UrlModal closeModal={() => {}} />);

    fireEvent.change(screen.getByLabelText('url'), { target: { value: 'https://youtube.com' } });
    fireEvent.click(screen.getByText('OK'));

    expect(state.url).toBe('https://youtube.com');
    expect(state.visible).toBe(true);
  });

  it('restores visibility when cancelled', () => {
    let state = createState();
    const setGlobalState = vi.fn((updater: (s: typeof state) => typeof state) => {
      state = updater(state);
    });

    vi.mocked(useGlobalState).mockReturnValue([state, setGlobalState] as never);

    render(<UrlModal closeModal={() => {}} />);
    fireEvent.click(screen.getByText('Cancel'));

    expect(state.visible).toBe(true);
    expect(state.url).toBe('https://netflix.com');
  });
});
