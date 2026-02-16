import {
  PanelSection,
  PanelSectionRow,
  DropdownItem,
  SliderField,
  showModal,
  ButtonItem,
  ToggleField,
} from '@decky/ui';
import { useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';

import { Position, ViewMode } from '../lib/util';
import { useGlobalState } from '../hooks/global-state';
import { UrlModalWithState } from './url-modal';

export const Settings = () => {
  const [{ viewMode, position, margin, url, size }, setGlobalState, stateContext] =
    useGlobalState();

  useEffect(() => {
    setGlobalState((state) => ({
      ...state,
      visible: true,
      viewMode:
        state.viewMode === ViewMode.Closed || state.viewMode === ViewMode.Minimised
          ? ViewMode.Picture
          : state.viewMode,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const positionOptions = [
    { label: 'Top Left', data: Position.TopLeft },
    { label: 'Top', data: Position.Top },
    { label: 'Top Right', data: Position.TopRight },
    { label: 'Right', data: Position.Right },
    { label: 'Bottom Right', data: Position.BottomRight },
    { label: 'Bottom', data: Position.Bottom },
    { label: 'Bottom Left', data: Position.BottomLeft },
    { label: 'Left', data: Position.Left },
  ];

  return (
    <>
      <PanelSection>
        {viewMode === ViewMode.Closed && (
          <>
            <PanelSectionRow>
              <ButtonItem
                bottomSeparator="none"
                layout="below"
                onClick={() =>
                  setGlobalState((state) => ({
                    ...state,
                    viewMode: ViewMode.Picture,
                  }))
                }
              >
                Open
              </ButtonItem>
            </PanelSectionRow>
          </>
        )}
        {viewMode !== ViewMode.Closed && (
          <>
            <PanelSectionRow>
              <ButtonItem
                label="Address"
                layout="below"
                onClick={() => showModal(<UrlModalWithState value={stateContext} />)}
              >
                <div style={{ display: 'flex' }}>
                  <FaEdit />
                  &nbsp;&nbsp;
                  <div style={{ maxWidth: 180, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {url}
                  </div>
                </div>
              </ButtonItem>
            </PanelSectionRow>
            <PanelSectionRow>
              <ToggleField
                label="Expand"
                checked={viewMode === ViewMode.Expand}
                onChange={(checked) => {
                  setGlobalState((state) => ({
                    ...state,
                    viewMode: checked ? ViewMode.Expand : ViewMode.Picture,
                  }));
                }}
              />
            </PanelSectionRow>
          </>
        )}
        {viewMode === ViewMode.Picture && (
          <>
            <PanelSectionRow>
              <DropdownItem
                label="View"
                selectedOption={position}
                rgOptions={positionOptions}
                onMenuOpened={() =>
                  setGlobalState((state) => ({
                    ...state,
                    visible: false,
                  }))
                }
                onChange={(option) =>
                  setGlobalState((state) => ({
                    ...state,
                    visible: true,
                    position: option.data,
                    viewMode: ViewMode.Picture,
                  }))
                }
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <SliderField
                label="Size"
                value={size}
                onChange={(size) =>
                  setGlobalState((state) => ({
                    ...state,
                    size,
                    visible: true,
                    viewMode: ViewMode.Picture,
                  }))
                }
                min={0.7}
                max={1.3}
                step={0.15}
                notchCount={3}
                notchTicksVisible={true}
                notchLabels={[
                  { label: 'S', notchIndex: 0, value: 0.7 },
                  { label: 'M', notchIndex: 1, value: 1 },
                  { label: 'L', notchIndex: 2, value: 1.3 },
                ]}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <SliderField
                label="Margin"
                value={margin}
                onChange={(margin) =>
                  setGlobalState((state) => ({
                    ...state,
                    margin,
                    visible: true,
                    viewMode: ViewMode.Picture,
                  }))
                }
                min={0}
                max={60}
                step={15}
                notchCount={3}
                notchTicksVisible={true}
                notchLabels={[
                  { label: 'S', notchIndex: 0, value: 0 },
                  { label: 'M', notchIndex: 1, value: 30 },
                  { label: 'L', notchIndex: 2, value: 60 },
                ]}
              />
            </PanelSectionRow>
          </>
        )}
        {viewMode !== ViewMode.Closed && (
          <>
            <PanelSectionRow>
              <ButtonItem
                bottomSeparator="none"
                layout="below"
                onClick={() =>
                  setGlobalState((state) => ({
                    ...state,
                    viewMode: ViewMode.Closed,
                  }))
                }
              >
                Close
              </ButtonItem>
            </PanelSectionRow>
          </>
        )}
      </PanelSection>
    </>
  );
};
