# Decky Portal — Documentation

> **Portal** is a fork of the [Picture in Picture](https://github.com/rossimo/decky-pip) plugin for Steam Deck, overhauled to be a full-featured in-game web browser companion.

## What is Portal?

Portal lets Steam Deck users open websites — YouTube, Twitch, Netflix, and more — in a floating popup window while gaming. The original plugin provided the basic building blocks. This overhaul aims to turn it into a polished, daily-driver experience.

---

## Documentation Index

### Engineering

| Document                       | Description                                                            |
| ------------------------------ | ---------------------------------------------------------------------- |
| [Testing Strategy](TESTING.md) | Test framework selection, architecture, mocking strategy, and coverage |

### Feature Specs

| Document                                         | Description                                              |
| ------------------------------------------------ | -------------------------------------------------------- |
| [Bookmarks](features/BOOKMARKS.md)               | Save, organise, and quickly launch favourite websites    |
| [Fullscreen Video](features/FULLSCREEN_VIDEO.md) | One-tap fullscreen for video content inside the popup    |
| [Authentication](features/AUTHENTICATION.md)     | Easier and safer ways to sign into websites              |

### Policy

| Document                             | Description                                                     |
| ------------------------------------ | --------------------------------------------------------------- |
| [AI Code Policy](AI_CODE_POLICY.md) | Policy governing the use of AI-assisted tooling in this project |

---

## Project Status

Repo foundations (linting, formatting, testing, CI) are complete. Feature work is now in progress — see the feature specs above.

---

## How to Read These Docs

- **Feature specs** describe *what* and *why*, not *how*. They are deliberately non-technical so anyone on the team can contribute.
- **Engineering docs** are technical and aimed at contributors who will implement changes.
- **Alternatives** are captured inline in each feature doc so trade-offs stay close to the decision they inform.
