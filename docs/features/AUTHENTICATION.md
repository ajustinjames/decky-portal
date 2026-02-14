# Feature: Easier Website Authentication

## Problem

Signing into streaming services and other websites inside the embedded browser is one of the most painful parts of the current experience. Users must:

1. Navigate to the site's login page (by typing the URL or finding the sign-in link in a tiny embedded view).
2. Enter a username/email and password using the Steam Deck virtual keyboard.
3. Handle two-factor authentication prompts, CAPTCHA challenges, or "verify your identity" flows — all in a small popup.

This is slow, error-prone, and frustrating enough that many users avoid logging in entirely — limiting them to content that does not require an account.

---

## Goal

Reduce the friction of signing into websites so users can access their accounts on streaming services and other sites with minimal typing and fewer steps.

---

## User Stories

1. **As a user**, I want to sign into a streaming site using a code displayed on my TV/monitor (device-code flow) so I can type the code on my phone instead of the Deck.
2. **As a user**, I want to scan a QR code with my phone to authenticate so I don't have to type anything on the Deck.
3. **As a user**, I want my login sessions to persist between plugin restarts so I don't have to sign in every time.
4. **As a user**, I want a clear indication of whether I'm signed in or signed out on a given site.

---

## Experience Outline

### Session Persistence
- Login sessions (cookies) in the embedded browser should survive plugin restarts and Steam Deck reboots.
- This is the highest-impact, lowest-effort improvement — if sessions persist, users only need to endure the sign-in process once.

### Device-Code / TV-Code Flow Guidance
- Many streaming services (YouTube, Netflix, Disney+, Twitch) offer a "Sign in on TV" flow where the user:
  1. Visits a short URL (e.g., youtube.com/activate) on any device.
  2. Enters a code shown on the TV screen.
- Portal should surface this flow prominently:
  - When a user opens a streaming bookmark for the first time and is not signed in, show a hint: *"Tip: You can sign in from your phone at [site]/activate using the code shown on screen."*
  - Optionally, offer a "Sign in via code" button that navigates directly to the service's device-code page.

### QR Code Display
- For services that support QR-code-based login, ensure the QR code is rendered clearly and at a size large enough to scan — even if the popup is at PiP scale.
- Consider temporarily expanding the popup (or showing a modal) when a QR code is detected, then restoring the previous size after login completes.

### Virtual Keyboard Improvements
- When the virtual keyboard is needed (e.g., for a site without device-code flow), ensure:
  - The popup repositions to avoid being obscured by the keyboard (existing smart-avoidance logic).
  - The text input field in the webpage is scrolled into view.
  - The user can see what they're typing.

---

## Alternatives Considered

| Approach                                                       | Pros                                                                                        | Cons                                                                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Session persistence + device-code guidance (chosen for v1)** | Low friction. Uses flows the services already support. No credential storage by the plugin. | Device-code flow is not available on every site. User still needs another device.                                  |
| **Built-in password manager**                                  | Full sign-in automation.                                                                    | Enormous security responsibility. Storing credentials in a Decky plugin is a significant risk. Maintenance burden. |
| **Integration with system keychain / KeePass / Bitwarden**     | Leverages existing trusted credential stores.                                               | Significant integration complexity. SteamOS does not expose a standard keychain API to plugins.                    |
| **OAuth / SSO proxy**                                          | Could centralise authentication for multiple services.                                      | Requires a server-side component. Privacy and trust concerns. Out of scope.                                        |
| **"Sign in on Desktop mode first" guidance**                   | Zero development effort. Desktop Steam browser sessions may carry over.                     | Poor UX — asking users to leave Game Mode. Sessions may not actually share with the plugin's browser view.         |
| **Clipboard support for pasting passwords**                    | Reduces typing. Users copy from a phone/password manager.                                   | Steam Deck clipboard integration in plugin context may be unreliable. Still requires a second device.              |

---

## Security Considerations

- **No credential storage** — Portal does not store, transmit, or have access to usernames or passwords. Authentication is handled entirely within the embedded browser by the website itself.
- **Cookie storage** — Session cookies are stored locally by the embedded browser. They should be protected by standard file-system permissions.
- **No telemetry** — No browsing data, URLs, or session information is sent off-device.
- **Clear session option** — Users should have an option to clear all cookies/session data from the plugin's settings (a "Sign out of all sites" action).

---

## Site-Specific Notes

| Site            | Recommended Auth Flow                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- |
| **YouTube**     | Device code at youtube.com/activate                                                      |
| **Twitch**      | Device code at twitch.tv/activate                                                        |
| **Netflix**     | Device code at netflix.com/activate or netflix.com/tv8                                   |
| **Disney+**     | Device code at disneyplus.com/begin                                                      |
| **Crunchyroll** | Standard email/password login (no device-code flow known)                                |
| **Other**       | Standard login. Encourage users to use "Sign in with Google/Apple" for fewer keystrokes. |

---

## Open Questions

> **Open Question:** Does the embedded browser (Steam CEF) share cookies with the Desktop Mode browser, or is it an isolated context? This affects whether signing in once on Desktop Mode helps.

> **Open Question:** Can the plugin detect when a QR code is visible on the page and auto-enlarge it?

> **Open Question:** Should there be per-site "how to sign in" guides accessible from the bookmark list?

---

## Future Enhancements

- **QR code detection and auto-zoom** — automatically detect a QR code on the page and enlarge the popup to make scanning easier.
- **Phone companion pairing** — a lightweight companion app or web page that lets users type credentials on their phone and forward them to the Deck securely.
- **Biometric unlock** — if Steam Deck hardware ever supports fingerprint or face recognition, integrate with it for session unlock.
- **Per-site session management** — view and selectively clear sessions for individual sites rather than all-or-nothing.
- **Single Sign-On hints** — detect when a site offers "Sign in with Google" and prompt the user to use it for faster login, especially if they're already signed into Google on another bookmark.
