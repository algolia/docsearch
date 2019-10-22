# retext-english [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status] [![Chat][chat-badge]][chat]

[Parser][] for [**unified**][unified].  Parses the English language to
an [**NLCST**][nlcst] syntax tree.

## Installation

[npm][]:

```bash
npm install retext-english
```

## Usage

```js
var unified = require('unified');
var english = require('retext-english');
var stringify = require('retext-stringify');
var emoji = require('retext-emoji');

process.stdin
  .pipe(unified())
  .use(english)
  .use(emoji, {convert: 'encode'})
  .use(stringify)
  .pipe(process.stdout);
```

## Table of Contents

*   [API](#api)
    *   [processor.use(english)](#processoruseenglish)
    *   [english.Parser](#englishparser)
*   [License](#license)

## API

### `processor.use(english)`

Configure the `processor` to read English text as input.

There is no configuration for the parser.

### `english.Parser`

Access to the [parser][] ([`wooorm/parse-english`][parse-english]).

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/retext.svg

[build-status]: https://travis-ci.org/wooorm/retext

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/retext.svg

[coverage-status]: https://codecov.io/github/wooorm/retext

[chat-badge]: https://img.shields.io/gitter/room/wooorm/retext.svg

[chat]: https://gitter.im/wooorm/retext

[license]: https://github.com/wooorm/retext/blob/master/LICENSE

[author]: http://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[unified]: https://github.com/wooorm/unified

[nlcst]: https://github.com/wooorm/nlcst

[parser]: https://github.com/wooorm/unified#processorparser

[parse-english]: https://github.com/wooorm/parse-english
