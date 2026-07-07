import { useState } from 'react';
import { FaGlobe } from 'react-icons/fa';

import { Bookmark } from '../lib/util';

interface BookmarkIconProps {
  bookmark: Bookmark;
  size?: number;
}

/**
 * Renders the bookmark's icon with the fallback chain from the favicon story
 * (#22): cached data URL → remote icon URL → generic globe glyph. The glyph
 * also covers offline sessions where the remote icon can't load.
 */
export const BookmarkIcon = ({ bookmark, size = 20 }: BookmarkIconProps) => {
  const [failed, setFailed] = useState(false);
  const src = bookmark.iconDataUrl ?? bookmark.iconUrl;

  if (!src || failed) {
    return <FaGlobe size={size} data-testid="bookmark-icon-fallback" />;
  }

  return (
    <img
      data-testid="bookmark-icon-img"
      src={src}
      width={size}
      height={size}
      alt=""
      style={{ borderRadius: 4, flexShrink: 0 }}
      onError={() => setFailed(true)}
    />
  );
};
