# Future Features & Roadmap

> This is a living document. It captures ideas that are **not** part of the current overhaul but may be pursued in future releases. Items are loosely prioritised by perceived user value.

---

## Tier 1 — High Value, Likely Next

| Idea                          | Description                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Back / Forward Navigation** | Add browser-style back and forward buttons to the touch control bar so users can navigate within a site without re-entering URLs. |
| **Loading Indicator**         | Show a visual spinner or progress bar while a page is loading. Display a friendly error message if the page fails to load.        |
| **Volume Control**            | A quick volume slider or mute toggle for audio coming from the embedded browser, independent of system volume.                    |
| **History**                   | A short list of recently visited URLs so users can return to a page they visited earlier without bookmarking it first.            |

---

## Tier 2 — Medium Value, Worth Exploring

| Idea                             | Description                                                                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Free-Form Drag to Reposition** | Let users drag the PiP window to any position on screen rather than being locked to eight preset positions.                                     |
| **Custom Size Presets**          | Allow users to define and save their own window sizes beyond Small / Medium / Large.                                                            |
| **Adjustable Aspect Ratio**      | Let users choose between widescreen (16:9), standard (4:3), and square (1:1) aspect ratios for the popup to better fit different content types. |
| **Per-Bookmark Settings**        | Store preferred window size, position, and fullscreen-video state for each bookmark so the popup auto-configures when a bookmark is loaded.     |
| **Gamepad Shortcut Mapping**     | Assign window controls (minimise, expand, play/pause) to configurable gamepad button combinations for hands-free control.                       |
| **Seek / Scrub Bar**             | A draggable seek bar for video content, allowing users to jump to a specific point in a video.                                                  |
| **Opacity / Transparency**       | A slider that controls popup window opacity, letting users see the game through the overlay.                                                    |

---

## Tier 3 — Lower Priority, Longer Term

| Idea                                | Description                                                                                                                                  |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Multi-Tab Browsing**              | Open multiple pages in separate tabs within the popup, with a tab strip to switch between them.                                              |
| **Bookmark Sync**                   | Optional cloud sync of bookmarks across multiple Steam Decks or devices. Requires a backend or integration with an existing sync service.    |
| **Bookmark Import/Export**          | Import bookmarks from a browser export file (HTML or JSON) and export Portal bookmarks for backup or sharing.                                |
| **Ad Blocking / Content Filtering** | Basic ad or tracker blocking within the embedded browser. Complex legally and technically.                                                   |
| **Desktop Mode Integration**        | Allow Portal to function in Desktop Mode, not just Game Mode. May require a different rendering approach.                                    |
| **Notification Badge**              | Show a small badge on the minimised indicator when something notable happens in the page (e.g., a stream goes live, a chat message arrives). |
| **Custom User Scripts**             | Let advanced users inject custom CSS or JavaScript into loaded pages for personalisation or compatibility fixes.                             |
| **Subtitle / Caption Sizing**       | Allow users to increase subtitle/caption font size when video is fullscreened inside the popup.                                              |
| **Now Playing Widget**              | A small, always-visible widget (separate from the popup) that shows the title and status of the current media.                               |

---

## Tier 4 — Aspirational / Research

| Idea                                    | Description                                                                                                                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Picture-in-Picture Video Extraction** | Extract just the raw video stream from a page and render it without any webpage UI. Would provide the cleanest viewing experience but is technically very challenging, especially with DRM content. |
| **Phone Companion App**                 | A lightweight app or web interface that lets users control Portal from their phone — enter URLs, manage bookmarks, type credentials, and control playback.                                          |
| **Voice Control**                       | Use the Steam Deck's microphone for voice commands ("pause", "open YouTube", "close").                                                                                                              |
| **Multi-Window**                        | Open more than one popup simultaneously (e.g., a stream and a chat window side by side).                                                                                                            |
| **Plugin Ecosystem**                    | Allow third-party "micro-plugins" within Portal that add support for specific sites or features.                                                                                                    |

---

## How Items Graduate

1. An idea starts here in the backlog.
2. When it's selected for work, a dedicated feature doc is created in `docs/features/`.
3. The feature doc goes through review and refinement.
4. Once the feature ships, it's removed from this list and referenced in release notes.

---

## Suggesting New Ideas

Anyone can add ideas to this document. Please include:

- A short, descriptive title.
- A one or two sentence description of what it does and why it's valuable.
- An honest assessment of which tier it belongs in.
