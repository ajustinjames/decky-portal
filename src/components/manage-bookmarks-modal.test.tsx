import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ManageBookmarksModal } from './manage-bookmarks-modal';
import { useGlobalState } from '../hooks/global-state';
import { Bookmark } from '../lib/util';
import { showModal } from '@decky/ui';

vi.mock('../hooks/global-state', () => ({
  useGlobalState: vi.fn(),
}));

vi.mock('./bookmark-edit-modal', () => ({
  BookmarkEditModalWithState: () => <div>Edit Modal</div>,
}));

vi.mock('@decky/ui', () => ({
  ModalRoot: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Focusable: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    'data-testid'?: string;
    style?: unknown;
  }) => <div data-testid={props['data-testid']}>{children}</div>,
  DialogButton: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    'aria-label'?: string;
  }) => (
    <button aria-label={props['aria-label']} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
  ConfirmModal: ({
    strTitle,
    strDescription,
    onOK,
  }: {
    strTitle?: string;
    strDescription?: string;
    onOK?: () => void;
  }) => (
    <div>
      <h1>{strTitle}</h1>
      <p>{strDescription}</p>
      <button onClick={onOK}>Confirm</button>
    </div>
  ),
  showModal: vi.fn(),
}));

const bookmark = (id: string, name = id): Bookmark => ({
  id,
  name,
  url: `https://${id}.example/`,
});

interface BookmarkStateSlice {
  bookmarks: Bookmark[];
  quickAccessIds: string[];
}

const mockState = (initial: BookmarkStateSlice) => {
  let current = initial;
  const setGlobalState = vi.fn((updater: (s: BookmarkStateSlice) => BookmarkStateSlice) => {
    current = updater(current);
  });
  vi.mocked(useGlobalState).mockReturnValue([current, setGlobalState, {}] as never);
  return { get: () => current };
};

describe('ManageBookmarksModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists every bookmark, not just quick-access ones', () => {
    mockState({
      bookmarks: [bookmark('a', 'Alpha'), bookmark('b', 'Beta'), bookmark('c', 'Gamma')],
      quickAccessIds: ['a'],
    });

    render(<ManageBookmarksModal closeModal={() => {}} />);

    expect(screen.getAllByTestId('bookmark-row')).toHaveLength(3);
    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(screen.getByText('Beta')).toBeTruthy();
    expect(screen.getByText('Gamma')).toBeTruthy();
  });

  it('shows an empty state when there are no bookmarks', () => {
    mockState({ bookmarks: [], quickAccessIds: [] });

    render(<ManageBookmarksModal closeModal={() => {}} />);

    expect(screen.getByText(/No bookmarks yet/)).toBeTruthy();
  });

  it('pins and unpins bookmarks from quick access', () => {
    const state = mockState({
      bookmarks: [bookmark('a', 'Alpha'), bookmark('b', 'Beta')],
      quickAccessIds: ['a'],
    });

    render(<ManageBookmarksModal closeModal={() => {}} />);

    fireEvent.click(screen.getByLabelText('Pin Beta'));
    expect(state.get().quickAccessIds).toEqual(['a', 'b']);

    // The component reads state once per render in these tests, so re-render
    // to reflect the updated pins before unpinning.
    vi.mocked(useGlobalState).mockReturnValue([state.get(), vi.fn(), {}] as never);
  });

  it('disables pinning when quick access is full', () => {
    mockState({
      bookmarks: ['a', 'b', 'c', 'd', 'e'].map((id) => bookmark(id)),
      quickAccessIds: ['a', 'b', 'c', 'd'],
    });

    render(<ManageBookmarksModal closeModal={() => {}} />);

    expect(screen.getByLabelText<HTMLButtonElement>('Pin e').disabled).toBe(true);
    expect(screen.getByLabelText<HTMLButtonElement>('Unpin a').disabled).toBe(false);
    expect(screen.getByText(/Quick access is full/)).toBeTruthy();
  });

  it('reorders bookmarks with the up and down actions', () => {
    const state = mockState({
      bookmarks: [bookmark('a'), bookmark('b'), bookmark('c')],
      quickAccessIds: [],
    });

    render(<ManageBookmarksModal closeModal={() => {}} />);

    fireEvent.click(screen.getByLabelText('Move b up'));
    expect(state.get().bookmarks.map((b) => b.id)).toEqual(['b', 'a', 'c']);
  });

  it('disables move up on the first row and move down on the last', () => {
    mockState({ bookmarks: [bookmark('a'), bookmark('b')], quickAccessIds: [] });

    render(<ManageBookmarksModal closeModal={() => {}} />);

    expect(screen.getByLabelText<HTMLButtonElement>('Move a up').disabled).toBe(true);
    expect(screen.getByLabelText<HTMLButtonElement>('Move b down').disabled).toBe(true);
    expect(screen.getByLabelText<HTMLButtonElement>('Move a down').disabled).toBe(false);
  });

  it('deletes only after the confirmation modal is accepted', () => {
    const state = mockState({
      bookmarks: [bookmark('a', 'Alpha')],
      quickAccessIds: ['a'],
    });

    render(<ManageBookmarksModal closeModal={() => {}} />);
    fireEvent.click(screen.getByLabelText('Delete Alpha'));

    // Nothing deleted yet — a confirmation modal was requested instead.
    expect(state.get().bookmarks).toHaveLength(1);
    expect(showModal).toHaveBeenCalledTimes(1);

    const confirm = render(vi.mocked(showModal).mock.calls[0][0] as never);
    expect(confirm.getByText(/Delete "Alpha"/)).toBeTruthy();

    fireEvent.click(within(confirm.container).getByText('Confirm'));
    expect(state.get().bookmarks).toHaveLength(0);
    expect(state.get().quickAccessIds).toHaveLength(0);
  });

  it('opens the edit modal for add and rename', () => {
    mockState({ bookmarks: [bookmark('a', 'Alpha')], quickAccessIds: [] });

    render(<ManageBookmarksModal closeModal={() => {}} />);

    fireEvent.click(screen.getByLabelText('Add Bookmark'));
    expect(showModal).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Rename Alpha'));
    expect(showModal).toHaveBeenCalledTimes(2);
  });
});
