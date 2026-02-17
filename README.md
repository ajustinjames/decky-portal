# Portal

Portal is a Decky Loader plugin that provides an in-game web portal for streaming, browsing, and media playback on Steam Deck.

![Portal placeholder screenshot](https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg)

## Background

I created this fork of decky-pip for myself due to enjoying the original but wanting some QOL features implemented.

## Installation

### Decky Store

This plugin is not available on the Decky Store, and will not be submitted. Decky homebrew has a pretty clear anti-ai code stance, and I respect their wishes. Please do not bother them about this policy.

### Manual Sideload

**Prerequisites:**
- Node >= 22 (see `.nvmrc`), pnpm >= 9
- Docker (used to build inside the Decky builder image)
- SSH enabled on your Steam Deck (`sudo systemctl enable --now sshd` in Desktop Mode)

**Steps:**

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Configure your Deck connection (deck.json)
3. Build and deploy:
   ```bash
   pnpm deck:builddeploy    # build inside Docker + deploy over SSH
   ```
   Or run the steps separately:
   - `pnpm deck:build` — builds the plugin inside Docker and packages a zip into `out/`
   - `pnpm deck:deploy` — copies the zip to your Deck over SSH, extracts it, and restarts plugin_loader

## Development

1. Install dependencies:
   - `pnpm install`
2. Build once:
   - `pnpm build`
3. Run in watch mode:
   - `pnpm watch`
4. Run quality checks:
   - `pnpm lint`
   - `pnpm format:check`
   - `pnpm test`

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
