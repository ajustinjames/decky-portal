import { describe, expect, it } from 'vitest';

import { createLocalStorageMock } from './__mocks__/local-storage';
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
});