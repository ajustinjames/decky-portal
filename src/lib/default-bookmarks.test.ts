import { describe, expect, it } from 'vitest';

import { Bookmark } from './util';
import { DEFAULT_BOOKMARKS, seedIfNeeded } from './default-bookmarks';

describe('DEFAULT_BOOKMARKS', () => {
  it('contains the four expected defaults in order', () => {
    expect(DEFAULT_BOOKMARKS.map((b) => b.name)).toEqual([
      'YouTube',
      'Twitch',
      'Netflix',
      'Crunchyroll',
    ]);
  });

  it('uses stable slug ids prefixed with "default-"', () => {
    for (const b of DEFAULT_BOOKMARKS) {
      expect(b.id).toMatch(/^default-[a-z]+$/);
    }
    const ids = DEFAULT_BOOKMARKS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('populates an iconUrl from the Google s2 favicon service for every default', () => {
    for (const b of DEFAULT_BOOKMARKS) {
      expect(b.iconUrl).toMatch(/^https:\/\/www\.google\.com\/s2\/favicons\?domain=[^&]+&sz=64$/);
    }
  });

  it('does not populate iconDataUrl at seed time', () => {
    for (const b of DEFAULT_BOOKMARKS) {
      expect(b.iconDataUrl).toBeUndefined();
    }
  });
});

describe('seedIfNeeded', () => {
  it('seeds defaults when no persisted state exists', () => {
    const result = seedIfNeeded({});

    expect(result.bookmarks).toBe(DEFAULT_BOOKMARKS);
    expect(result.quickAccessIds).toEqual(DEFAULT_BOOKMARKS.map((b) => b.id));
    expect(result.bookmarksInitialised).toBe(true);
  });

  it('preserves other persisted fields when seeding', () => {
    const result = seedIfNeeded({ url: 'https://example.com', margin: 42 });

    expect(result.url).toBe('https://example.com');
    expect(result.margin).toBe(42);
    expect(result.bookmarksInitialised).toBe(true);
  });

  it('does not re-seed when bookmarksInitialised is true and bookmarks were deleted', () => {
    const persisted = { bookmarksInitialised: true, bookmarks: [], quickAccessIds: [] };

    const result = seedIfNeeded(persisted);

    expect(result).toBe(persisted);
    expect(result.bookmarks).toEqual([]);
    expect(result.quickAccessIds).toEqual([]);
  });

  it('does not overwrite existing bookmarks when flag is set', () => {
    const existing: Bookmark[] = [{ id: 'user-1', name: 'Mine', url: 'https://mine.example' }];
    const persisted = {
      bookmarksInitialised: true,
      bookmarks: existing,
      quickAccessIds: ['user-1'],
    };

    const result = seedIfNeeded(persisted);

    expect(result.bookmarks).toBe(existing);
    expect(result.quickAccessIds).toEqual(['user-1']);
  });

  it('treats legacy persisted bookmarks (no flag) as already initialised', () => {
    const existing: Bookmark[] = [{ id: 'user-1', name: 'Mine', url: 'https://mine.example' }];
    const persisted = { bookmarks: existing, quickAccessIds: ['user-1'] };

    const result = seedIfNeeded(persisted);

    expect(result.bookmarks).toBe(existing);
    expect(result.quickAccessIds).toEqual(['user-1']);
    expect(result.bookmarksInitialised).toBeUndefined();
  });
});
