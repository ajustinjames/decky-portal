# Contributing to Decky Portal

Thank you for your interest in contributing to Decky Portal! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js >= 22 (see `.nvmrc`)
- pnpm >= 9
- A Steam Deck or development environment with Decky Loader

### Setting Up Development Environment

1. Clone the repository
   ```bash
   git clone {repo url}
   cd decky-portal
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Available Commands

```bash
pnpm build            # Build the plugin
pnpm lint             # Check code style
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
```

### Code Style

- **TypeScript**: Use strict TypeScript (`strict: true`)
- **Formatting**: Prettier with single quotes, trailing commas, 2-space indent, 100 char width
- **Linting**: ESLint rules must pass (unused vars allowed with `_` prefix)
- **Equality**: Use strict equality (`===`/`!==`) for all comparisons, especially enums

### Testing

- All new features should include tests
- Bug fixes should include regression tests
- Run `pnpm test` before committing
- Aim for 80% coverage (statements/functions/lines), 75% branches
- Tests use Vitest with happy-dom environment

### Architecture Notes

Please review `CLAUDE.md` for important architectural details:

- **JSX Configuration**: Uses `window.SP_REACT` (not standard React)
- **State Management**: cotton-box via `useGlobalState()` hook
- **Browser Integration**: Steam's internal BrowserView API
- **Screen Dimensions**: 854×534 (Steam Deck resolution)

## Making Changes

### Commit Messages

- Use clear, descriptive commit messages
- Start with a verb in present tense (e.g., "Add feature", "Fix bug", "Update docs")
- Reference issue numbers when applicable

Example:
```
Add URL history navigation

- Implement forward/back buttons
- Store history in global state
- Add keyboard shortcuts

Fixes #123
```

### Pull Request Process

1. **Before submitting**:
   - Run `pnpm lint:fix` and `pnpm format`
   - Run `pnpm test` and ensure all tests pass
   - Update documentation if needed
   - Test on actual hardware if possible

2. **Create Pull Request**:
   - Use the PR template
   - Provide a clear description of changes
   - Link related issues
   - Include screenshots/videos for UI changes
   - Disclose AI usage per the AI Code Policy

3. **Review Process**:
   - Address reviewer feedback
   - Keep PR focused on a single feature/fix
   - Rebase on main if needed

4. **After Approval**:
   - Squash commits if requested
   - PR will be merged by maintainers

## AI Code Policy

AI-generated code is permitted but must be reviewed. Please see `docs/AI_CODE_POLICY.md` for full details:

- ✅ AI code assistance is allowed (Copilot, ChatGPT, Claude, etc.)
- ✅ Must be reviewed and understood by contributor
- ✅ Must include tests and documentation
- ❌ AI-generated visual/audio assets are NOT allowed
- 📝 Disclose AI usage in PR description

## Types of Contributions

### Bug Reports

- Use the bug report template
- Include reproduction steps
- Provide system information (plugin version, Decky version, SteamOS version)
- Attach logs if applicable

### Feature Requests

- Use the feature request template
- Explain the problem you're trying to solve
- Describe your proposed solution
- Consider alternatives

### Documentation

- Fix typos, clarify explanations
- Add examples
- Update outdated information
- Improve code comments

### Code Contributions

- Bug fixes
- New features
- Performance improvements
- Refactoring
- Test coverage improvements

## Project Structure

```
decky-portal/
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── __mocks__/       # Test mocks
│   └── __tests__/       # Test setup
├── .github/             # GitHub templates and workflows
├── docs/                # Documentation
└── dist/                # Build output
```

## Questions?

- Open a [Discussion](https://github.com/ajames20/decky-portal/discussions)
- Check existing [Issues](https://github.com/ajames20/decky-portal/issues)
- Join the [Decky Discord](https://deckbrew.xyz/discord)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

Thank you for contributing to Decky Portal! 🎮
