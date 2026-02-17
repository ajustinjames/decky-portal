# Portal

Portal is a [Decky Loader](https://decky.xyz/) plugin that provides an in-game web portal for streaming, browsing, and media playback on Steam Deck.

![Portal placeholder screenshot](https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg)

## Background

I created this fork of [decky-pip](https://github.com/rossimo/decky-pip) for myself due to enjoying the original but wanting some QOL features implemented.

> **Note:** This plugin is not available on the Decky Store. Decky Homebrew has a clear anti-AI-code stance, and I respect their wishes. Please do not bother them about this policy.

## Installation

Portal must be sideloaded manually. You can install a pre-built release or build from source.

**All methods require [Decky Loader](https://decky.xyz/) installed on your Steam Deck.**

### Option 1 — Download Directly on Steam Deck (Recommended)

1. Switch to **Desktop Mode** on your Steam Deck.
2. Open a web browser and go to the [latest release](https://github.com/ajustinjames/decky-portal/releases/latest).
3. Download **Portal.zip** and note where it was saved (usually `~/Downloads`).
4. Switch back to **Gaming Mode**.
5. Open the **Quick Access Menu** (... button) and go to the **Decky** tab.
6. Tap the **settings icon** (gear) at the top, then choose **Install Plugin from ZIP File**.
7. Browse to the downloaded `Portal.zip` and select it.
8. Decky will install the plugin automatically. Portal should now appear in the Decky menu.

### Option 2 — Download on PC and Copy to Steam Deck

1. Download **Portal.zip** from the [latest release](https://github.com/ajustinjames/decky-portal/releases/latest) on your PC.
2. Copy `Portal.zip` to your Steam Deck using any of these methods:
   - **USB drive** — Copy to a USB drive, plug it into your Deck.
   - **KDE Connect** — Pair your PC and Deck on the same network and send the file.
   - **SMB / network share** — Access a shared folder from Dolphin on your Deck.
   - **MicroSD card** — Copy to a MicroSD card and insert it into the Deck.
3. Switch to **Gaming Mode** on your Steam Deck.
4. Open the **Quick Access Menu** (... button) and go to the **Decky** tab.
5. Tap the **settings icon** (gear) at the top, then choose **Install Plugin from ZIP File**.
6. Browse to where you copied `Portal.zip` and select it.
7. Decky will install the plugin automatically. Portal should now appear in the Decky menu.

### Option 3 — Build from Source

**Additional prerequisites:** Node >= 22 (see `.nvmrc`), pnpm >= 9, Docker

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/ajustinjames/decky-portal.git
   cd decky-portal
   pnpm install
   ```
2. Build the plugin zip:
   ```bash
   pnpm deck:build    # builds inside Docker and packages a zip into out/
   ```
3. Deploy to your Deck using one of these methods:

   **Automated deploy** (requires `deck.json` — see [Configuring deck.json](#configuring-deckjson)):
   ```bash
   pnpm deck:deploy         # deploy an already-built zip
   pnpm deck:builddeploy    # build + deploy in one step
   ```

   **Manual deploy** — copy `out/Portal.zip` to your Deck and follow the same steps from Option 1 above.

#### Configuring deck.json

The deploy script reads connection details from a `deck.json` file in the project root. Create one with your Deck's info:

```json
{
  "deckip": "192.168.1.100",
  "deckport": "22",
  "deckuser": "deck",
  "deckdir": "~"
}
```

This file is gitignored and will not be committed.

## Development

```bash
pnpm install          # install dependencies
pnpm build            # build with Rollup
pnpm watch            # build in watch mode
pnpm lint             # ESLint check
pnpm format:check     # Prettier check
pnpm test             # run tests
pnpm test:coverage    # run tests with coverage
```

## Documentation

Project documentation lives in [docs/](docs):

- [docs/README.md](docs/README.md)
- [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md)
- [docs/FUTURE_FEATURES.md](docs/FUTURE_FEATURES.md)
- [docs/VISION.md](docs/VISION.md)

## License

Portal is licensed under BSD-3-Clause. See [LICENSE](LICENSE).

## Attribution

- Original plugin foundation: Ross Squires ([rossimo/decky-pip](https://github.com/rossimo/decky-pip))
- Portal rebrand and ongoing development: Aaron James
