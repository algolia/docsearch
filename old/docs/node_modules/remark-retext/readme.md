# remark-retext [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov] [![Chat][chat-badge]][chat]

Bridge / mutate from [**remark**][remark] to [**retext**][retext].

## Installation

[npm][]:

```bash
npm install remark-retext
```

## Usage

Say we have the following file, `example.md`:

```markdown
## Hello guys!
```

And our script, `example.js`, looks as follows:

```javascript
var vfile = require('to-vfile')
var report = require('vfile-reporter')
var unified = require('unified')
var parse = require('remark-parse')
var stringify = require('remark-stringify')
var remark2retext = require('remark-retext')
var english = require('retext-english')
var equality = require('retext-equality')

unified()
  .use(parse)
  .use(
    remark2retext,
    unified()
      .use(english)
      .use(equality)
  )
  .use(stringify)
  .process(vfile.readSync('example.md'), function(err, file) {
    console.error(report(err || file))
  })
```

Now, running `node example` yields:

```text
example.md
  1:10-1:14  warning  `guys` may be insensitive, use `people`, `persons`, `folks` instead  gals-men  retext-equality

⚠ 1 warning
```

## API

### `origin.use(remark2retext, destination[, options])`

Either bridge or mutate from [**remark**][remark] ([MDAST][]) to
[**retext**][retext] ([NLCST][]).

###### `destination`

`destination` is either a parser or a processor.

If a [`Unified`][processor] processor is given, runs the destination
processor with the new NLCST tree, then, after running discards that
tree and continues on running the origin processor with the original
tree ([bridge-mode][bridge]).

If a parser (such as [**parse-latin**][latin], [**parse-english**][english],
or [**parse-dutch**][dutch]) is given, passes the tree to further
plug-ins (mutate-mode).

###### `options`

Passed to [`mdast-util-to-nlcst`][to-nlcst].

## Related

*   [`rehype-retext`](https://github.com/rehypejs/rehype-retext)
    — Transform HTML to [NLCST][]
*   [`remark-rehype`](https://github.com/remarkjs/remark-rehype)
    — Transform markdown to HTML
*   [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
    — Transform HTML to markdown
*   [`mdast-util-to-nlcst`][to-nlcst]
    — Underlying algorithm

## Contribute

See [`contributing.md` in `remarkjs/remarkj`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/remarkjs/remark-retext.svg

[travis]: https://travis-ci.org/remarkjs/remark-retext

[codecov-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-retext.svg

[codecov]: https://codecov.io/github/remarkjs/remark-retext

[chat-badge]: https://img.shields.io/gitter/room/remarkjs/Lobby.svg

[chat]: https://gitter.im/remarkjs/Lobby

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[mdast]: https://github.com/syntax-tree/mdast

[remark]: https://github.com/remarkjs/remark

[retext]: https://github.com/retextjs/retext

[processor]: https://github.com/unifiedjs/unified#processor

[bridge]: https://github.com/unifiedjs/unified#processing-between-syntaxes

[nlcst]: https://github.com/syntax-tree/nlcst

[latin]: https://github.com/wooorm/parse-latin

[english]: https://github.com/wooorm/parse-english

[dutch]: https://github.com/wooorm/parse-dutch

[to-nlcst]: https://github.com/syntax-tree/mdast-util-to-nlcst

[contributing]: https://github.com/remarkjs/remark/blob/master/contributing.md

[coc]: https://github.com/remarkjs/remark/blob/master/code-of-conduct.md
