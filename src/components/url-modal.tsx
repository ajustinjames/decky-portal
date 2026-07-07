import { TextField, ConfirmModal, ModalRootProps } from '@decky/ui';
import { useEffect, useState } from 'react';

import { modalWithState } from './modal';
import { useGlobalState } from '../hooks/global-state';
import { normalizeUrl } from '../lib/url';

export const UrlModal = (props: ModalRootProps) => {
  const [{ url }, setGlobalState] = useGlobalState();
  const [field, setField] = useState(url);

  useEffect(() => {
    setGlobalState((state) => ({
      ...state,
      visible: false,
    }));

    return () =>
      setGlobalState((state) => ({
        ...state,
        visible: true,
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfirmModal
      {...props}
      strTitle="Address"
      onOK={() => {
        const normalized = normalizeUrl(field);
        setGlobalState((state) => ({
          ...state,
          visible: true,
          // Keep the previous URL when the input isn't a usable http(s) URL.
          url: normalized ?? state.url,
        }));
      }}
      onCancel={() => {
        setGlobalState((state) => ({
          ...state,
          visible: true,
        }));
      }}
    >
      <TextField value={field} onChange={(e) => setField(e.target.value)} />
    </ConfirmModal>
  );
};

export const UrlModalWithState = modalWithState(UrlModal);
