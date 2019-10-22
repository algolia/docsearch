# retext-equality [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Warn about possible insensitive, inconsiderate language with
[**retext**][retext].

## Installation

[npm][]:

```bash
npm install retext-equality
```

## Usage

Say we have the following file, `example.txt`:

```text
He’s pretty set on beating your butt for sheriff.
```

And our script, `example.js`, looks like this:

```javascript
var vfile = require('to-vfile');
var report = require('vfile-reporter');
var unified = require('unified');
var english = require('retext-english');
var stringify = require('retext-stringify');
var equality = require('retext-equality');

unified()
  .use(english)
  .use(equality)
  .use(stringify)
  .process(vfile.readSync('example.txt'), function (err, file) {
    console.error(report(err || file));
  });
```

Now, running `node example` yields:

```text
example.txt
    1:1-1:4  warning  `His` may be insensitive, use `Their`, `Theirs`, `Them` instead           her-him       retext-equality
  1:31-1:37  warning  `master` / `slave` may be insensitive, use `primary` / `replica` instead  master-slave  retext-equality

⚠ 2 warnings
```

## API

### `retext().use(equality[, options])`

Adds warnings for possible insensitive, inconsiderate language to the
processed [virtual file][vfile]s.

##### `options`

###### `options.ignore`

`Array.<string>` — List of phrases _not_ to warn about

###### `options.noBinary`

`boolean`, default: `false` — Do not allow binary references.  By default
`he` is warned about unless it’s followed by something like `or she` or
`and she`.  When `noBinary` is `true`, both cases would be warned about.

## Contributing

Thanks, contributions are greatly appreciated!  :+1:  If you add new
patterns, add them in the YAML files in the [`script/`][script]
directory, and run `npm install` and then `npm test` to build
everything.

Please see the current patterns for inspiration.

## Rules

See [`rules.md`][rules] for a list of rules.

## Related

*   [`retext-passive`](https://github.com/wooorm/retext-passive)
    — Check passive voice
*   [`retext-profanities`](https://github.com/wooorm/retext-profanities)
    — Check for profane and vulgar wording
*   [`retext-simplify`](https://github.com/wooorm/retext-simplify)
    — Check phrases for simpler alternatives

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-equality.svg

[travis]: https://travis-ci.org/wooorm/retext-equality

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-equality.svg

[codecov]: https://codecov.io/github/wooorm/retext-equality

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[vfile]: https://github.com/wooorm/vfile

[script]: script

[rules]: rules.md
