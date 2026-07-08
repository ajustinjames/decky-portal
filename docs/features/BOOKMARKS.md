# Feature: Bookmarks

## Problem

Today, users must manually type a full URL every time they want to visit a site. There is no way to save, recall, or organise frequently visited pages. For a device where typing is cumbersome (virtual keyboard on a handheld), this is a significant friction point.

---

## Goal

Give users a fast, touch-friendly way to save websites they visit often and launch them in one or two taps.

---

## User Stories

1. **As a user**, I want to save the page I'm currently viewing as a bookmark so I can return to it later without retyping the URL.
2. **As a user**, I want to see a list of my saved bookmarks in the Quick Access sidebar so I can launch one quickly.
3. **As a user**, I want to rename a bookmark so I can recognise it at a glance (e.g., "Twitch – FavStreamer" instead of a raw URL).
4. **As a user**, I want to delete bookmarks I no longer need.
5. **As a user**, I want to reorder my bookmarks so my most-used sites are at the top.
6. **As a user**, I want a set of sensible default bookmarks pre-loaded on first install so I have something to start with (e.g., YouTube, Twitch, Netflix).

---

## Experience Outline

### Quick Access (v1 model)
- Up to **4 bookmarks** can be pinned ("starred") as quick-access slots.
- Pinned bookmarks appear in the Quick Access sidebar; tapping one loads it immediately in the popup, opening or restoring the portal if needed.
- Each entry shows a name/label and, when available, a favicon (cached icon → remote icon → generic glyph).

### Adding a Bookmark
- Bookmarks are added through the **Manage Bookmarks** menu with a name (optional — defaults to the site name) and a URL.
- Only `http(s)` URLs are accepted; bare hostnames like `youtube.com` are normalised automatically.
- Saving the currently viewed page in one tap was deferred out of v1 (see Future Enhancements; original story: #18).

### Managing Bookmarks
- The Manage Bookmarks menu lists all bookmarks and supports renaming, reordering, deleting (with confirmation), and toggling quick-access pins.
- Reordering is done via simple up/down actions — no drag-and-drop required on v1 (touchscreen drag on the Deck is unreliable in plugin UIs).

### Default Bookmarks
- On first launch (no existing bookmark data), a curated set of defaults is loaded:
  - YouTube
  - Twitch
  - Netflix
  - Crunchyroll
- Users can delete or modify these freely.

---

## Alternatives Considered

| Approach                                       | Pros                                                  | Cons                                                                                  |
| ---------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Flat bookmark list (chosen for v1)**         | Simple to use and build. Scales to dozens of entries. | No folders or categories — may feel limiting for power users.                         |
| **Folder / category system**                   | Better organisation for large collections.            | Adds complexity to the UI. Likely overkill for the typical use case (5–15 bookmarks). |
| **Tag-based filtering**                        | Flexible, no rigid hierarchy.                         | Unfamiliar UX for most users. Harder to navigate on a touchscreen.                    |
| **Frecency-based auto-sort**                   | Surfaces most-used bookmarks automatically.           | Users lose explicit control over order. Can feel unpredictable.                       |
| **Browser-style address bar with suggestions** | Combines URL entry and bookmarks in one field.        | Complex to build. Poor fit for the limited sidebar space.                             |

---

## Data & Persistence

- Bookmarks should be stored alongside existing settings (currently `localStorage`).
- Each bookmark record needs at minimum: an ID, a display name, and a URL.
- Storage format should be forward-compatible with potential future fields (icon, category, last-visited timestamp).

---

## Open Questions

> **Open Question:** Should there be a hard limit on the number of bookmarks? If so, what is a reasonable ceiling (50? 100?)?

> **Open Question:** Should bookmarks be exportable/importable (e.g., as a JSON file) to enable sharing or backup?

---

## Future Enhancements

- **Save current page** — one-tap "★" action to bookmark the page being viewed (deferred from v1; original story: #18).
- **Folders or categories** — allow grouping bookmarks (e.g., "Streaming", "Guides", "Social").
- **Favicon fetch** — automatically retrieve and display the site's icon for visual recognition.
- **Sync** — optional cloud backup/sync of bookmarks across devices (requires a backend; out of scope for v1).
- **Import from browser** — import bookmarks from a Chrome/Firefox export file.
- **Quick-launch shortcuts** — assign a specific bookmark to a gamepad shortcut for instant access.
