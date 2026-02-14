import React, { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StateManager } from 'cotton-box';

import { modalWithState } from './modal';
import { GlobalContext, State } from '../hooks/global-state';
import { Position, ViewMode } from '../lib/util';

const createInitialState = (): State => ({
  viewMode: ViewMode.Picture,
  visible: true,
  position: Position.TopRight,
  margin: 30,
  size: 1,
  url: 'https://netflix.com',
});

describe('modalWithState', () => {
  it('wraps modal content with global state context', () => {
    let captured: StateManager<State> | null = null;

    const InnerModal: React.FC = () => {
      captured = useContext(GlobalContext);
      return <div>Inner Modal</div>;
    };

    const WrappedModal = modalWithState(InnerModal as React.FC<any>);
    const stateManager = new StateManager<State>(createInitialState());

    render(<WrappedModal value={stateManager} closeModal={() => {}} />);

    expect(screen.getByText('Inner Modal')).toBeInTheDocument();
    expect(captured).toBe(stateManager);
  });
});
