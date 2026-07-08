import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { QuickAccessBookmarks } from './quick-access-bookmarks';
import { useGlobalState } from '../hooks/global-state';
import { Bookmark, Position, ViewMode } from '../lib/util';
import { showModal } from '@decky/ui';

vi.mock('../hooks/global-state', () => ({
  useGlobalState: vi.fn(),
}));

vi.mock('./manage-bookmarks-modal', () => ({
  ManageBookmarksModalWithState: () => <div>Manage Modal</div>,
}));

vi.mock('@decky/ui', () => ({
  PanelSection: ({ title, children }: { title?: string; children: ReactNode }) => (
    <section aria-label={title}>{children}</section>
  ),
  PanelSectionRow: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ButtonItem: ({ children, onClick }: { children?: ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  showModal: vi.fn(),
}));

const bookmark = (id: string, name = id): Bookmark => ({
  id,
  name,
  url: `https://${id}.example/`,
});

const createState = (overrides: Partial<Record<string, unknown>> = {}) => ({
  viewMode: ViewMode.Closed,
  previousViewMode: ViewMode.Picture,
  visible: true,
  position: Position.TopRight,
  margin: 30,
  size: 1,
  url: 'https://netflix.com',
  controlBar: true,
  bookmarks: [bookmark('youtube', 'YouTube'), bookmark('twitch', 'Twitch')],
  quickAccessIds: ['youtube', 'twitch'],
  bookmarksInitialised: true,
  ...overrides,
});

const mockState = (state: ReturnType<typeof createState>) => {
  let current = state;
  const setGlobalState = vi.fn((updater: (s: typeof state) => typeof state) => {
    current = updater(current);
  });
  vi.mocked(useGlobalState).mockReturnValue([current, setGlobalState, {}] as never);
  return { get: () => current };
};

describe('QuickAccessBookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pinned bookmarks in quick-access order', () => {
    mockState(createState({ quickAccessIds: ['twitch', 'youtube'] }));

    render(<QuickAccessBookmarks />);

    const buttons = screen.getAllByRole('button').map((b) => b.textContent);
    expect(buttons[0]).toContain('Twitch');
    expect(buttons[1]).toContain('YouTube');
  });

  it('skips quick-access ids that no longer resolve to a bookmark', () => {
    mockState(createState({ quickAccessIds: ['ghost', 'youtube'] }));

    render(<QuickAccessBookmarks />);

    expect(screen.queryByText('Twitch')).toBeNull();
    expect(screen.getByText('YouTube')).toBeTruthy();
  });

  it('launches a bookmark: sets the url and opens the portal from closed', () => {
    const state = mockState(createState({ viewMode: ViewMode.Closed }));

    render(<QuickAccessBookmarks />);
    fireEvent.click(screen.getByText('YouTube'));

    expect(state.get().url).toBe('https://youtube.example/');
    expect(state.get().viewMode).toBe(ViewMode.Picture);
    expect(state.get().visible).toBe(true);
  });

  it('restores an expanded portal when launching while minimised', () => {
    const state = mockState(
      createState({ viewMode: ViewMode.Minimised, previousViewMode: ViewMode.Expand }),
    );

    render(<QuickAccessBookmarks />);
    fireEvent.click(screen.getByText('YouTube'));

    expect(state.get().viewMode).toBe(ViewMode.Expand);
  });

  it('keeps the current view mode when the portal is already open', () => {
    const state = mockState(createState({ viewMode: ViewMode.Picture }));

    render(<QuickAccessBookmarks />);
    fireEvent.click(screen.getByText('Twitch'));

    expect(state.get().viewMode).toBe(ViewMode.Picture);
    expect(state.get().url).toBe('https://twitch.example/');
  });

  it('shows only the manage button when nothing is pinned', () => {
    mockState(createState({ quickAccessIds: [] }));

    render(<QuickAccessBookmarks />);

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByText('Manage Bookmarks')).toBeTruthy();
  });

  it('opens the manage modal', () => {
    mockState(createState());

    render(<QuickAccessBookmarks />);
    fireEvent.click(screen.getByText('Manage Bookmarks'));

    expect(showModal).toHaveBeenCalledTimes(1);
  });
});
