# Portal

Portal is a Decky Loader plugin that provides an in-game web portal for streaming, browsing, and media playback on Steam Deck.

![Portal placeholder screenshot](https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg)

## Installation

### Decky Store (TBD)

1. Open Decky Loader on Steam Deck.
2. Search for **Portal**.
3. Install and open it from the Quick Access menu.

### Manual Sideload

1. Install dependencies:
   - `pnpm install`
2. Build the plugin:
   - `pnpm build`
3. Deploy to Deck from VS Code tasks:
   - `build`
   - `deploy`
   - `builddeploy`

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
