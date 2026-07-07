import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { BookmarkEditModal } from './bookmark-edit-modal';
import { useGlobalState } from '../hooks/global-state';
import { Bookmark } from '../lib/util';

vi.mock('../hooks/global-state', () => ({
  useGlobalState: vi.fn(),
}));

vi.mock('@decky/ui', () => ({
  ConfirmModal: ({
    children,
    strTitle,
    bOKDisabled,
    onOK,
  }: {
    children: ReactNode;
    strTitle?: string;
    bOKDisabled?: boolean;
    onOK?: () => void;
  }) => (
    <div>
      <h1>{strTitle}</h1>
      <button disabled={bOKDisabled} onClick={onOK}>
        Save
      </button>
      {children}
    </div>
  ),
  TextField: ({
    label,
    value,
    onChange,
  }: {
    label?: string;
    value: string;
    onChange: (e: unknown) => void;
  }) => <input aria-label={label} value={value} onChange={onChange} />,
}));

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

describe('BookmarkEditModal — add mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables save until the URL is valid', () => {
    mockState({ bookmarks: [], quickAccessIds: [] });

    render(<BookmarkEditModal closeModal={() => {}} />);

    const save = screen.getByText<HTMLButtonElement>('Save');
    expect(save.disabled).toBe(true);

    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'javascript:alert(1)' } });
    expect(screen.getByText<HTMLButtonElement>('Save').disabled).toBe(true);

    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'youtube.com' } });
    expect(screen.getByText<HTMLButtonElement>('Save').disabled).toBe(false);
  });

  it('adds a bookmark with a normalized URL', () => {
    const state = mockState({ bookmarks: [], quickAccessIds: [] });

    render(<BookmarkEditModal closeModal={() => {}} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'YouTube' } });
    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'youtube.com' } });
    fireEvent.click(screen.getByText('Save'));

    expect(state.get().bookmarks).toHaveLength(1);
    expect(state.get().bookmarks[0].name).toBe('YouTube');
    expect(state.get().bookmarks[0].url).toBe('https://youtube.com/');
  });

  it('defaults the name to the hostname when left blank', () => {
    const state = mockState({ bookmarks: [], quickAccessIds: [] });

    render(<BookmarkEditModal closeModal={() => {}} />);

    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'www.twitch.tv/someone' } });
    fireEvent.click(screen.getByText('Save'));

    expect(state.get().bookmarks[0].name).toBe('www.twitch.tv');
  });
});

describe('BookmarkEditModal — rename mode', () => {
  const existing: Bookmark = { id: 'bm-1', name: 'Old Name', url: 'https://youtube.com/' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('pre-fills the current name and hides the URL field', () => {
    mockState({ bookmarks: [existing], quickAccessIds: [] });

    render(<BookmarkEditModal closeModal={() => {}} bookmark={existing} />);

    expect(screen.getByLabelText<HTMLInputElement>('Name').value).toBe('Old Name');
    expect(screen.queryByLabelText('URL')).toBeNull();
    expect(screen.getByText('Rename Bookmark')).toBeTruthy();
  });

  it('renames the bookmark and trims whitespace', () => {
    const state = mockState({ bookmarks: [existing], quickAccessIds: [] });

    render(<BookmarkEditModal closeModal={() => {}} bookmark={existing} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '  New Name  ' } });
    fireEvent.click(screen.getByText('Save'));

    expect(state.get().bookmarks[0].name).toBe('New Name');
    expect(state.get().bookmarks[0].url).toBe('https://youtube.com/');
  });

  it('disables save when the name is blank', () => {
    mockState({ bookmarks: [existing], quickAccessIds: [] });

    render(<BookmarkEditModal closeModal={() => {}} bookmark={existing} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '   ' } });

    expect(screen.getByText<HTMLButtonElement>('Save').disabled).toBe(true);
  });
});
