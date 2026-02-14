# Decky Portal — Documentation

> **Portal** is a fork of the [Picture in Picture](https://github.com/rossimo/decky-pip) plugin for Steam Deck, overhauled to be a full-featured in-game web browser companion.

## What is Portal?

Portal lets Steam Deck users open websites — YouTube, Twitch, Netflix, and more — in a floating popup window while gaming. The original plugin provided the basic building blocks. This overhaul aims to turn it into a polished, daily-driver experience.

---

## Documentation Index

### Core

| Document                                | Description                                                   |
| --------------------------------------- | ------------------------------------------------------------- |
| [Product Vision](VISION.md)             | Why Portal exists, who it's for, and guiding principles       |
| [Current State Audit](CURRENT_STATE.md) | What the forked plugin can do today and its known limitations |

### Engineering

| Document                                  | Description                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [Repo Improvements](REPO_IMPROVEMENTS.md) | Pre-Portal infrastructure, tooling, and housekeeping tasks that must be completed before feature work begins |
| [Testing Strategy](TESTING.md)            | Test framework selection, architecture, mocking strategy, and coverage targets                               |

### Feature Specs

| Document                                         | Description                                              |
| ------------------------------------------------ | -------------------------------------------------------- |
| [Bookmarks](features/BOOKMARKS.md)               | Save, organise, and quickly launch favourite websites    |
| [Window Controls](features/WINDOW_CONTROLS.md)   | Resize, expand, and minimise via on-screen touch targets |
| [Fullscreen Video](features/FULLSCREEN_VIDEO.md) | One-tap fullscreen for video content inside the popup    |
| [Media Controls](features/MEDIA_CONTROLS.md)     | Play, pause, and basic transport controls                |
| [Authentication](features/AUTHENTICATION.md)     | Easier and safer ways to sign into websites              |

### Roadmap & Policy

| Document                                        | Description                                                     |
| ----------------------------------------------- | --------------------------------------------------------------- |
| [Future Features & Roadmap](FUTURE_FEATURES.md) | Ideas, alternatives, and long-term backlog                      |
| [AI Code Policy](AI_CODE_POLICY.md)             | Policy governing the use of AI-assisted tooling in this project |

---

## Project Status

### Phase 0 — Repo Foundations (current)

Before any Portal feature work begins the repository must be brought up to a professional standard. This includes rebranding leftover references from the upstream fork, adding a linter and formatter, establishing a test framework, and creating a basic CI pipeline. The full checklist lives in [Repo Improvements](REPO_IMPROVEMENTS.md).

### Phase 1 — Core Feature Overhaul

Once foundations are in place, work begins on the five feature specs listed above. Features are delivered incrementally and each ships with its own tests.

### Phase 2 — Polish & Tier-1 Backlog

After the core overhaul, items from the [Future Features](FUTURE_FEATURES.md) Tier 1 list are prioritised for the next release cycle.

---

## How to Read These Docs

- **Feature specs** describe *what* and *why*, not *how*. They are deliberately non-technical so anyone on the team — designers, testers, product owners — can contribute.
- **Engineering docs** (Repo Improvements, Testing Strategy) are technical and aimed at contributors who will implement changes.
- **Alternatives** are captured inline in each feature doc so trade-offs stay close to the decision they inform.
- **Future Features** is a living document. Anything that isn't committed to the current overhaul lives there.

## Contributing to Docs

1. Keep language plain and jargon-free.
2. If a section grows beyond one screen, break it into its own file and link it here.
3. Tag open questions with `> **Open Question:**` blockquotes so they're easy to find.
4. Engineering checklists use `- [ ]` task syntax so progress is trackable at a glance.
