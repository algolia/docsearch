# nlcst-to-string [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Stringify [NLCST][].

## Installation

[npm][]:

```bash
npm install nlcst-to-string
```

## Usage

```javascript
var toString = require('nlcst-to-string')

console.log(
  toString({
    type: 'WordNode',
    children: [
      {type: 'TextNode', value: 'AT'},
      {type: 'PunctuationNode', value: '&'},
      {type: 'TextNode', value: 'T'}
    ]
  })
) // => 'AT&T'
```

## API

### `toString(node[, separator])`

Stringify the given [NLCST][] node (or list of nodes).

###### Parameters

*   `node` ([`NLCSTNode`][nlcst] or `Array.<NLCSTNode>`)
*   `separator` (`string`, optional, default: `''`)
    — Value to separate each item with

###### Returns

`string`.

## Contribute

See [`contributing.md` in `syntax-tree/nlcst`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/nlcst-to-string.svg

[travis]: https://travis-ci.org/syntax-tree/nlcst-to-string

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/nlcst-to-string.svg

[codecov]: https://codecov.io/github/syntax-tree/nlcst-to-string

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[nlcst]: https://github.com/syntax-tree/nlcst

[contributing]: https://github.com/syntax-tree/nlcst/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/nlcst/blob/master/code-of-conduct.md
