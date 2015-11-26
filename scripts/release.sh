#!/usr/bin/env bash

set -e # exit when error

mversion "${SEMVER_TOKEN:-PLEASE_PROVIDE_A_SEMVER_TOKEN_LIKE_MAJOR_MINOR_PATCH}"
conventional-changelog -p angular -i CHANGELOG.md -w
doctoc --maxlevel 3 README.md
git commit -am "$(json version < package.json)"
git push origin master
git push origin --tags
npm publish
