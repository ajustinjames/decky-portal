# Portal

Portal is a Decky Loader plugin that adds a portable in-game web browser panel for streaming, media playback, and quick web access while gaming on Steam Deck.

![Portal screenshot placeholder](picture.jpg)

## Installation

### Decky Store (Not yet live)

1. Open Decky Loader on your Steam Deck.
2. Search for Portal.
3. Install and launch from the Quick Access menu.

### Manual sideload

Build the plugin and deploy it to your Deck using the workspace tasks documented in this repository.

## Development

1. Install dependencies:
   - `pnpm install`
2. Build once:
   - `pnpm build`
3. For iterative development:
   - `pnpm watch`
4. Deploy to Deck:
   - Use the VS Code tasks (`build`, `deploy`, or `builddeploy`) configured in this repo.

## Documentation

See the docs folder for detailed planning and architecture notes:

- [docs/README.md](docs/README.md)
- [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md)
- [docs/FUTURE_FEATURES.md](docs/FUTURE_FEATURES.md)

## License

BSD-3-Clause. See [LICENSE](LICENSE).

## Credits

- Original plugin and foundation: Ross Squires ([rossimo/decky-pip](https://github.com/rossimo/decky-pip))
- Portal rebrand and ongoing development: Aaron James
