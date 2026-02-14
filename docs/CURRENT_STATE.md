# Current State Audit

> This document captures what the forked *Picture in Picture* plugin can do today, what works well, and where the gaps are.

---

## Existing Capabilities

| Capability                  | Description                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Open a URL**              | Users enter a web address via a text field modal. The page loads in an internal browser view.                             |
| **Picture-in-Picture Mode** | The browser view renders as a small floating window overlaid on gameplay.                                                 |
| **Expand Mode**             | The floating window expands to cover most of the screen (with margin).                                                    |
| **Position Control**        | In PiP mode, the window can be placed in one of eight screen positions (corners, edges).                                  |
| **Size Control**            | A slider lets users pick Small, Medium, or Large for the floating window.                                                 |
| **Margin Control**          | A slider adjusts how far the floating window sits from screen edges.                                                      |
| **Persistence**             | URL, position, size, and margin are saved to `localStorage` and restored on next launch.                                  |
| **Smart Avoidance**         | The floating window repositions itself to avoid overlapping the navigation menu, Quick Access Menu, and virtual keyboard. |
| **Open / Close**            | The plugin can be opened and closed from the Quick Access sidebar.                                                        |

---

## What Works Well

- The core browser-view approach is solid — it uses Steam's own internal browser, which supports most modern web standards.
- Smart avoidance of system UI is a thoughtful touch and should be preserved.
- Local persistence via `localStorage` is simple and reliable.

---

## Known Limitations & Pain Points

| Area                          | Limitation                                                                                                                                                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No Bookmarks**              | Users must manually re-enter URLs every time they want to switch sites. There is no way to save or recall favourite pages.                                                                                                                    |
| **Window Management**         | Resizing is limited to three presets (S / M / L). There is no way to minimise the window to a small indicator or freely drag to resize. Touch targets for changing window state do not exist — all controls live in the Quick Access sidebar. |
| **No Media Controls**         | There is no play/pause button. Users must interact directly with the webpage (which is often difficult at PiP scale) to control playback.                                                                                                     |
| **No Fullscreen Video**       | Streaming sites show their full browser UI inside the popup. There is no mechanism to trigger the site's native fullscreen for video, meaning a large portion of the popup is wasted on navigation bars and controls.                         |
| **Authentication is Painful** | Signing into sites like Netflix or YouTube requires typing credentials via the Steam Deck virtual keyboard into a tiny embedded browser. There is no password manager integration, QR-code login, or device-code flow support.                |
| **No Visual Feedback**        | There is no loading indicator, error state, or broken-page notification. If a URL fails to load, the user sees a blank view with no guidance.                                                                                                 |
| **Fixed Aspect Ratio**        | The floating window uses a single hardcoded aspect ratio (≈ 1.85:1). This works for widescreen video but is poor for portrait or square content.                                                                                              |
| **No History or Navigation**  | There is no back button, forward button, or page-load history. If a user clicks a link inside the embedded page, they cannot return to the previous page.                                                                                     |

---

## State & Settings Summary

The plugin currently tracks the following state under the key `portal`:

| Field      | Persisted | Purpose                                                                         |
| ---------- | --------- | ------------------------------------------------------------------------------- |
| `viewMode` | No        | Current window state — Expand, Picture, or Closed                               |
| `position` | Yes       | One of eight screen positions for PiP mode                                      |
| `visible`  | No        | Whether the browser view is rendered (temporarily hidden during certain modals) |
| `margin`   | Yes       | Pixel margin from screen edges                                                  |
| `size`     | Yes       | Scale multiplier for the PiP window                                             |
| `url`      | Yes       | The currently loaded web address                                                |

---

## What Should Be Preserved

- Smart UI avoidance logic (nav menu, QAM, virtual keyboard detection).
- `localStorage`-based persistence model (simple, no backend dependency).
- The general Quick Access sidebar as the primary settings surface.
- BSD-3-Clause licence and attribution to the original author.
