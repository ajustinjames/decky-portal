import React from 'react';
import { StateManager } from 'cotton-box';
import { ModalRootProps } from '@decky/ui';

import { State, GlobalContext } from '../hooks/global-state';

interface ModalContext extends ModalRootProps {
  value: StateManager<State>;
}

export const modalWithState = (Component: React.FC<ModalRootProps>) => {
  return ({ value, ...props }: ModalContext) => (
    <GlobalContext.Provider value={value}>
      <Component {...props} />
    </GlobalContext.Provider>
  );
};
