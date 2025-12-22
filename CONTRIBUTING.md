# Contributing to Cortex Electron Docs

First off, thank you for considering contributing to Cortex Electron Docs App! It's people like you that make this tool better for everyone.

This guide provides information on how you can help, whether it's through reporting bugs, suggesting features, or submitting code changes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Request Process](#pull-request-process)
- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Available Scripts](#available-scripts)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [TypeScript/JavaScript Style Guide](#typescriptjavascript-style-guide)

## Code of Conduct

This project and everyone participating in it is governed by the [Cortex Electron Docs Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as GitHub issues. When creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title** for the issue.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or copy-pasteable snippets.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.
- **Include your OS details** (Windows, macOS, or Linux).

### Suggesting Enhancements

Enhancements are also tracked as GitHub issues.

- **Use a clear and descriptive title** for the issue.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior and explain which behavior you expected to see instead** and why.
- **Explain why this enhancement would be useful** to most users.
- **List some other tools or applications where this enhancement exists**, if applicable.

### Your First Code Contribution

Unsure where to begin? Look for "Good First Issue" labels in the issue tracker.

### Pull Request Process

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [Bun](https://bun.sh/) (Recommended package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lwshakib/cortex-electron-docs-app.git
   cd cortex-electron-docs-app
   ```
2. Install dependencies:
   ```bash
   bun install
   ```

### Project Structure

- `electron/`: Contains the main process code for Electron.
- `src/`: Contains the React/Frontend source code.
- `public/`: Static assets.
- `electron-builder.json5`: Configuration for packaging the app.

### Available Scripts

- `bun run dev`: Start the development server with HMR.
- `bun run build`: Build the frontend and package the Electron app.
- `bun run lint`: Run ESLint to check for code issues.
- `bun run preview`: Preview the production build.

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript/JavaScript Style Guide

- This project uses TypeScript. Ensure all new files are `.ts` or `.tsx`.
- We use ESLint for linting. Run `bun run lint` before committing.
- Use functional components and hooks for React.
- Leverage [Tailwind CSS](https://tailwindcss.com/) for styling.

## Questions?

Feel free to contact the maintainer at `lwshakib` on GitHub.
