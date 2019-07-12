# Contributing

Welcome to the contributing guide for [DocSearch.js](https://yarnpkg.com/en/package/docsearch.js). Thanks for considering participating in our project.

If this guide does not contain what you are looking for and thus prevents you from contributing, don't hesitate to [open an issue](https://github.com/algolia/docsearch/issues/new).

###### Content

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Where to start](#where-to-start)
- [Development](#development)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Commands](#commands)
- [Documentation](#documentation)
  - [Commands](#commands-1)
- [Release](#release)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Where to start

- Found a bug in the library? [Check the issues](https://github.com/algolia/docsearch/issues/) and [open a new one](https://github.com/algolia/docsearch/issues/new) if it doesn't exist yet.
- Have a feature request? [Get in touch](https://github.com/algolia/docsearch/issues/)!
- Want to participate to the code? [Check the development workflow](#development-workflow).

## Development

### Requirements

To run this project, you will need:

- Node.js ≥ 10 – [nvm](https://github.com/creationix/nvm#install-script) is recommended
- [Yarn](https://yarnpkg.com)

### Setup

```
git clone https://github.com/algolia/docsearch
cd docsearch
yarn install
```

### Commands

#### `postinstall`

> This command is automatically run after the dependencies are installed.

It is necessary for Yarn workspaces to be aware of the EcmaScript builds to link the packages in the monorepo.

#### `build`

> This commands builds all the DocSearch packages in the monorepo into their own folders.

#### `watch`

> This commands builds all the DocSearch packages in the monorepo into their own folders in watch mode.

#### `test`

> This commands runs the tests for all packages.

You can refer to the [Jest CLI options](https://jestjs.io/docs/en/cli#options) to run specific packages or files.

#### `lint`

> This commands lints the source files.

#### `type-check`

> This commands type check the source files.

## Documentation

The documentation lives in the [`./docs`](docs/) folder. Start by installing its dependencies with `cd ./docs && yarn install`. Then:

### Commands

#### `docs:build`

> Builds the documentation website in `./docs/dist`.

#### `docs:serve`

> Runs the documentation build in watch mode.

#### `docs:deploy`

> Deploys the documentation website manually.

Refer to [`./docs/README.md`](./docs/README.md) for more information.

## Release

`npm run release` will guide you through the release process.

_Note that you have to use `npm` and not `yarn` for this command to publish on npm._
