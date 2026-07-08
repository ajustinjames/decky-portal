import { State } from '../hooks/global-state';
import { Bookmark, Position } from './util';
import { isSafeUrl } from './url';
import { MAX_BOOKMARKS, MAX_QUICK_ACCESS } from './bookmarks';

export const PORTAL_STORAGE_KEY = 'portal';

interface StorageReader {
  getItem(key: string): string | null;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === 'string';

const isValidBookmark = (value: unknown): value is Bookmark => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    record.id.length > 0 &&
    typeof record.name === 'string' &&
    typeof record.url === 'string' &&
    isSafeUrl(record.url) &&
    isOptionalString(record.iconUrl) &&
    isOptionalString(record.iconDataUrl)
  );
};

/**
 * Rebuilds a Partial<State> from an untrusted parsed payload, keeping only
 * known keys whose values pass a type/range check. localStorage is writable
 * by anything running in Steam's shared browser context, so its content
 * cannot be assumed to match what the plugin previously wrote.
 */
export const sanitizePersistedState = (raw: unknown): Partial<State> => {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return {};
  }

  const data = raw as Record<string, unknown>;
  const result: Partial<State> = {};

  if (isFiniteNumber(data.position) && Position[data.position] !== undefined) {
    result.position = data.position;
  }
  if (isFiniteNumber(data.margin)) {
    result.margin = clamp(data.margin, 0, 60);
  }
  if (isFiniteNumber(data.size)) {
    result.size = clamp(data.size, 0.7, 1.3);
  }
  if (typeof data.url === 'string' && isSafeUrl(data.url)) {
    result.url = data.url;
  }
  if (typeof data.bookmarksInitialised === 'boolean') {
    result.bookmarksInitialised = data.bookmarksInitialised;
  }

  if (Array.isArray(data.bookmarks)) {
    result.bookmarks = data.bookmarks.filter(isValidBookmark).slice(0, MAX_BOOKMARKS);
  }

  if (Array.isArray(data.quickAccessIds)) {
    const knownIds = new Set((result.bookmarks ?? []).map((bookmark) => bookmark.id));
    result.quickAccessIds = data.quickAccessIds
      .filter((id): id is string => typeof id === 'string' && knownIds.has(id))
      .slice(0, MAX_QUICK_ACCESS);
  }

  return result;
};

export const getPersistedPortalState = (storage: StorageReader): Partial<State> => {
  const persisted = storage.getItem(PORTAL_STORAGE_KEY);
  if (!persisted) {
    return {};
  }

  try {
    return sanitizePersistedState(JSON.parse(persisted));
  } catch {
    return {};
  }
};
