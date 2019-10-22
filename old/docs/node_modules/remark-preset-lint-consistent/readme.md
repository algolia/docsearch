<!--This file is generated-->

# remark-preset-lint-consistent

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

remark preset to configure `remark-lint` with settings that enforce
consistency.

## Rules

This preset configures [`remark-lint`](https://github.com/remarkjs/remark-lint) with the following rules:

| Rule | Setting |
| ---- | ------- |
| [`blockquote-indentation`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-blockquote-indentation) | `'consistent'` |
| [`checkbox-character-style`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-checkbox-character-style) | `'consistent'` |
| [`code-block-style`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-code-block-style) | `'consistent'` |
| [`emphasis-marker`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-emphasis-marker) | `'consistent'` |
| [`fenced-code-marker`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-fenced-code-marker) | `'consistent'` |
| [`heading-style`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-heading-style) | `'consistent'` |
| [`link-title-style`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-link-title-style) | `'consistent'` |
| [`list-item-content-indent`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-list-item-content-indent) |  |
| [`ordered-list-marker-style`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-ordered-list-marker-style) | `'consistent'` |
| [`rule-style`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-rule-style) | `'consistent'` |
| [`strong-marker`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-strong-marker) | `'consistent'` |
| [`table-cell-padding`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-table-cell-padding) | `'consistent'` |

## Install

[npm][]:

```sh
npm install remark-preset-lint-consistent
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
+  "plugins": ["preset-lint-consistent"]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u preset-lint-consistent readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
+  .use(require('remark-preset-lint-consistent'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

[build-badge]: https://img.shields.io/travis/remarkjs/remark-lint/master.svg

[build]: https://travis-ci.org/remarkjs/remark-lint

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[coverage]: https://codecov.io/github/remarkjs/remark-lint

[downloads-badge]: https://img.shields.io/npm/dm/remark-preset-lint-consistent.svg

[downloads]: https://www.npmjs.com/package/remark-preset-lint-consistent

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-preset-lint-consistent.svg

[size]: https://bundlephobia.com/result?p=remark-preset-lint-consistent

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/master/contributing.md

[support]: https://github.com/remarkjs/.github/blob/master/support.md

[coc]: https://github.com/remarkjs/.github/blob/master/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/master/license

[author]: https://wooorm.com
