import {
  ConfirmModal,
  DialogButton,
  Focusable,
  ModalRoot,
  ModalRootProps,
  showModal,
} from '@decky/ui';
import { FaArrowDown, FaArrowUp, FaPen, FaPlus, FaRegStar, FaStar, FaTrash } from 'react-icons/fa';

import { modalWithState } from './modal';
import { useGlobalState, State } from '../hooks/global-state';
import {
  BookmarkState,
  isQuickAccessFull,
  MAX_QUICK_ACCESS,
  moveBookmark,
  removeBookmark,
  toggleQuickAccess,
} from '../lib/bookmarks';
import { Bookmark } from '../lib/util';
import { BookmarkEditModalWithState } from './bookmark-edit-modal';
import { BookmarkIcon } from './bookmark-icon';

const actionButtonStyle = {
  minWidth: 40,
  width: 40,
  height: 40,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const ManageBookmarksModal = (props: ModalRootProps) => {
  const [{ bookmarks, quickAccessIds }, setGlobalState, stateContext] = useGlobalState();

  const apply = (operation: (state: State) => BookmarkState) =>
    setGlobalState((state) => ({ ...state, ...operation(state) }));

  const openAdd = () => showModal(<BookmarkEditModalWithState value={stateContext} />);

  const openRename = (bookmark: Bookmark) =>
    showModal(<BookmarkEditModalWithState value={stateContext} bookmark={bookmark} />);

  const confirmDelete = (bookmark: Bookmark) =>
    showModal(
      <ConfirmModal
        strTitle="Delete Bookmark"
        strDescription={`Delete "${bookmark.name}"? This cannot be undone.`}
        strOKButtonText="Delete"
        onOK={() => apply((state) => removeBookmark(state, bookmark.id))}
      />,
    );

  const quickAccessFull = isQuickAccessFull(quickAccessIds);

  return (
    <ModalRoot {...props}>
      <h1 style={{ margin: '0 0 12px' }}>Bookmarks</h1>
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
        Starred bookmarks (up to {MAX_QUICK_ACCESS}) appear in the Quick Access sidebar.
        {quickAccessFull && ' Quick access is full — unstar one to make room.'}
      </div>
      <Focusable
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          maxHeight: 320,
          overflowY: 'auto',
        }}
      >
        {bookmarks.length === 0 && (
          <div style={{ opacity: 0.6, padding: '16px 0' }}>
            No bookmarks yet. Add one to get started.
          </div>
        )}
        {bookmarks.map((bookmark, index) => {
          const pinned = quickAccessIds.includes(bookmark.id);
          return (
            <Focusable
              key={bookmark.id}
              data-testid="bookmark-row"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              flow-children="horizontal"
            >
              <BookmarkIcon bookmark={bookmark} />
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {bookmark.name}
              </div>
              <DialogButton
                style={actionButtonStyle}
                aria-label={pinned ? `Unpin ${bookmark.name}` : `Pin ${bookmark.name}`}
                disabled={!pinned && quickAccessFull}
                onClick={() => apply((state) => toggleQuickAccess(state, bookmark.id))}
              >
                {pinned ? <FaStar /> : <FaRegStar />}
              </DialogButton>
              <DialogButton
                style={actionButtonStyle}
                aria-label={`Move ${bookmark.name} up`}
                disabled={index === 0}
                onClick={() => apply((state) => moveBookmark(state, bookmark.id, -1))}
              >
                <FaArrowUp />
              </DialogButton>
              <DialogButton
                style={actionButtonStyle}
                aria-label={`Move ${bookmark.name} down`}
                disabled={index === bookmarks.length - 1}
                onClick={() => apply((state) => moveBookmark(state, bookmark.id, 1))}
              >
                <FaArrowDown />
              </DialogButton>
              <DialogButton
                style={actionButtonStyle}
                aria-label={`Rename ${bookmark.name}`}
                onClick={() => openRename(bookmark)}
              >
                <FaPen />
              </DialogButton>
              <DialogButton
                style={actionButtonStyle}
                aria-label={`Delete ${bookmark.name}`}
                onClick={() => confirmDelete(bookmark)}
              >
                <FaTrash />
              </DialogButton>
            </Focusable>
          );
        })}
      </Focusable>
      <DialogButton
        style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}
        aria-label="Add Bookmark"
        onClick={openAdd}
      >
        <FaPlus /> Add Bookmark
      </DialogButton>
    </ModalRoot>
  );
};

export const ManageBookmarksModalWithState = modalWithState(ManageBookmarksModal);
