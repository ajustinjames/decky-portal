# Feature: Media Controls (Play / Pause)

## Problem

When a video or stream is playing inside the popup, the only way to pause or resume playback is to interact directly with the webpage's own player controls. At PiP scale, those controls are tiny and difficult to tap accurately on the Steam Deck's touchscreen. There is no external play/pause mechanism.

---

## Goal

Provide a simple, accessible play/pause control that works regardless of popup size, so users can pause and resume media without struggling to hit small in-page buttons.

---

## User Stories

1. **As a user**, I want to tap a play/pause button on the popup's control bar to pause or resume the video I'm watching.
2. **As a user**, I want the play/pause button to reflect the current playback state (showing "pause" when playing, "play" when paused).
3. **As a user**, I want basic media controls to work across major streaming sites without extra configuration.

---

## Experience Outline

### Play / Pause Button
- A play/pause toggle button is included in the popup's touch control bar (see [Window Controls](WINDOW_CONTROLS.md)).
- The button displays a standard ▶ (play) or ⏸ (pause) icon based on the current state.
- Tapping the button sends a play or pause command to the video element in the embedded page.

### Placement
- The play/pause button sits alongside the window control buttons (minimise, expand, fullscreen video, close).
- It should be visually grouped with media-related actions and separated from window-management actions to avoid confusion.

### Feedback
- When playback is paused, the button shows the ▶ icon.
- When playback is active, the button shows the ⏸ icon.
- If no media is detected on the page, the button is hidden or disabled.

---

## Scope for v1

v1 focuses exclusively on **play / pause**. The following are explicitly deferred:

- Volume control
- Seek / scrub bar
- Skip forward / skip back
- Next episode / next video
- Playback speed control

These are captured in [Future Enhancements](#future-enhancements) below.

---

## Alternatives Considered

| Approach                                                  | Pros                                                                              | Cons                                                                             |
| --------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Inject play/pause via HTML5 Media API (chosen for v1)** | Standard API. Works with any `<video>` or `<audio>` element. Simple to implement. | May not work with some DRM players that override standard controls.              |
| **Simulate spacebar keypress in the embedded page**       | Many video players respond to spacebar for play/pause.                            | Not universal. Some sites use spacebar for other actions. Fragile.               |
| **Simulate click on the site's play/pause button**        | Works with the site's own logic including DRM.                                    | Requires per-site selectors. Breaks when sites update.                           |
| **Steam Deck hardware media keys**                        | No UI needed. Uses system-level controls.                                         | The Deck does not have dedicated media keys. Would require a custom key mapping. |
| **No external controls — rely on the page**               | Zero effort.                                                                      | Terrible UX at PiP scale. The core problem remains unsolved.                     |

---

## Site Compatibility

| Site            | Expected Behaviour                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **YouTube**     | Pause/resume the video player.                                                                   |
| **Twitch**      | Pause/resume the live stream (Twitch may show a "stream paused" overlay).                        |
| **Netflix**     | Pause/resume the current title.                                                                  |
| **Disney+**     | Pause/resume the current title.                                                                  |
| **Crunchyroll** | Pause/resume the current episode.                                                                |
| **Other sites** | Best-effort via standard HTML5 `<video>` API. If no media element is found, controls are hidden. |

---

## Edge Cases

- **Multiple media elements** — Target the largest or most prominent `<video>` element (same heuristic as fullscreen video).
- **Audio-only content** — The play/pause control should also work for `<audio>` elements (e.g., a podcast or music stream), though this is a secondary use case.
- **Autoplay restrictions** — Some sites require a user gesture before playback can start. The play button should satisfy this gesture requirement.
- **Ads** — On ad-supported content (YouTube free tier), play/pause should behave as the site intends (pausing the ad, not skipping it).

---

## Open Questions

> **Open Question:** Should there be a mute/unmute toggle alongside play/pause in v1, or is that deferred?

> **Open Question:** Should media state (playing/paused) persist across bookmark switches, or should each bookmark load fresh?

---

## Future Enhancements

- **Volume control** — a slider or +/- buttons for volume adjustment.
- **Mute / unmute toggle** — quick-mute without pausing.
- **Seek bar** — scrub through video content.
- **Skip buttons** — skip forward/back 10 or 30 seconds.
- **Next / Previous** — navigate to the next episode or video in a playlist.
- **Playback speed** — adjust speed (0.5×, 1×, 1.5×, 2×).
- **Now Playing indicator** — show the title of the currently playing content in the minimised indicator or sidebar.
- **System media integration** — if Steam OS ever exposes a media session API, hook into it for system-level controls.
