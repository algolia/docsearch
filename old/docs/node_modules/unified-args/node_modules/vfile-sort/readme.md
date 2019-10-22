# vfile-sort

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Sort [vfile][] messages.

*   First sorts by line/column: earlier messages come first
*   If two messages occurred at the same place, sorts fatal error before
    warnings, before info messages
*   Otherwise, uses `localeCompare` to compare `source`, `ruleId`, or finally
    `reason`

## Install

[npm][]:

```sh
npm install vfile-sort
```

## Usage

```js
var vfile = require('vfile')
var sort = require('vfile-sort')

var file = vfile()

file.message('Error!', {line: 3, column: 1})
file.message('Another!', {line: 2, column: 2})

sort(file)

console.log(file.messages.map(String))
// => ['2:2: Another!', '3:1: Error!']
```

## API

### `sort(file)`

Sort messages in the given [vfile][].

## Contribute

See [`contributing.md`][contributing] in [`vfile/.github`][health] for ways to
get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/vfile/vfile-sort.svg

[build]: https://travis-ci.org/vfile/vfile-sort

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-sort.svg

[coverage]: https://codecov.io/github/vfile/vfile-sort

[downloads-badge]: https://img.shields.io/npm/dm/vfile-sort.svg

[downloads]: https://www.npmjs.com/package/vfile-sort

[size-badge]: https://img.shields.io/bundlephobia/minzip/vfile-sort.svg

[size]: https://bundlephobia.com/result?p=vfile-sort

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/vfile

[npm]: https://docs.npmjs.com/cli/install

[contributing]: https://github.com/vfile/.github/blob/master/contributing.md

[support]: https://github.com/vfile/.github/blob/master/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile
