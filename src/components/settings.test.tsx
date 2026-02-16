import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Settings } from './settings';
import { useGlobalState } from '../hooks/global-state';
import { Position, ViewMode } from '../lib/util';
import { showModal } from '@decky/ui';

vi.mock('../hooks/global-state', () => ({
  useGlobalState: vi.fn(),
}));

vi.mock('./url-modal', () => ({
  UrlModalWithState: () => <div>URL Modal</div>,
}));

interface DropdownOption {
  data: number;
  label: string;
}

vi.mock('@decky/ui', () => ({
  PanelSection: ({ children }: { children: ReactNode }) => <section>{children}</section>,
  PanelSectionRow: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ButtonItem: ({
    label,
    children,
    onClick,
  }: {
    label?: string;
    children?: ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{label ?? children}</button>,
  ToggleField: ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
    </label>
  ),
  DropdownItem: ({
    label,
    selectedOption,
    rgOptions,
    onMenuOpened,
    onChange,
  }: {
    label: string;
    selectedOption: number;
    rgOptions: DropdownOption[];
    onMenuOpened?: () => void;
    onChange: (option: DropdownOption) => void;
  }) => (
    <div>
      <button onClick={onMenuOpened}>Open {label}</button>
      <select
        aria-label={label}
        value={selectedOption}
        onChange={(e) =>
          onChange(rgOptions.find((o) => o.data === Number(e.target.value)) as DropdownOption)
        }
      >
        {rgOptions.map((option) => (
          <option key={option.data} value={option.data}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
  SliderField: ({
    label,
    value,
    onChange,
    min,
    max,
    step,
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    step: number;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
      />
    </label>
  ),
  showModal: vi.fn(),
}));

const createState = (viewMode: ViewMode) => ({
  viewMode,
  visible: true,
  position: Position.TopRight,
  margin: 30,
  size: 1,
  url: 'https://netflix.com',
});

describe('Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens from closed state and can be closed again', () => {
    let state = createState(ViewMode.Closed);
    const setGlobalState = vi.fn((updater: (s: typeof state) => typeof state) => {
      state = updater(state);
    });

    vi.mocked(useGlobalState).mockReturnValue([state, setGlobalState, {}] as never);

    render(<Settings />);

    fireEvent.click(screen.getByText('Open'));
    expect(state.viewMode).toBe(ViewMode.Picture);
  });

  it('handles address modal, expand toggle and close in open mode', () => {
    let state = createState(ViewMode.Picture);
    const setGlobalState = vi.fn((updater: (s: typeof state) => typeof state) => {
      state = updater(state);
    });

    vi.mocked(useGlobalState).mockReturnValue([state, setGlobalState, { marker: true }] as never);

    render(<Settings />);

    fireEvent.click(screen.getByText('Address'));
    expect(showModal).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Expand'));
    expect(state.viewMode).toBe(ViewMode.Expand);

    fireEvent.click(screen.getByText('Close'));
    expect(state.viewMode).toBe(ViewMode.Closed);
  });

  it('auto-restores from minimised to picture when opening settings', () => {
    let state = createState(ViewMode.Minimised);
    const setGlobalState = vi.fn((updater: (s: typeof state) => typeof state) => {
      state = updater(state);
    });

    vi.mocked(useGlobalState).mockReturnValue([state, setGlobalState, {}] as never);

    render(<Settings />);

    // The useEffect auto-open should have been called, restoring to Picture
    expect(setGlobalState).toHaveBeenCalled();
    const updater = setGlobalState.mock.calls[0][0] as (s: typeof state) => typeof state;
    const result = updater(createState(ViewMode.Minimised));
    expect(result.viewMode).toBe(ViewMode.Picture);
  });

  it('shows close button when minimised', () => {
    const state = createState(ViewMode.Minimised);
    const setGlobalState = vi.fn();

    vi.mocked(useGlobalState).mockReturnValue([state, setGlobalState, {}] as never);

    render(<Settings />);

    expect(screen.getByText('Close')).toBeTruthy();
  });

  it('updates view position and slider values in picture mode', () => {
    let state = createState(ViewMode.Picture);
    const setGlobalState = vi.fn((updater: (s: typeof state) => typeof state) => {
      state = updater(state);
    });

    vi.mocked(useGlobalState).mockReturnValue([state, setGlobalState, {}] as never);

    render(<Settings />);

    fireEvent.click(screen.getByText('Open View'));
    expect(state.visible).toBe(false);

    fireEvent.change(screen.getByLabelText('View'), {
      target: { value: String(Position.Bottom) },
    });
    expect(state.position).toBe(Position.Bottom);
    expect(state.viewMode).toBe(ViewMode.Picture);

    fireEvent.change(screen.getByLabelText('Size'), { target: { value: '1.3' } });
    expect(state.size).toBe(1.3);

    fireEvent.change(screen.getByLabelText('Margin'), { target: { value: '45' } });
    expect(state.margin).toBe(45);
  });
});
