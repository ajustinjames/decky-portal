import { describe, expect, it } from 'vitest';

import { createLocalStorageMock } from '../__mocks__/local-storage';
import { getPersistedPortalState, PORTAL_STORAGE_KEY, sanitizePersistedState } from './storage';
import { Position } from './util';

describe('portal storage', () => {
  it('returns empty object when no portal state is persisted', () => {
    const storage = createLocalStorageMock();

    const persisted = getPersistedPortalState(storage);

    expect(persisted).toEqual({});
  });

  it('returns persisted portal data', () => {
    const storage = createLocalStorageMock();
    const portalData = {
      position: Position.TopRight,
      margin: 30,
      size: 1,
      url: 'https://netflix.com',
    };
    storage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(portalData));

    const persisted = getPersistedPortalState(storage);

    expect(persisted).toEqual(portalData);
  });

  it('returns empty object when localStorage contains malformed JSON', () => {
    const storage = createLocalStorageMock();
    storage.setItem(PORTAL_STORAGE_KEY, 'not-valid-json{{{');

    const persisted = getPersistedPortalState(storage);

    expect(persisted).toEqual({});
  });

  it('round-trips bookmarks and quickAccessIds', () => {
    const storage = createLocalStorageMock();
    const portalData = {
      position: Position.TopRight,
      margin: 30,
      size: 1,
      url: 'https://netflix.com',
      bookmarks: [
        { id: 'bm-1', name: 'YouTube', url: 'https://youtube.com' },
        { id: 'bm-2', name: 'Twitch', url: 'https://twitch.tv' },
      ],
      quickAccessIds: ['bm-1', 'bm-2'],
      bookmarksInitialised: true,
    };
    storage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(portalData));

    const persisted = getPersistedPortalState(storage);

    expect(persisted.bookmarks).toEqual(portalData.bookmarks);
    expect(persisted.quickAccessIds).toEqual(portalData.quickAccessIds);
    expect(persisted.bookmarksInitialised).toBe(true);
  });

  it('tolerates persisted payloads missing bookmark fields', () => {
    const storage = createLocalStorageMock();
    const portalData = {
      position: Position.TopRight,
      margin: 30,
      size: 1,
      url: 'https://netflix.com',
    };
    storage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(portalData));

    const persisted = getPersistedPortalState(storage);

    expect(persisted).toEqual(portalData);
    expect(persisted).not.toHaveProperty('bookmarks');
    expect(persisted).not.toHaveProperty('quickAccessIds');
  });
});

describe('sanitizePersistedState', () => {
  it('returns empty object for non-object payloads', () => {
    expect(sanitizePersistedState(null)).toEqual({});
    expect(sanitizePersistedState('string')).toEqual({});
    expect(sanitizePersistedState(42)).toEqual({});
    expect(sanitizePersistedState([1, 2, 3])).toEqual({});
  });

  it('drops unknown keys so hostile payloads cannot inject state', () => {
    const result = sanitizePersistedState({
      viewMode: 99,
      visible: false,
      controlBar: false,
      __proto__evil: true,
    });

    expect(result).toEqual({});
  });

  it('drops fields with the wrong type', () => {
    const result = sanitizePersistedState({
      position: 'TopRight',
      margin: 'wide',
      size: NaN,
      url: 12345,
      bookmarks: 'not-an-array',
      quickAccessIds: { nope: true },
      bookmarksInitialised: 'yes',
    });

    expect(result).toEqual({});
  });

  it('drops positions outside the enum', () => {
    expect(sanitizePersistedState({ position: 99 })).toEqual({});
    expect(sanitizePersistedState({ position: Position.Bottom })).toEqual({
      position: Position.Bottom,
    });
  });

  it('clamps margin and size to their slider ranges', () => {
    const result = sanitizePersistedState({ margin: 5000, size: -10 });

    expect(result.margin).toBe(60);
    expect(result.size).toBe(0.7);
  });

  it('drops non-http(s) urls', () => {
    expect(sanitizePersistedState({ url: 'javascript:alert(1)' })).toEqual({});
    expect(sanitizePersistedState({ url: 'file:///etc/passwd' })).toEqual({});
  });

  it('filters malformed and unsafe bookmarks', () => {
    const result = sanitizePersistedState({
      bookmarks: [
        { id: 'good', name: 'Good', url: 'https://good.example' },
        { id: 'bad-url', name: 'Bad', url: 'javascript:alert(1)' },
        { id: '', name: 'No Id', url: 'https://ok.example' },
        { name: 'Missing Id', url: 'https://ok.example' },
        'not-an-object',
        null,
        { id: 'bad-icon', name: 'Icon', url: 'https://ok.example', iconUrl: 42 },
      ],
    });

    expect(result.bookmarks?.map((b) => b.id)).toEqual(['good']);
  });

  it('keeps only quick-access ids that reference surviving bookmarks', () => {
    const result = sanitizePersistedState({
      bookmarks: [
        { id: 'a', name: 'A', url: 'https://a.example' },
        { id: 'evil', name: 'Evil', url: 'javascript:alert(1)' },
      ],
      quickAccessIds: ['a', 'evil', 'ghost', 42],
    });

    expect(result.quickAccessIds).toEqual(['a']);
  });

  it('caps quick-access ids at four entries', () => {
    const bookmarks = ['a', 'b', 'c', 'd', 'e'].map((id) => ({
      id,
      name: id,
      url: `https://${id}.example`,
    }));

    const result = sanitizePersistedState({
      bookmarks,
      quickAccessIds: ['a', 'b', 'c', 'd', 'e'],
    });

    expect(result.quickAccessIds).toEqual(['a', 'b', 'c', 'd']);
  });
});
