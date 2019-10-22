# unist-util-visit-children [![Build Status][build-badge]][build-page] [![Coverage Status][coverage-badge]][coverage-page]

[Unist][] direct child visitor.

## Installation

[npm][]:

```bash
npm install unist-util-visit-children
```

## Usage

```javascript
var remark = require('remark')
var visitChildren = require('unist-util-visit-children')

var visit = visitChildren(console.log)

remark()
  .use(plugin)
  .processSync('Some _emphasis_, **importance**, and `code`.')

function plugin() {
  return transformer
  function transformer(tree) {
    visit(tree.children[0])
  }
}
```

Yields:

```js
{ type: 'text', value: 'Some ' }
{ type: 'emphasis',
  children: [ { type: 'text', value: 'emphasis' } ] }
{ type: 'text', value: ', ' }
{ type: 'strong',
  children: [ { type: 'text', value: 'importance' } ] }
{ type: 'text', value: ', and ' }
{ type: 'inlineCode', value: 'code' }
{ type: 'text', value: '.' }
```

## API

### `visit = visitChildren(visitor)`

Wrap [`visitor`][visitor] to be invoked for each child in the node given to
[`visit`][visit].

#### `function visitor(child, index, parent)`

Invoked if [`visit`][visit] is called on a parent node for each `child`
in `parent`.

#### `function visit(parent)`

Invoke the bound [`visitor`][visitor] for each child in `parent`
([`Node`][node]).

## Related

*   [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit)
    — Recursively walk over nodes
*   [`unist-util-visit-parents`](https://github.com/syntax-tree/unist-util-visit-parents)
    — Like `visit`, but with a stack of parents
*   [`unist-util-filter`](https://github.com/eush77/unist-util-filter)
    — Create a new tree with all nodes that pass a test
*   [`unist-util-map`](https://github.com/syntax-tree/unist-util-map)
    — Create a new tree with all nodes mapped by a given function
*   [`unist-util-remove`](https://github.com/eush77/unist-util-remove)
    — Remove nodes from a tree that pass a test
*   [`unist-util-select`](https://github.com/eush77/unist-util-select)
    — Select nodes with CSS-like selectors

## Contribute

See [`contributing.md` in `syntax-tree/unist`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/syntax-tree/unist-util-visit-children.svg

[build-page]: https://travis-ci.org/syntax-tree/unist-util-visit-children

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-visit-children.svg

[coverage-page]: https://codecov.io/github/syntax-tree/unist-util-visit-children?branch=master

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[visit]: #function-visitparent

[visitor]: #function-visitorchild-index-parent

[contributing]: https://github.com/syntax-tree/unist/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/unist/blob/master/code-of-conduct.md
