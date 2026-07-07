import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { BookmarkIcon } from './bookmark-icon';
import { Bookmark } from '../lib/util';

const base: Bookmark = { id: 'bm-1', name: 'YouTube', url: 'https://youtube.com' };

describe('BookmarkIcon', () => {
  it('renders the fallback glyph when the bookmark has no icon', () => {
    render(<BookmarkIcon bookmark={base} />);

    expect(screen.getByTestId('bookmark-icon-fallback')).toBeTruthy();
  });

  it('prefers the cached data URL over the remote icon URL', () => {
    render(
      <BookmarkIcon
        bookmark={{
          ...base,
          iconUrl: 'https://icons.example/youtube.png',
          iconDataUrl: 'data:image/png;base64,AAAA',
        }}
      />,
    );

    expect(screen.getByTestId('bookmark-icon-img').getAttribute('src')).toBe(
      'data:image/png;base64,AAAA',
    );
  });

  it('uses the remote icon URL when no cached data URL exists', () => {
    render(<BookmarkIcon bookmark={{ ...base, iconUrl: 'https://icons.example/youtube.png' }} />);

    expect(screen.getByTestId('bookmark-icon-img').getAttribute('src')).toBe(
      'https://icons.example/youtube.png',
    );
  });

  it('falls back to the glyph when the image fails to load (e.g. offline)', () => {
    render(<BookmarkIcon bookmark={{ ...base, iconUrl: 'https://icons.example/youtube.png' }} />);

    fireEvent.error(screen.getByTestId('bookmark-icon-img'));

    expect(screen.getByTestId('bookmark-icon-fallback')).toBeTruthy();
  });
});
