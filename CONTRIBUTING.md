Hi (future) collaborator!

**tl;dr;**
- submit pull requests to master branch
- use [conventional changelog](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md) commit style messages
- squash your commits
- have fun

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Where to start?](#where-to-start)
- [Development workflow](#development-workflow)
  - [Local example](#local-example)
  - [Documentation website](#documentation-website)
- [Commit message guidelines](#commit-message-guidelines)
  - [Revert](#revert)
  - [Type](#type)
  - [Scope](#scope)
  - [Subject](#subject)
  - [Body](#body)
  - [Footer](#footer)
- [Stash your commits](#stash-your-commits)
- [When are issues closed?](#when-are-issues-closed)
- [Releasing](#releasing)
  - [Releasing v1](#releasing-v1)
  - [Beta releases](#beta-releases)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Where to start?

Have a fix or a new feature? [Search for corresponding issues](https://github.com/algolia/docsearch/issues) first then create a new one.

# Development workflow

## Local example

We use a simple documentation example website as a way to develop the docsearch.js library.

Requirements:
- [Node.js](https://nodejs.org/en/)
- npm@2

```sh
npm run dev
# open http://localhost:8080
```

## Documentation website

This is the [Jekyll](https://jekyllrb.com/) instance running at https://community.algolia.com/docsearch.

Requirements:
- [Ruby](https://www.ruby-lang.org/en/)
- [Bundler](http://bundler.io/)

```sh
yarn
npm run dev:docs
open http://localhost:4000/docsearch/
```

# Commit message guidelines

We use [conventional changelog](https://github.com/ajoslin/conventional-changelog) to generate our changelog from our git commit messages.

Here are the rules to write commit messages, they are the same than [angular/angular.js](https://github.com/angular/angular.js/blob/7c792f4cc99515ac27ed317e0e35e40940b3a400/CONTRIBUTING.md#commit-message-format).

Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

## Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

## Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

## Scope
The scope could be anything specifying place of the commit change. For example `RefinementList`,
`refinementList`, `rangeSlider`, `CI`, `url`, `build` etc...

## Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

## Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

## Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

# Stash your commits

Once you are done with a fix or feature and the review was done, [squash](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html) your commits to avoid things like "fix dangling comma in bro.js", "fix after review"

Example:
    - `feat(widget): new feature blabla..`
    - `refactor new feature blablabla...`
    - `fix after review ...`
  - **both commits should be squashed* in a single commit: `feat(widget) ..`

# When are issues closed?

Once the a fix is done, having the fix in the `master` branch is not sufficient, it needs to be part of a release for us to close the issue.

So that you never ask yourself "Is this released?".

Instead of closing the issue, we will add a `  to be released` label.

# Releasing

If you are a maintainer, you can release.

We use [semver](http://semver-ftw.org/).

You must be on the master branch.

```sh
npm run release
```

## Releasing v1

```sh
git checkout v1
git pull
npm run release
```

We use the `v1` branch as a way to push fixes to the first version of DocSearch. Do not merge `master` into `v1` and
vice versa.

## Beta releases

You must be on the master branch.

```sh
npm run release:beta
```

This task will release a beta version of what is currently in master branch.

It will not update the `latest` tag of the npm release nor update jsDelivr /2/.

## Documentation updates

If you have important documentation update to release without wanting to release
a new version of docsearch, you can do a documentation hotfix.

Then once the hotfix is merged into master, the documentation will be updated automatically.
