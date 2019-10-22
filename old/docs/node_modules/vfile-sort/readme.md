# vfile-sort [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Sort [vfile][] messages by line/column.

## Installation

[npm][]:

```bash
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

See [`contributing.md` in `vfile/vfile`][contributing] for ways to get started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/vfile/vfile-sort.svg

[travis]: https://travis-ci.org/vfile/vfile-sort

[codecov-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-sort.svg

[codecov]: https://codecov.io/github/vfile/vfile-sort

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[vfile]: https://github.com/vfile/vfile

[contributing]: https://github.com/vfile/vfile/blob/master/contributing.md

[coc]: https://github.com/vfile/vfile/blob/master/code-of-conduct.md
