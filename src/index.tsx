import { FaTv } from 'react-icons/fa';
import { StateManager } from 'cotton-box';
import { quickAccessMenuClasses } from '@decky/ui';
import { definePlugin, routerHook } from '@decky/api';

import { PortalViewOuter } from './components/portal-view';
import { Settings } from './components/settings';
import { Position, ViewMode } from './lib/util';
import { State, GlobalContext } from './hooks/global-state';
import { getPersistedPortalState, PORTAL_STORAGE_KEY } from './lib/storage';

export default definePlugin(() => {
  const defaultState: State = {
    viewMode: ViewMode.Closed,
    previousViewMode: ViewMode.Picture,
    visible: true,
    position: Position.TopRight,
    margin: 30,
    size: 1,
    url: 'https://netflix.com',
  };

  const state = new StateManager<State>({
    ...defaultState,
    ...getPersistedPortalState(localStorage),
  });

  state.watch(({ position, margin, size, url }) =>
    localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify({ position, margin, size, url })),
  );

  routerHook.addGlobalComponent('Portal', () => {
    return (
      <GlobalContext.Provider value={state}>
        <PortalViewOuter />
      </GlobalContext.Provider>
    );
  });

  return {
    name: 'Portal',
    titleView: <div className={quickAccessMenuClasses.Title}>Portal</div>,
    icon: <FaTv />,
    content: (
      <GlobalContext.Provider value={state}>
        <Settings />
      </GlobalContext.Provider>
    ),
    onDismount() {
      routerHook.removeGlobalComponent('Portal');
    },
  };
});
