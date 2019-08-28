Hi (future) collaborator!

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Where to start?](#where-to-start)
- [Development workflow](#development-workflow)
  - [Requirements](#requirements)
  - [Build](#build)
  - [Serve](#serve)
  - [Test](#test)
  - [Docs](#docs)
  - [Release](#release)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Where to start?

Have a fix or a new feature? [Search for corresponding
issues][14] first then create a new
one.

# Development workflow

## Requirements

To run this project, you will need:

- Node.js >= v8.7.0, use nvm - [install
  instructions][15]
- Yarn 

## Build

`yarn run build` will build all files in `./dist`. This includes regular and
minified files for `<script>` inclusion, as well as classes for `import`ing.

The command itself is split into `yarn run build:js` and `yarn run build:css` if
you want to build a subset.

## Serve

You can have all this files served on localhost, along with live-reload, with
the `yarn run serve` command.

## Test

You can run all tests with `yarn run test`, and `yarn run test:watch` will run
them with auto-reload.

## Docs

The documentation lives in the `./docs` folder. You should start by installing
its dependencies with `cd ./docs && yarn install`. Then:

- `yarn docs:build` will build the docs website in `./docs/dist`.
- `yarn docs:serve` will do the same, but with live-reload enabled
- `yarn docs:deploy` will deploy the doc website manually

Refer to `./docs/README.md` for more information

## Release

`npm run release` will guide you through the release process. Note that you have
to use `npm` and not `yarn` for this one otherwise it won't deploy to npm.

[1]: #where-to-start
[2]: #development-workflow
[3]: #requirements
[4]: #launch
[5]: #local-build
[6]: #commit-message-guidelines
[7]: #revert
[8]: #type
[9]: #scope
[10]: #subject
[11]: #body
[12]: #footer
[13]: #releasing
[14]: https://github.com/algolia/docsearch/issues
[15]: https://github.com/creationix/nvm#install-script
