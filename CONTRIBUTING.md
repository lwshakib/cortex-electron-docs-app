# Contributing to Cortex Electron Docs

First off, thank you for considering contributing to Cortex! Projects like this thrive because of people like you.

This guide provides information on how you can help, whether it's through reporting bugs, suggesting features, or submitting code changes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [UI & UX Development](#ui--ux-development)
  - [Testing Guidelines](#testing-guidelines)
  - [Pull Request Process](#pull-request-process)
- [Development Setup](#development-setup)
- [Style Guides](#style-guides)

## Code of Conduct

This project and everyone participating in it is governed by the [Cortex Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as GitHub issues. When creating a bug report, please include:

- **Environment details**: Your OS and App Version.
- **Reproduction steps**: A clear list of steps to trigger the bug.
- **Screenshots/Gifs**: Visual evidence is extremely helpful.
- **Logs**: Any relevant console logs or terminal output.

### Suggesting Enhancements

We love new ideas! When suggesting an enhancement:

- Describe the **problem** the feature solves.
- Outline the **proposed solution** and user experience.
- Mention any **alternatives** you've considered.

### UI & UX Development

Cortex aims for a premium, high-end feel.

- **Styling**: We use [Tailwind CSS](https://tailwindcss.com/) for all styling. Avoid inline styles.
- **Components**: Leverage [Radix UI](https://www.radix-ui.com/) primitives for accessibility and reliability.
- **Icons**: Use [Lucide React](https://lucide.dev/) icons.
- **Animations**: Use `framer-motion` or CSS transitions for smooth micro-interactions.
- **Responsiveness**: Ensure UI elements adapt to window resizing.

### Testing Guidelines

We value stability. Please ensure your changes are covered by tests:

- **Unit Tests**: Use [Vitest](https://vitest.dev/) for testing utility functions and logic. `bun run test:unit`
- **Component Tests**: Use `@testing-library/react` for verifying UI behavior.
- **E2E Tests**: Use [Playwright](https://playwright.dev/) for critical user flows (e.g., creating and exporting a doc). `bun run test:e2e`

### Pull Request Process

1. **Fork** the repo and branch from `main`.
2. **Setup** the environment and ensure it builds.
3. **Implement** your changes, following the style guide.
4. **Add Tests** for new functionality or bug fixes.
5. **Run Linting**: `bun run lint` must pass.
6. **Update Docs**: If you change an API or add a user-facing feature, update the README or relevant docs.
7. **Submit PR**: Provide a clear description of your changes and link any related issues.

## Development Setup

### Prerequisites

- **Node.js**: v20 or higher
- **Bun**: Our primary package manager and task runner.

### Installation

```bash
git clone https://github.com/lwshakib/cortex-electron-docs-app.git
cd cortex-electron-docs-app
bun install
```

### Available Scripts

- `bun run dev`: Start the development server with HMR and Electron.
- `bun run build`: Compile the frontend and package the Electron app.
- `bun run lint`: Run ESLint checks.
- `bun run test:unit`: Execute Vitest unit tests.
- `bun run test:e2e`: Execute Playwright end-to-end tests.
- `bun run format`: Prettify the entire codebase.

## Style Guides

### Git Commit Messages

- Use the **imperative mood** ("Add feature" not "Added feature").
- Reference **issue numbers** (e.g., `feat: implement search highlighting (#12)`).
- Use conventional commits (feat, fix, docs, style, refactor, test, chore).

### TypeScript Style Guide

- Use **functional components** and hooks for React.
- Ensure all new files are strictly typed.
- Prefer `interface` over `type` for object definitions where possible.
- Group imports: React first, then external libraries, then internal components/utils.

## Questions?

Feel free to open a [Question](.github/ISSUE_TEMPLATE/question.md) issue or reach out to the maintainers on GitHub.
