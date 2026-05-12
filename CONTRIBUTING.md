# Contributing to Cortex

First off, thank you for considering contributing to Cortex! It's people like you that make open source such a fantastic community to learn, inspire, and create.

This document serves as a comprehensive guide for anyone looking to contribute to the Cortex project. By participating, you are expected to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

### 1. Fork the Repository
Navigate to the [Cortex repository](https://github.com/lwshakib/cortex) on GitHub and click the **"Fork"** button in the top right corner. This creates a copy of the repository in your personal GitHub account.

### 2. Clone Your Fork
Open your terminal and clone the repository you just forked to your local machine:
```bash
git clone https://github.com/YOUR-USERNAME/cortex.git
cd cortex
```

### 3. Setup the Upstream Remote
To keep your fork in sync with the original repository, you need to add it as an "upstream" remote:
```bash
git remote add upstream https://github.com/lwshakib/cortex.git
```
You can verify the new remote has been added by running:
```bash
git remote -v
```

### 4. Install Dependencies
Cortex is a monorepo managed with `pnpm`. Make sure you have `pnpm` v9+ installed.

Run the following command at the root of the project to install all dependencies for both the web and desktop applications:
```bash
pnpm install
```

## Making Changes

### 1. Create a Branch
Always create a new branch for your work. Never commit directly to the `main` branch. 

Use a descriptive branch name. We recommend following conventional branching patterns:
- `feat/your-feature-name` (For new features)
- `fix/your-bug-fix` (For bug fixes)
- `docs/your-doc-update` (For documentation changes)

```bash
git checkout -b feat/add-new-sidebar-button
```

### 2. Develop and Test Locally
You can spin up the development servers to test your changes.
```bash
# Starts both web and desktop environments
pnpm run dev
```

As you make your changes, ensure that you are adhering to the existing coding style.

### 3. Lint and Typecheck
Before committing, ensure your code passes all formatting, linting, and TypeScript compiler checks.
```bash
# Formats code using Prettier
pnpm run format

# Runs ESLint checks
pnpm run lint

# Runs TypeScript type checks
pnpm run typecheck
```

### 4. Commit Your Changes
We prefer [Conventional Commits](https://www.conventionalcommits.org/). This means your commit messages should look something like:
- `feat: add robust local search`
- `fix: resolve sidebar rendering issue`
- `docs: update setup instructions`

```bash
git add .
git commit -m "feat: your descriptive commit message"
```

## Submitting Your Work

### 1. Sync with Upstream
Before pushing your changes, ensure your branch is up to date with the original repository's main branch to avoid merge conflicts:
```bash
git fetch upstream
git rebase upstream/main
```

### 2. Push to Your Fork
Push your locally committed changes to your GitHub fork:
```bash
git push origin your-branch-name
```

### 3. Create a Pull Request (PR)
1. Go to your fork on GitHub.
2. Click the **"Compare & pull request"** button next to your recently pushed branch.
3. Fill out the Pull Request template provided. 
   - Write a clear and concise title.
   - Describe the changes you have made and the motivation behind them.
   - If it fixes an open issue, link the issue (e.g., "Closes #42").
4. Submit the Pull Request!

## Code Review Process
Once your PR is submitted, project maintainers will review your code. They may request changes or ask clarifying questions. 
To update your PR based on feedback, simply make the changes locally, commit them, and push them to your branch (`git push origin your-branch-name`). The PR will automatically update.

Thank you for your contribution!
