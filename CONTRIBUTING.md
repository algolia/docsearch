Hi (future) collaborator!

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Where to start?](#where-to-start)
- [Development workflow](#development-workflow)
  - [Requirements](#requirements)
  - [Launch](#launch)
  - [Local build](#local-build)
- [Commit message guidelines](#commit-message-guidelines)
  - [Revert](#revert)
  - [Type](#type)
  - [Scope](#scope)
  - [Subject](#subject)
  - [Body](#body)
  - [Footer](#footer)
- [Releasing](#releasing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Where to start?

Have a fix or a new feature? [Search for corresponding issues](https://github.com/algolia/docsearch/issues) first then create a new one.

# Development workflow

## Requirements

To run this project, you will need:

- Node.js >= v8.7.0, use nvm - [install instructions](https://github.com/creationix/nvm#install-script)
- [Ruby](https://www.ruby-lang.org/en/)
- [Bundler](http://bundler.io/)

## Build

`yarn run build` will build all files in `./dist`. This includes regular and
minified files for `<script>` inclusion, as well as classes for `import`ing.

The command itself is split into `yarn run build:js` and `yarn run build:css` if
you want to build only a subset.

## Serve

You can have all this files served on localhost, along with live-reload, with
the `yarn run serve` command.

## Test

You can run all tests with `yarn run test`, and `yarn run test:watch` will run
them with auto-reload.

## Docs

- `yarn docs:build` will build the docs website in `./docs/dist`.
- `yarn docs:serve` will do the same, but with live-reload enabled
- `yarn docs:lint` will check for linting errors in the doc website
- `yarn docs:deploy` will deploy the doc website

## Release

`npm run release` will guid you through the release process. Note that you have
to use `npm` and not `yarn` for this one otherwise it won't correctly deploy to
npm.

