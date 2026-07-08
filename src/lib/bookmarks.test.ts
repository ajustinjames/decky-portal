import { describe, expect, it } from 'vitest';

import { Bookmark } from './util';
import {
  addBookmark,
  BookmarkState,
  getQuickAccessBookmarks,
  isQuickAccessFull,
  MAX_BOOKMARKS,
  MAX_QUICK_ACCESS,
  moveBookmark,
  removeBookmark,
  renameBookmark,
  toggleQuickAccess,
} from './bookmarks';

const bookmark = (id: string, name = id, url = `https://${id}.example/`): Bookmark => ({
  id,
  name,
  url,
});

const stateWith = (bookmarks: Bookmark[], quickAccessIds: string[] = []): BookmarkState => ({
  bookmarks,
  quickAccessIds,
});

describe('addBookmark', () => {
  it('appends a bookmark with a normalized URL', () => {
    const result = addBookmark(stateWith([]), 'YouTube', 'youtube.com');

    expect(result.bookmarks).toHaveLength(1);
    expect(result.bookmarks[0].name).toBe('YouTube');
    expect(result.bookmarks[0].url).toBe('https://youtube.com/');
  });

  it('falls back to the hostname when the name is blank', () => {
    const result = addBookmark(stateWith([]), '   ', 'https://www.twitch.tv/streamer');

    expect(result.bookmarks[0].name).toBe('www.twitch.tv');
  });

  it('refuses unsafe URLs and returns the state unchanged', () => {
    const state = stateWith([]);

    expect(addBookmark(state, 'evil', 'javascript:alert(1)')).toBe(state);
    expect(addBookmark(state, 'empty', '')).toBe(state);
  });

  it('enforces the bookmark cap', () => {
    const full = stateWith(Array.from({ length: MAX_BOOKMARKS }, (_, i) => bookmark(`bm-${i}`)));

    expect(addBookmark(full, 'One More', 'https://example.com')).toBe(full);
  });

  it('does not mutate the input state', () => {
    const state = stateWith([bookmark('a')]);
    addBookmark(state, 'B', 'https://b.example');

    expect(state.bookmarks).toHaveLength(1);
  });
});

describe('renameBookmark', () => {
  it('renames only the matching bookmark and trims the name', () => {
    const state = stateWith([bookmark('a'), bookmark('b')]);

    const result = renameBookmark(state, 'a', '  New Name  ');

    expect(result.bookmarks[0].name).toBe('New Name');
    expect(result.bookmarks[1].name).toBe('b');
  });

  it('ignores blank names', () => {
    const state = stateWith([bookmark('a')]);

    expect(renameBookmark(state, 'a', '   ')).toBe(state);
  });
});

describe('removeBookmark', () => {
  it('removes the bookmark and its quick-access pin', () => {
    const state = stateWith([bookmark('a'), bookmark('b')], ['a', 'b']);

    const result = removeBookmark(state, 'a');

    expect(result.bookmarks.map((b) => b.id)).toEqual(['b']);
    expect(result.quickAccessIds).toEqual(['b']);
  });

  it('is a no-op for unknown ids', () => {
    const state = stateWith([bookmark('a')], ['a']);

    const result = removeBookmark(state, 'nope');

    expect(result.bookmarks).toHaveLength(1);
    expect(result.quickAccessIds).toEqual(['a']);
  });
});

describe('moveBookmark', () => {
  it('moves a bookmark up and down', () => {
    const state = stateWith([bookmark('a'), bookmark('b'), bookmark('c')]);

    expect(moveBookmark(state, 'b', -1).bookmarks.map((b) => b.id)).toEqual(['b', 'a', 'c']);
    expect(moveBookmark(state, 'b', 1).bookmarks.map((b) => b.id)).toEqual(['a', 'c', 'b']);
  });

  it('is a no-op at the boundaries and for unknown ids', () => {
    const state = stateWith([bookmark('a'), bookmark('b')]);

    expect(moveBookmark(state, 'a', -1)).toBe(state);
    expect(moveBookmark(state, 'b', 1)).toBe(state);
    expect(moveBookmark(state, 'nope', 1)).toBe(state);
  });
});

describe('toggleQuickAccess', () => {
  it('pins and unpins a bookmark', () => {
    const state = stateWith([bookmark('a')]);

    const pinned = toggleQuickAccess(state, 'a');
    expect(pinned.quickAccessIds).toEqual(['a']);

    const unpinned = toggleQuickAccess(pinned, 'a');
    expect(unpinned.quickAccessIds).toEqual([]);
  });

  it('refuses to pin beyond the quick-access limit', () => {
    const bookmarks = ['a', 'b', 'c', 'd', 'e'].map((id) => bookmark(id));
    const state = stateWith(bookmarks, ['a', 'b', 'c', 'd']);

    expect(toggleQuickAccess(state, 'e')).toBe(state);
  });

  it('still allows unpinning when full', () => {
    const bookmarks = ['a', 'b', 'c', 'd'].map((id) => bookmark(id));
    const state = stateWith(bookmarks, ['a', 'b', 'c', 'd']);

    expect(toggleQuickAccess(state, 'd').quickAccessIds).toEqual(['a', 'b', 'c']);
  });

  it('refuses to pin an id that has no bookmark', () => {
    const state = stateWith([bookmark('a')]);

    expect(toggleQuickAccess(state, 'ghost')).toBe(state);
  });
});

describe('getQuickAccessBookmarks', () => {
  it('resolves ids in quick-access order and skips dangling ids', () => {
    const bookmarks = [bookmark('a'), bookmark('b'), bookmark('c')];

    const result = getQuickAccessBookmarks(bookmarks, ['c', 'ghost', 'a']);

    expect(result.map((b) => b.id)).toEqual(['c', 'a']);
  });

  it('caps the result at the quick-access limit', () => {
    const bookmarks = ['a', 'b', 'c', 'd', 'e'].map((id) => bookmark(id));

    const result = getQuickAccessBookmarks(bookmarks, ['a', 'b', 'c', 'd', 'e']);

    expect(result).toHaveLength(MAX_QUICK_ACCESS);
  });
});

describe('isQuickAccessFull', () => {
  it('reports full only at the limit', () => {
    expect(isQuickAccessFull(['a', 'b', 'c'])).toBe(false);
    expect(isQuickAccessFull(['a', 'b', 'c', 'd'])).toBe(true);
  });
});
