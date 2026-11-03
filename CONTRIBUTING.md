# Contributing to DocSearch

Welcome to the contributing guide for DocSearch!

If this guide does not contain what you are looking for and thus prevents you from contributing, don't hesitate to leave a message on the [Discord](https://discord.gg/bRTacwYrfX) or to [open an issue](https://github.com/algolia/docsearch/issues).

## Reporting an issue

Opening an issue is very effective way to contribute because many users might also be impacted. We'll make sure to fix it quickly if it's technically feasible and doesn't have important side effects for other users.

Before reporting an issue, first check that there is not an already open issue for the same topic using the [issues page](https://github.com/algolia/docsearch/issues). Don't hesitate to thumb up an issue that corresponds to the problem you have.

Another element that will help us go faster at solving the issue is to provide a reproducible test case. We recommend to [use this CodeSandbox template](https://codesandbox.io/s/github/algolia/docsearch/tree/main/examples/demo).

## Code contribution

For any code contribution, you need to:

- Fork and clone the project
- Create a new branch for what you want to solve (fix/_issue-number_, feat/_name-of-the-feature_)
- Make your changes
- Open a pull request

Then:

- A team member will review the pull request
- Automatic checks will be run

When every check is green and a team member approves, your contribution is merged! 🚀

## Commit conventions

This project follows the [conventional changelog](https://conventionalcommits.org/) approach. This means that all commit messages should be formatted using the following scheme:

```
type(scope): description
```

In most cases, we use the following types:

- `fix`: for any resolution of an issue (identified or not)
- `feat`: for any new feature
- `refactor`: for any code change that neither adds a feature nor fixes an issue
- `docs`: for any documentation change or addition
- `chore`: for anything that is not related to the library itself (doc, tooling)

Even though the scope is optional, we try to fill it in as it helps us better understand the impact of a change.

Finally, if your work is based on an issue on GitHub, please add in the body of the commit message "fix #1234" if it solves the issue #1234 (read "[Closing issues using keywords](https://help.github.com/en/articles/closing-issues-using-keywords)").

Some examples of valid commit messages (used as first lines):

> - fix(searchbox): add `type` input property
> - chore(deps): update dependency rollup-plugin-babel to v3.0.7
> - fix(modal): increase default height
> - docs(contributing): reword release section

## Requirements

To run this project, you will need:

- Node.js ≥ 18 – [nvm](https://github.com/nvm-sh/nvm#install-script) is recommended
- [Bun](https://bun.sh) – our package manager and build tool

## Getting started

```sh
# Install dependencies
bun install

# Build all packages
bun run build

# Run tests
bun run test

# Start development mode (watch + playground)
bun run dev
```

## Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

If your PR includes changes that should be released, add a changeset:

```sh
bun run changeset
```

Select the packages affected by your change, choose the version bump type (major/minor/patch), and write a summary that will appear in the changelog.

## Release

Releases are prepared locally by a maintainer and published by CircleCI when the release PR is merged.

### 1. Add changesets

Every PR with changes that should be released includes a changeset (see [Changesets](#changesets)). Changesets stay in `.changeset/` on `main` until the next release.

### 2. Open the release PR

Requirements:

- You're listed in [`CODEOWNERS`](CODEOWNERS) and can push to the repository.
- The [GitHub CLI](https://cli.github.com) is installed and authenticated (`gh auth login`).
- You're on `main`, your working tree is clean, and `main` is up to date with `origin/main`.

Preview the release:

```sh
bun run version --dry-run
```

This prints the release branch, PR title and PR description without changing anything.

Then create the release PR:

```sh
bun run version
```

The script asks for confirmation, then:

1. Bumps package versions and updates the CHANGELOGs (`changeset version`).
2. Syncs the version in `@docsearch/react` and refreshes `bun.lock`.
3. Commits the changes to a `releases/<name>` branch and pushes it.
4. Opens a PR against `main` that lists each change and the version of each package.

The release name is the `@docsearch/react` version (for example `releases/v5.2.0`). If only packages outside the shared version are released, the name is built from those packages (for example `releases/cli-v0.0.3`).

### 3. Merge the release PR

Review the version bumps and CHANGELOG entries in the PR, then merge it.

### 4. Publish

When a PR from a `releases/*` branch is merged into `main`, the CircleCI `release` job:

1. Builds the packages.
2. Publishes them to npm and creates the git tags (`changeset publish`).
3. Creates a GitHub release for each package that shares the `@docsearch/react` version, using its CHANGELOG entry. GitHub releases are not created for `@docsearch/cli`, which is only published to npm.

Merges from other branches skip this job, so nothing is published until a release PR is merged.

### Versioning

All `@docsearch/*` packages except `@docsearch/cli` share the same version number (fixed versioning). `@docsearch/cli` is versioned on its own.
