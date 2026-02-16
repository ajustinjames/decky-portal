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
