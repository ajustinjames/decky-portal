import { Bookmark } from './util';
import { State } from '../hooks/global-state';

const favicon = (host: string) => `https://www.google.com/s2/favicons?domain=${host}&sz=64`;

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: 'default-youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    iconUrl: favicon('youtube.com'),
  },
  {
    id: 'default-twitch',
    name: 'Twitch',
    url: 'https://www.twitch.tv',
    iconUrl: favicon('twitch.tv'),
  },
  {
    id: 'default-netflix',
    name: 'Netflix',
    url: 'https://www.netflix.com',
    iconUrl: favicon('netflix.com'),
  },
  {
    id: 'default-crunchyroll',
    name: 'Crunchyroll',
    url: 'https://www.crunchyroll.com',
    iconUrl: favicon('crunchyroll.com'),
  },
];

export const seedIfNeeded = (persisted: Partial<State>): Partial<State> => {
  if (persisted.bookmarksInitialised || (persisted.bookmarks?.length ?? 0) > 0) {
    return persisted;
  }
  return {
    ...persisted,
    bookmarks: DEFAULT_BOOKMARKS,
    quickAccessIds: DEFAULT_BOOKMARKS.map((b) => b.id),
    bookmarksInitialised: true,
  };
};
