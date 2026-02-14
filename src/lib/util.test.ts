import { describe, expect, it } from 'vitest';

import {
  PICTURE_HEIGHT,
  PICTURE_WIDTH,
  Position,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  ViewMode,
} from './util';

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
