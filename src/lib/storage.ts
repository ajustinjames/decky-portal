import { State } from '../hooks/global-state';

export const PORTAL_STORAGE_KEY = 'portal';

interface StorageReader {
  getItem(key: string): string | null;
}

export const getPersistedPortalState = (storage: StorageReader): Partial<State> => {
  const persisted = storage.getItem(PORTAL_STORAGE_KEY);
  if (!persisted) {
    return {};
  }

  return JSON.parse(persisted) as Partial<State>;
};
