import { useContext } from 'react';
import type { FC } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StateManager } from 'cotton-box';
import type { ModalRootProps } from '@decky/ui';

import { modalWithState } from './modal';
import { GlobalContext, State } from '../hooks/global-state';
import { Position, ViewMode } from '../lib/util';

const createInitialState = (): State => ({
  viewMode: ViewMode.Picture,
  previousViewMode: ViewMode.Picture,
  visible: true,
  position: Position.TopRight,
  margin: 30,
  size: 1,
  url: 'https://netflix.com',
  controlBar: true,
});

describe('modalWithState', () => {
  it('wraps modal content with global state context', () => {
    const stateManager = new StateManager<State>(createInitialState());

    const InnerModal: FC = () => {
      const context = useContext(GlobalContext);
      return <div>{context === stateManager ? 'Inner Modal' : 'Missing Context'}</div>;
    };

    const WrappedModal = modalWithState(InnerModal as FC<ModalRootProps>);

    render(<WrappedModal value={stateManager} closeModal={() => {}} />);

    expect(screen.getByText('Inner Modal')).toBeInTheDocument();
  });
});
