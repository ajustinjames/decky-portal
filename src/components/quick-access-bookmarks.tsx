import { ButtonItem, PanelSection, PanelSectionRow, showModal } from '@decky/ui';
import { FaBookmark } from 'react-icons/fa';

import { useGlobalState } from '../hooks/global-state';
import { getQuickAccessBookmarks } from '../lib/bookmarks';
import { Bookmark, ViewMode } from '../lib/util';
import { BookmarkIcon } from './bookmark-icon';
import { ManageBookmarksModalWithState } from './manage-bookmarks-modal';

export const QuickAccessBookmarks = () => {
  const [{ bookmarks, quickAccessIds }, setGlobalState, stateContext] = useGlobalState();
  const quickAccess = getQuickAccessBookmarks(bookmarks, quickAccessIds);

  const launch = (bookmark: Bookmark) => {
    setGlobalState((state) => ({
      ...state,
      url: bookmark.url,
      visible: true,
      // Launching from the sidebar always surfaces the portal: closed opens a
      // PiP window, minimised restores to the mode it was minimised from.
      viewMode:
        state.viewMode === ViewMode.Closed
          ? ViewMode.Picture
          : state.viewMode === ViewMode.Minimised
            ? state.previousViewMode === ViewMode.Expand
              ? ViewMode.Expand
              : ViewMode.Picture
            : state.viewMode,
    }));
  };

  return (
    <PanelSection title="Bookmarks">
      {quickAccess.map((bookmark) => (
        <PanelSectionRow key={bookmark.id}>
          <ButtonItem layout="below" onClick={() => launch(bookmark)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookmarkIcon bookmark={bookmark} />
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                }}
              >
                {bookmark.name}
              </div>
            </div>
          </ButtonItem>
        </PanelSectionRow>
      ))}
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => showModal(<ManageBookmarksModalWithState value={stateContext} />)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaBookmark />
            <div>Manage Bookmarks</div>
          </div>
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};
