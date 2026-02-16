import { StateManager } from 'cotton-box';
import { useContext, createContext } from 'react';

import { Position, ViewMode } from '../lib/util';
import { useStateValue } from 'cotton-box-react';

export interface State {
  viewMode: ViewMode;
  previousViewMode: ViewMode;
  position: Position;
  visible: boolean;
  margin: number;
  size: number;
  url: string;
}

export const GlobalContext = createContext(new StateManager<State>({} as State));

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  const state = useStateValue(context);

  const setState = (setter: (state: State) => State) => context.set(setter(context.get()));

  return [state, setState, context] as [
    State,
    (setter: (state: State) => State) => void,
    StateManager<State>,
  ];
};
