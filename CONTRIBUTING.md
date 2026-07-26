# Contributing to CareerSathi

First off, thank you for considering contributing to CareerSathi. It's people like you that make this platform a great tool for underprivileged students to discover their career paths.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Development Workflow

### 1. Branch Naming Convention
Please use the following naming convention for branches:
- `feature/<issue-number>-<brief-description>` (e.g., `feature/12-add-resume-templates`)
- `bugfix/<issue-number>-<brief-description>` (e.g., `bugfix/34-fix-login-error`)
- `hotfix/<issue-number>-<brief-description>` (for urgent production fixes)
- `docs/<brief-description>` (for documentation updates)

### 2. Commit Message Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

Example: `feat(resume): add modern template export`

### 3. Pull Request Process
1. Ensure your code compiles without errors (`npm run build`).
2. Ensure there are no TypeScript or ESLint errors (`npm run lint`).
3. Ensure all tests pass (`npm run test`).
4. Update the documentation if you are adding a new feature.
5. Create a Pull Request against the `develop` branch.
6. A maintainer will review your code. Please address any comments promptly.

## Coding Standards
- **TypeScript**: Always define strict types. Avoid `any`.
- **React**: Use functional components and hooks. Memoize heavy components (`React.memo`).
- **Styling**: We use Material UI (MUI). Please use the provided theme tokens rather than hardcoding colors.
- **Backend**: Use Express with Zod validation. Keep controllers thin; put business logic in services.

## Setting up your local environment
Refer to the `README.md` for complete installation instructions.
