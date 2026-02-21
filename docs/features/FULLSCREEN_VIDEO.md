# Feature: Fullscreen Video

## Problem

When watching a stream or video on sites like Twitch, YouTube, or Netflix inside the popup, the site's full browser UI is visible — navigation bars, sidebars, chat panels, recommended videos, and player controls. This wastes a large portion of the already small popup window on non-video content.

Users want the video itself to fill the entire popup, but there is currently no way to trigger a site's native fullscreen mode from within the embedded browser view.

---

## Goal

Provide a single-tap action that maximises the video element within the popup, hiding the site's surrounding UI so the video fills the entire popup area — whether the popup is in PiP or expanded mode.

---

## User Stories

1. **As a user**, I want to tap a "fullscreen video" button on the popup so the video expands to fill the entire popup area.
2. **As a user**, I want to exit video-fullscreen and return to the normal webpage view with another tap.
3. **As a user**, I want this to work on major streaming sites (YouTube, Twitch, Netflix, Disney+, Crunchyroll) without manual configuration.
4. **As a user**, I want the fullscreen video action to be available in both PiP and expanded modes.

---

## Experience Outline

### Triggering Fullscreen Video
- A dedicated "fullscreen video" button appears in the popup's touch control bar.
- The icon should be distinct from the "expand window" action — expand makes the *window* larger; fullscreen video makes the *video* fill the window.
- Tapping the button instructs the embedded browser to trigger the video element's fullscreen API (or simulate a click on the site's native fullscreen button).

### Exiting Fullscreen Video
- Tapping the same button (now showing an "exit fullscreen" icon) restores the normal webpage view.
- Pressing Escape (if a keyboard is available) or the Steam/Back button should also exit video fullscreen.

### Visual Distinction
- **Expand Window** = the popup window grows to fill most of the screen (more real estate for the whole webpage).
- **Fullscreen Video** = the *video player within the page* goes fullscreen inside whatever size the popup currently is.
- These two actions can be combined: a user could expand the window *and* fullscreen the video for the largest possible viewing experience.

---

## Site Compatibility

| Site            | Expected Behaviour                                                                        |
| --------------- | ----------------------------------------------------------------------------------------- |
| **YouTube**     | Video player fills popup. Comments, sidebar, and header hidden.                           |
| **Twitch**      | Stream fills popup. Chat, navigation, and category info hidden.                           |
| **Netflix**     | Movie/episode fills popup. Browse UI hidden.                                              |
| **Disney+**     | Same as Netflix.                                                                          |
| **Crunchyroll** | Same as Netflix.                                                                          |
| **Other sites** | Best-effort. If a standard HTML5 `<video>` element is detected, attempt to fullscreen it. |

---

## Alternatives Considered

| Approach                                                                         | Pros                                                                                   | Cons                                                                                                 |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Trigger site's native fullscreen button via script injection (chosen for v1)** | Works with the site's own player, which handles DRM, subtitles, and quality correctly. | Fragile — sites change their DOM structure. Needs per-site selectors or heuristics.                  |
| **Use the HTML5 Fullscreen API on the `<video>` element**                        | Standard API. Works across sites without per-site logic.                               | May not work on DRM-protected content (Widevine). Some sites block programmatic fullscreen requests. |
| **CSS injection to hide non-video elements**                                     | Does not depend on fullscreen API support.                                             | Extremely fragile. Every site has different DOM structure. Maintenance nightmare.                    |
| **Intercept and override the page's player controls**                            | Full control over the playback experience.                                             | Enormous effort. Breaks on every site update. Poor DRM compatibility.                                |
| **"Theatre mode" URL parameters**                                                | Some sites (YouTube) support URL params like `?autoplay=1`.                            | Very limited site support. Does not truly fullscreen the video.                                      |
| **Do nothing — let users tap the site's own fullscreen button**                  | Zero development effort.                                                               | The button is tiny at PiP scale. Hard to tap. Poor user experience.                                  |

---

## Edge Cases

- **No video detected** — If the page does not contain a recognisable video element, the fullscreen video button should be hidden or disabled (greyed out with a tooltip).
- **Multiple videos on page** — Default to the largest or most prominent video element. If ambiguous, skip rather than guess wrong.
- **DRM content** — Some streaming services use encrypted media extensions. The fullscreen approach should not interfere with DRM playback. If direct API fullscreen fails, fall back to simulating a click on the site's fullscreen button.
- **Live streams vs. VOD** — Behaviour should be identical for both.

---

## Open Questions

> **Open Question:** Should the fullscreen video state be remembered per-bookmark? (e.g., always open Twitch in fullscreen video mode.)

> **Open Question:** How should subtitles / closed captions behave when video is fullscreened? (They should remain visible, but sizing may need adjustment.)

> **Open Question:** Should there be an option to auto-trigger fullscreen video when a page with a playing video is loaded?

---

## Future Enhancements

- **Auto-fullscreen on load** — detect a playing video and automatically trigger fullscreen without user action.
- **Per-site profiles** — store fullscreen preferences and selectors for each bookmark/domain.
- **Custom CSS/JS injection** — allow advanced users to provide their own scripts for unsupported sites.
- **Picture-in-Picture within Picture-in-Picture** — extract just the video stream and render it without any webpage UI at all (technically very challenging, listed as aspirational).
