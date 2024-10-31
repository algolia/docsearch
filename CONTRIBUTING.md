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
- [Yarn](https://yarnpkg.com)

## Release

```sh
yarn run release
```

It will create a pull request for the next release. When it's reviewed, approved and merged, then CircleCI will automatically publish it to npm.
