# Portal

Portal is a [Decky Loader](https://decky.xyz/) plugin that provides an in-game web portal for streaming, browsing, and media playback on Steam Deck.

![Portal placeholder screenshot](https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg)

## Background

I created this fork of [decky-pip](https://github.com/rossimo/decky-pip) for myself due to enjoying the original but wanting some QOL features implemented.

> **Note:** This plugin is not available on the Decky Store. Decky Homebrew has a clear anti-AI-code stance, and I respect their wishes. Please do not bother them about this policy.

## Installation

Portal must be sideloaded manually. You can either install a pre-built release or build from source.

**Both methods require:**
- [Decky Loader](https://decky.xyz/) installed on your Steam Deck
- SSH enabled on your Steam Deck (`sudo systemctl enable --now sshd` in Desktop Mode) or manual downloading/copying of files

### Option 1 — Install a Pre-built Release (Recommended)

Download the latest release zip from [GitHub Releases](https://github.com/ajustinjames/decky-portal/releases) and copy it to your Deck.

1. Download `Portal.zip` from the [latest release](https://github.com/ajustinjames/decky-portal/releases/latest).
2. Copy the zip to your Steam Deck (via SCP, SFTP, KDE Connect, USB drive, etc.):
   ```bash
   scp Portal.zip deck@<DECK_IP>:/tmp/Portal.zip
   ```
3. SSH into your Deck and install the plugin:
   ```bash
   ssh deck@<DECK_IP>

   sudo mkdir -p ~/homebrew/plugins/Portal
   sudo bsdtar -xzpf /tmp/Portal.zip -C ~/homebrew/plugins/Portal --strip-components=1 --fflags
   sudo chown -R deck:deck ~/homebrew/plugins/Portal
   sudo systemctl restart plugin_loader
   rm /tmp/Portal.zip
   ```
4. Portal should now appear in the Decky quick access menu.

### Option 2 — Build from Source

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
