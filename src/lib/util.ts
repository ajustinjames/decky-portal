export const SCREEN_WIDTH = 854;
export const SCREEN_HEIGHT = 534;
export const PICTURE_WIDTH = SCREEN_WIDTH * 0.4;
export const PICTURE_HEIGHT = PICTURE_WIDTH * (1.0 / 1.85);

export enum ViewMode {
  Expand = 1,
  Picture = 2,
  Closed = 3,
  Minimised = 4,
}

export enum Position {
  Top,
  TopRight,
  Right,
  BottomRight,
  Bottom,
  BottomLeft,
  Left,
  TopLeft,
}

export interface Bookmark {
  id: string;
  name: string;
  url: string;
  iconUrl?: string;
  iconDataUrl?: string;
}

// Steam's CEF build can lag mainline Chromium; crypto.randomUUID (Chromium 92+)
// is not guaranteed, so fall back to building a v4 UUID from getRandomValues.
export const generateBookmarkId = (): string => {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const createBookmark = (name: string, url: string): Bookmark => ({
  id: generateBookmarkId(),
  name,
  url,
});
