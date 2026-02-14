import { State } from './globalState';

export const PORTAL_STORAGE_KEY = 'portal';

export const getPersistedPortalState = (storage: Pick<Storage, 'getItem'>): Partial<State> => {
  const persisted = storage.getItem(PORTAL_STORAGE_KEY);
  if (!persisted) {
    return {};
  }

  return JSON.parse(persisted) as Partial<State>;
};