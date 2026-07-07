import { Bookmark, createBookmark } from './util';
import { normalizeUrl } from './url';

export const MAX_BOOKMARKS = 100;
export const MAX_QUICK_ACCESS = 4;

export interface BookmarkState {
  bookmarks: Bookmark[];
  quickAccessIds: string[];
}

export const getQuickAccessBookmarks = (
  bookmarks: Bookmark[],
  quickAccessIds: string[],
): Bookmark[] =>
  quickAccessIds
    .slice(0, MAX_QUICK_ACCESS)
    .map((id) => bookmarks.find((bookmark) => bookmark.id === id))
    .filter((bookmark): bookmark is Bookmark => bookmark !== undefined);

export const isQuickAccessFull = (quickAccessIds: string[]): boolean =>
  quickAccessIds.length >= MAX_QUICK_ACCESS;

/**
 * Adds a bookmark from user input. Returns the unchanged state when the URL
 * can't be normalized to http(s) or the list is at capacity. An empty name
 * falls back to the URL's hostname.
 */
export const addBookmark = (state: BookmarkState, name: string, url: string): BookmarkState => {
  const safeUrl = normalizeUrl(url);
  if (!safeUrl || state.bookmarks.length >= MAX_BOOKMARKS) {
    return state;
  }

  const trimmedName = name.trim();
  const displayName = trimmedName || new URL(safeUrl).hostname;

  return {
    ...state,
    bookmarks: [...state.bookmarks, createBookmark(displayName, safeUrl)],
  };
};

export const renameBookmark = (state: BookmarkState, id: string, name: string): BookmarkState => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return state;
  }

  return {
    ...state,
    bookmarks: state.bookmarks.map((bookmark) =>
      bookmark.id === id ? { ...bookmark, name: trimmedName } : bookmark,
    ),
  };
};

export const removeBookmark = (state: BookmarkState, id: string): BookmarkState => ({
  ...state,
  bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
  quickAccessIds: state.quickAccessIds.filter((quickAccessId) => quickAccessId !== id),
});

/** Moves a bookmark one slot up (-1) or down (+1); no-op at the boundaries. */
export const moveBookmark = (
  state: BookmarkState,
  id: string,
  direction: -1 | 1,
): BookmarkState => {
  const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= state.bookmarks.length) {
    return state;
  }

  const bookmarks = [...state.bookmarks];
  [bookmarks[index], bookmarks[target]] = [bookmarks[target], bookmarks[index]];

  return { ...state, bookmarks };
};

/**
 * Toggles a bookmark's quick-access pin. Adding is refused when all
 * MAX_QUICK_ACCESS slots are taken or the id doesn't exist.
 */
export const toggleQuickAccess = (state: BookmarkState, id: string): BookmarkState => {
  if (state.quickAccessIds.includes(id)) {
    return {
      ...state,
      quickAccessIds: state.quickAccessIds.filter((quickAccessId) => quickAccessId !== id),
    };
  }

  const exists = state.bookmarks.some((bookmark) => bookmark.id === id);
  if (!exists || isQuickAccessFull(state.quickAccessIds)) {
    return state;
  }

  return { ...state, quickAccessIds: [...state.quickAccessIds, id] };
};
