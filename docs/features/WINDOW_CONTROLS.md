# Feature: Window Controls (Resize, Expand, Minimise)

## Problem

All window management currently lives in the Quick Access sidebar. To resize, expand, or close the popup, the user must:

1. Open the Quick Access Menu (swipe or button press).
2. Navigate to the Portal plugin panel.
3. Toggle or adjust a control.

This is slow and pulls focus away from both the game and the content being watched. There are no on-screen touch targets on the popup itself.

---

## Goal

Provide intuitive, always-accessible touch targets directly on or near the popup window so users can resize, expand, minimise, and close the view without opening the sidebar.

---

## User Stories

1. **As a user**, I want to tap a button on the popup to expand it to full view so I can see more detail.
2. **As a user**, I want to tap a button to shrink the expanded view back to picture-in-picture size.
3. **As a user**, I want to minimise the popup to a small, unobtrusive indicator so it stays available but out of the way while I focus on my game.
4. **As a user**, I want to restore a minimised popup with a single tap on the indicator.
5. **As a user**, I want to close (dismiss) the popup from the popup itself, not just the sidebar.
6. **As a user**, I want the touch targets to be large enough to hit reliably with a finger on the Steam Deck's touchscreen.

---

## Experience Outline

### Touch Target Bar
- A thin control bar appears at the top (or bottom) edge of the popup window.
- The bar contains icon buttons for the primary actions:
  - **Minimise** — collapses the popup to a small floating indicator (e.g., a small pill or icon).
  - **Expand / Restore** — toggles between PiP size and expanded (near-fullscreen) mode.
  - **Close** — dismisses the popup entirely.
- The bar auto-hides after a few seconds of inactivity to maximise viewable content area.
- Tapping anywhere on the popup (or a dedicated "grip" area) re-reveals the control bar.

### Minimised State
- When minimised, the popup collapses to a small floating indicator (icon or pill-shaped badge).
- The indicator shows just enough to remind the user something is running (e.g., a small Portal logo or a pulsing dot).
- Tapping the indicator restores the popup to its previous size and position.
- The indicator's position should match the popup's configured screen position.

### Resize Presets (v1)
- Rather than free-form drag-to-resize (which is difficult on a touchscreen overlaying a game), v1 uses preset sizes.
- The existing Small / Medium / Large presets from the sidebar remain available.
- The touch target bar may include a "cycle size" button that steps through S → M → L → S.

---

## Alternatives Considered

| Approach                                      | Pros                                                                           | Cons                                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Touch target bar on popup (chosen for v1)** | Direct manipulation. No menu needed. Familiar pattern (video player controls). | Requires careful sizing for fat-finger usability. Must auto-hide to avoid covering content.           |
| **Drag-to-resize handles**                    | Most flexible. Users get exact sizing.                                         | Very hard to use on a touchscreen with a game running underneath. Accidental drags likely.            |
| **Pinch-to-zoom gesture**                     | Intuitive on mobile.                                                           | Steam Deck touchscreen gesture support in plugin context is unreliable. May conflict with game input. |
| **Gamepad shortcut cycle**                    | No touchscreen needed.                                                         | Requires learning a button combo. May conflict with game controls. Limited discoverability.           |
| **Swipe gestures on popup**                   | Feels natural (swipe down to minimise, swipe up to expand).                    | Gesture conflicts with webpage scrolling. Hard to distinguish intent.                                 |
| **Sidebar-only controls (current)**           | Already works. No new UI needed.                                               | Slow. Breaks immersion. Requires multiple taps.                                                       |

---

## Touch Target Sizing

- Minimum touch target size should be approximately 44×44 points (Apple HIG) or 48×48 dp (Material Design) — adapt for the Deck's 1280×800 display.
- Buttons should have adequate spacing to prevent mis-taps.
- Consider a slight transparent padding / hit-area expansion beyond the visible icon.

---

## View Modes (Updated)

The current plugin has three view modes: **Expand**, **Picture**, and **Closed**. This feature introduces a fourth:

| Mode          | Description                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| **Expanded**  | Near-fullscreen with margin. Content is the focus.                           |
| **Picture**   | Floating window at a chosen screen position and preset size.                 |
| **Minimised** | Collapsed to a small indicator. Content continues to play in the background. |
| **Closed**    | Popup is completely dismissed. No browser view is active.                    |

---

## Open Questions

> **Open Question:** Should the control bar appear on tap anywhere, or only on a dedicated "grip" strip to avoid interfering with webpage interactions (e.g., clicking a link)?

> **Open Question:** In minimised mode, should audio from the webpage continue playing, or should it be muted until restored?

> **Open Question:** Is there value in a "snap to corner" quick-position feature accessible from the touch bar?

---

## Future Enhancements

- **Free-form drag-to-reposition** — let users drag the PiP window to any position, not just the eight presets.
- **Custom size presets** — let users define and save their own size settings beyond S/M/L.
- **Gamepad shortcut integration** — map window actions (minimise, expand) to a configurable button combo.
- **Picture-in-Picture lock** — a toggle that prevents accidental touches on the popup from interacting with the webpage underneath.
- **Opacity / transparency slider** — allow the popup to be semi-transparent so users can see the game through it.
