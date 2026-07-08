import { ConfirmModal, ModalRootProps, TextField } from '@decky/ui';
import { useState } from 'react';

import { modalWithState } from './modal';
import { useGlobalState } from '../hooks/global-state';
import { addBookmark, renameBookmark } from '../lib/bookmarks';
import { normalizeUrl } from '../lib/url';
import { Bookmark } from '../lib/util';

export interface BookmarkEditModalProps extends ModalRootProps {
  /** When present the modal renames this bookmark; otherwise it adds a new one. */
  bookmark?: Bookmark;
}

export const BookmarkEditModal = ({ bookmark, ...props }: BookmarkEditModalProps) => {
  const [, setGlobalState] = useGlobalState();
  const [name, setName] = useState(bookmark?.name ?? '');
  const [url, setUrl] = useState('');

  const isRename = bookmark !== undefined;
  const canSave = isRename ? name.trim().length > 0 : normalizeUrl(url) !== null;

  const save = () => {
    setGlobalState((state) => ({
      ...state,
      ...(isRename ? renameBookmark(state, bookmark.id, name) : addBookmark(state, name, url)),
    }));
  };

  return (
    <ConfirmModal
      {...props}
      strTitle={isRename ? 'Rename Bookmark' : 'Add Bookmark'}
      strOKButtonText="Save"
      bOKDisabled={!canSave}
      onOK={save}
    >
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      {!isRename && <TextField label="URL" value={url} onChange={(e) => setUrl(e.target.value)} />}
    </ConfirmModal>
  );
};

export const BookmarkEditModalWithState = modalWithState(BookmarkEditModal);
