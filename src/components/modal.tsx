import React from 'react';
import { StateManager } from 'cotton-box';
import { ModalRootProps } from '@decky/ui';

import { State, GlobalContext } from '../hooks/global-state';

type ModalContext<P> = P & {
  value: StateManager<State>;
};

export const modalWithState = <P extends ModalRootProps>(Component: React.FC<P>) => {
  return ({ value, ...props }: ModalContext<P>) => (
    <GlobalContext.Provider value={value}>
      <Component {...(props as unknown as P)} />
    </GlobalContext.Provider>
  );
};
