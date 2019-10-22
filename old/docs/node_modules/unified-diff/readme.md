# unified-diff [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

[Unified][] plugin to ignore unrelated messages.  Currently works in
PRs on Travis.

When working with natural language, having tools that check cumbersome
tasks can be very useful (think [alex][] or [retext][] plugins).  However,
natural language isn’t as strict as code.  Integrating natural language
checking in a CI often doesn’t work well due to false positives.
It’s possible to add a long list of exceptions, but this soon becomes
unmanageable.

This plugin solves that problem, when in Travis, by ignoring any
messages on unchanged lines.  When run outside Travis, this plugin
doesn’t do anything.

###### TODO

*   [ ] Add support for other CIs (ping if you want to work on this);
*   [ ] Add non-CI support (I’m not yet sure how though).

## Installation

[npm][npm-install]:

```bash
npm install unified-diff
```

## Usage

Say we have this `readme.md`.  Note the `an an`.

```md
This is an an example.
```

Then, someone creates a PR which adds the following diff:

```diff
diff --git a/readme.md b/readme.md
index 360b225..5a96b86 100644
--- a/readme.md
+++ b/readme.md
@@ -1 +1,3 @@
 This is an an example.
+
+Some more more text. A error.
```

We have some natural language checking in `lint.js`:

```js
var diff = require('unified-diff');
var vfile = require('to-vfile');
var unified = require('unified');
var markdown = require('remark-parse');
var stringify = require('remark-stringify');
var remark2retext = require('remark-retext');
var english = require('retext-english');
var repetition = require('retext-repeated-words');
var article = require('retext-indefinite-article');
var report = require('vfile-reporter');

vfile.read('readme.md', function (err, file) {
  if (err) throw err;

  unified()
    .use(markdown)
    .use(remark2retext, unified()
      .use(english)
      .use(repetition)
      .use(article)
    )
    .use(stringify)
    .use(diff)
    .process(file, function (err) {
      console.error(report(err || file));
      process.exit(err || file.messages.length ? 1 : 0);
    });
});
```

`lint.js` is hooked up to run on Travis in `.travis.yml` like so:

```yml
# ...
script:
- npm test
- node lint.js
# ...
```

When run in Travis, we’ll see the following printed on **stderr**(4).
Note that `an an` on L1 is not included because it’s unrelated to this
PR.

```txt
readme.md
   3:6-3:15  warning  Expected `more` once, not twice   retext-repeated-words      retext-repeated-words
  3:22-3:23  warning  Use `An` before `error`, not `A`  retext-indefinite-article  retext-indefinite-article

⚠ 2 warnings
```

As there are messages, the build exits with `1`, thus failing Travis.
The user sees this and amends the PR to the following:

```diff
diff --git a/readme.md b/readme.md
index 360b225..5a96b86 100644
--- a/readme.md
+++ b/readme.md
@@ -1 +1,3 @@
 This is an an example.
+
+Some more text. An error.
```

This time our lint task exits successfully, even though L1 would
normally emit an error, but it’s unrelated to the PR.

## API

### `processor.use(diff)`

Ignore messages emitted by plugins before `diff` for lines that did
not change.

There are no options.  If there’s a `TRAVIS_COMMIT_RANGE` environment
variable this plugin runs, otherwise it’s a noop.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/unifiedjs/unified-diff.svg

[travis]: https://travis-ci.org/unifiedjs/unified-diff

[codecov-badge]: https://img.shields.io/codecov/c/github/unifiedjs/unified-diff.svg

[codecov]: https://codecov.io/github/unifiedjs/unified-diff

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[alex]: https://github.com/wooorm/alex

[retext]: https://github.com/wooorm/retext/blob/master/doc/plugins.md#list-of-plugins
