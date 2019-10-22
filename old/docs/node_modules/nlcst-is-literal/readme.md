# nlcst-is-literal [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Check if an [NLCST][] node is meant literally.  Useful if a tool wants to
exclude these values possibly void of meaning.

As an example, a spell-checker could exclude these literal words, thus not
warning about “monsieur”.

## Installation

[npm][]:

```bash
npm install nlcst-is-literal
```

## Usage

Say we have the following file, `example.txt`:

```text
The word “foo” is meant as a literal.

The word «bar» is meant as a literal.

The word (baz) is meant as a literal.

The word, qux, is meant as a literal.

The word — quux — is meant as a literal.
```

And our script, `example.js`, looks as follows:

```javascript
var vfile = require('to-vfile')
var unified = require('unified')
var english = require('retext-english')
var visit = require('unist-util-visit')
var toString = require('nlcst-to-string')
var literal = require('nlcst-is-literal')

var file = vfile.readSync('example.txt')
var tree = unified()
  .use(english)
  .parse(file)

visit(tree, 'WordNode', visitor)

function visitor(node, index, parent) {
  if (literal(parent, index)) {
    console.log(toString(node))
  }
}
```

Now, running `node example` yields:

```text
foo
bar
baz
qux
quux
```

## API

### `isLiteral(parent, index)`

Check if the node in `parent` at `position` is enclosed
by matching delimiters.

For example, `foo` is literal in the following samples:

*   `Foo - is meant as a literal.`
*   `Meant as a literal is - foo.`
*   `The word “foo” is meant as a literal.`

## Contribute

See [`contributing.md` in `syntax-tree/nlcst`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/nlcst-is-literal.svg

[travis]: https://travis-ci.org/syntax-tree/nlcst-is-literal

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/nlcst-is-literal.svg

[codecov]: https://codecov.io/github/syntax-tree/nlcst-is-literal

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[nlcst]: https://github.com/syntax-tree/nlcst

[contributing]: https://github.com/syntax-tree/nlcst/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/nlcst/blob/master/code-of-conduct.md
