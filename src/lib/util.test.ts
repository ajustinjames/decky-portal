import { describe, expect, it } from 'vitest';

import {
  createBookmark,
  generateBookmarkId,
  PICTURE_HEIGHT,
  PICTURE_WIDTH,
  Position,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  ViewMode,
} from './util';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('util constants and enums', () => {
  it('exports expected screen constants', () => {
    expect(SCREEN_WIDTH).toBe(854);
    expect(SCREEN_HEIGHT).toBe(534);
  });

  it('derives picture dimensions from screen width', () => {
    expect(PICTURE_WIDTH).toBeCloseTo(SCREEN_WIDTH * 0.4);
    expect(PICTURE_HEIGHT).toBeCloseTo(PICTURE_WIDTH * (1 / 1.85));
  });

  it('keeps ViewMode enum values stable', () => {
    expect(ViewMode.Expand).toBe(1);
    expect(ViewMode.Picture).toBe(2);
    expect(ViewMode.Closed).toBe(3);
    expect(ViewMode.Minimised).toBe(4);
  });

  it('keeps Position enum values stable', () => {
    expect(Position.Top).toBe(0);
    expect(Position.TopRight).toBe(1);
    expect(Position.Right).toBe(2);
    expect(Position.BottomRight).toBe(3);
    expect(Position.Bottom).toBe(4);
    expect(Position.BottomLeft).toBe(5);
    expect(Position.Left).toBe(6);
    expect(Position.TopLeft).toBe(7);
  });
});

describe('bookmark helpers', () => {
  it('generateBookmarkId returns a non-empty string', () => {
    const id = generateBookmarkId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('generateBookmarkId returns a UUID v4', () => {
    expect(generateBookmarkId()).toMatch(UUID_V4_REGEX);
  });

  it('generateBookmarkId produces distinct values on successive calls', () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateBookmarkId()));
    expect(ids.size).toBe(10);
  });

  it('createBookmark returns a bookmark with the provided name and url', () => {
    const bookmark = createBookmark('YouTube', 'https://youtube.com');
    expect(bookmark.name).toBe('YouTube');
    expect(bookmark.url).toBe('https://youtube.com');
    expect(bookmark.id).toMatch(UUID_V4_REGEX);
  });

  it('createBookmark does not populate icon fields', () => {
    const bookmark = createBookmark('YouTube', 'https://youtube.com');
    expect(bookmark.iconUrl).toBeUndefined();
    expect(bookmark.iconDataUrl).toBeUndefined();
  });

  it('createBookmark produces distinct ids for each call', () => {
    const a = createBookmark('A', 'https://a.example');
    const b = createBookmark('B', 'https://b.example');
    expect(a.id).not.toBe(b.id);
  });
});
