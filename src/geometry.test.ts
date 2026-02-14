import { describe, expect, it } from 'vitest';

import { intersectRectangles } from './lib/geometry';

describe('intersectRectangles', () => {
  it('returns null for an empty array', () => {
    expect(intersectRectangles([])).toBeNull();
  });

  it('returns the same rectangle for a single rectangle', () => {
    const rectangle = { x: 10, y: 10, width: 200, height: 120 };

    expect(intersectRectangles([rectangle])).toEqual(rectangle);
  });

  it('returns overlap for two overlapping rectangles', () => {
    const first = { x: 0, y: 0, width: 100, height: 100 };
    const second = { x: 25, y: 50, width: 100, height: 100 };

    expect(intersectRectangles([first, second])).toEqual({
      x: 25,
      y: 50,
      width: 75,
      height: 50,
    });
  });

  it('returns null for non-overlapping rectangles', () => {
    const first = { x: 0, y: 0, width: 20, height: 20 };
    const second = { x: 25, y: 25, width: 20, height: 20 };

    expect(intersectRectangles([first, second])).toBeNull();
  });

  it('returns null when rectangles only touch edges', () => {
    const first = { x: 0, y: 0, width: 50, height: 50 };
    const second = { x: 50, y: 0, width: 50, height: 50 };

    expect(intersectRectangles([first, second])).toBeNull();
  });
});
