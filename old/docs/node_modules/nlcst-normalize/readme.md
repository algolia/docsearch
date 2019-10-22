# nlcst-normalize [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Normalize a word for easier comparison, useful for [NLCST][nlcst].

## Installation

[npm][]:

```bash
npm install nlcst-normalize
```

## Usage

```js
var normalize = require('nlcst-normalize')

normalize("Don't") // => 'dont'
normalize('Don’t') // => 'dont'
normalize('Don’t', {allowApostrophes: true}) // => 'don\'t'
normalize('Block-level') // => 'blocklevel'
normalize('Block-level', {allowDashes: true}) // => 'block-level'

normalize({
  type: 'WordNode',
  children: [
    {type: 'TextNode', value: 'Block'},
    {type: 'PunctuationNode', value: '-'},
    {type: 'TextNode', value: 'level'}
  ]
}) // => 'blocklevel'
```

## API

### `normalize(value[, options])`

Normalize a word (`string`, [`Node`][node], `Array.<Node>`) for easier
comparison.  Always normalises smart apostrophes (`’`) to straight
apostrophes (`'`) and lowercases alphabetical characters (`[A-Z]`).

###### `options.allowApostrophes`

`boolean`, default: `false` — Do not strip apostrophes (`'`).

###### `options.allowDashes`

`boolean`, default: `false` — Do not strip hyphens (`-`).

## Contribute

See [`contributing.md` in `syntax-tree/nlcst`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/nlcst-normalize.svg

[travis]: https://travis-ci.org/syntax-tree/nlcst-normalize

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/nlcst-normalize.svg

[codecov]: https://codecov.io/github/syntax-tree/nlcst-normalize

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[nlcst]: https://github.com/syntax-tree/nlcst

[node]: https://github.com/syntax-tree/unist#node

[contributing]: https://github.com/syntax-tree/nlcst/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/nlcst/blob/master/code-of-conduct.md
