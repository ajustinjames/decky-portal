import { describe, expect, it } from 'vitest';

import { createLocalStorageMock } from '../__mocks__/local-storage';
import { getPersistedPortalState, PORTAL_STORAGE_KEY } from './storage';

describe('portal storage', () => {
  it('returns empty object when no portal state is persisted', () => {
    const storage = createLocalStorageMock();

    const persisted = getPersistedPortalState(storage);

    expect(persisted).toEqual({});
  });

  it('returns persisted portal data', () => {
    const storage = createLocalStorageMock();
    const portalData = {
      position: 'TopRight',
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
      position: 'TopRight',
      margin: 30,
      size: 1,
      url: 'https://netflix.com',
      bookmarks: [
        { id: 'bm-1', name: 'YouTube', url: 'https://youtube.com' },
        { id: 'bm-2', name: 'Twitch', url: 'https://twitch.tv' },
      ],
      quickAccessIds: ['bm-1', 'bm-2'],
    };
    storage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(portalData));

    const persisted = getPersistedPortalState(storage);

    expect(persisted.bookmarks).toEqual(portalData.bookmarks);
    expect(persisted.quickAccessIds).toEqual(portalData.quickAccessIds);
  });

  it('tolerates persisted payloads missing bookmark fields', () => {
    const storage = createLocalStorageMock();
    const portalData = {
      position: 'TopRight',
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
