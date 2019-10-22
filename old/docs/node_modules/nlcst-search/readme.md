# nlcst-search [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Search for patterns in an [NLCST][] tree.

## Installation

[npm][]:

```bash
npm install nlcst-search
```

## Usage

```js
var search = require('nlcst-search')
var toString = require('nlcst-to-string')

var tree = {
  type: 'SentenceNode',
  children: [
    {
      type: 'WordNode',
      children: [
        {type: 'TextNode', value: 'Don'},
        {type: 'PunctuationNode', value: '’'},
        {type: 'TextNode', value: 't'}
      ]
    },
    {type: 'WhiteSpaceNode', value: ' '},
    {
      type: 'WordNode',
      children: [{type: 'TextNode', value: 'do'}]
    },
    {type: 'WhiteSpaceNode', value: ' '},
    {
      type: 'WordNode',
      children: [
        {type: 'TextNode', value: 'Block'},
        {type: 'PunctuationNode', value: '-'},
        {type: 'TextNode', value: 'level'}
      ]
    }
  ]
}

search(tree, ['dont'], function(nodes) {
  console.log(toString(nodes))
})
// Don’t

search(tree, ['do blocklevel'], function(nodes) {
  console.log(toString(nodes))
})
// do Block-level
```

## API

### `search(node, patterns, handler[, allowApostrophes|options])`

Search for patterns in an NLCST tree.

##### Throws

`Error` — When not given `node` or `patterns`.

##### Parameters

###### `node`

Tree to search in ([`Node`][node]).

###### `patterns`

Patterns to search for (`Array.<string>` or `Object`).
If an `Object`, uses its keys as patterns.
Each pattern is a space-delimited list of words, where each word is
[normalize][]d to remove casing, apostrophes, and dashes.
Spaces in a pattern mean zero or more white space nodes in the tree.
Instead of a word, it’s also possible to use a wildcard symbol (`*`, an
asterisk), that matches any word in a pattern (`alpha * charlie`).

###### `handler`

Handler invoked when a match is found ([`Function`][fn-handler]).

###### `allowApostrophes`

Treated as `options.allowApostrophes`.

###### `options.allowApostrophes`

Passed to [`nlcst-normalize`][normalize] (`boolean`, default: `false`).

###### `options.allowDashes`

Passed to [`nlcst-normalize`][normalize] (`boolean`, default: `false`).

###### `options.allowLiterals`

Include [literal][] phrases (`boolean`, default: `false`).

## `function handler(nodes, index, parent, pattern)`

Handler invoked when a match is found.

##### Parameters

###### `nodes`

List of siblings which match `pattern` ([`Array.<Node>`][node]).

###### `index`

Position at which the match starts in `parent` (`number`).

###### `parent`

Parent node of `nodes` ([`Node`][node]).

###### `pattern`

The matched pattern (`string`).

## Contribute

See [`contributing.md` in `syntax-tree/nlcst`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/nlcst-search.svg

[travis]: https://travis-ci.org/syntax-tree/nlcst-search

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/nlcst-search.svg

[codecov]: https://codecov.io/github/syntax-tree/nlcst-search

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[nlcst]: https://github.com/syntax-tree/nlcst

[node]: https://github.com/syntax-tree/unist#node

[literal]: https://github.com/syntax-tree/nlcst-is-literal

[normalize]: https://github.com/syntax-tree/nlcst-normalize

[fn-handler]: #function-handlernodes-index-parent-pattern

[contributing]: https://github.com/syntax-tree/nlcst/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/nlcst/blob/master/code-of-conduct.md
