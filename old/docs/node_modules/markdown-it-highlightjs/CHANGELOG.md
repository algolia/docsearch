# [Changelog](http://keepachangelog.com/)

This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]

## [3.0.0] - 2017-02-26
* Update highlight.js. ([#2])
* Drop Babel. This drops support for Node.js versions that doesn't
  support ES6.

## [2.0.0] - 2015-06-29
* Also add the `hljs` class to indented code blocks (together with
  fenced code blocks). This new behavior can be disabled with the `code`
  option.
* Never automatically detect the language if a language was specified,
  even if not recognized.
* Add an `auto` option to control if fenced code without language should
  be automatically highlighted.

## [1.1.2] - 2015-05-25
* Update license format in `package.json`.

## [1.1.1] - 2015-03-27
* Ensure `hljs` class is set even if no language is given.

## [1.1.0] - 2015-03-17
* Add `hljs` class and `langPrefix` to code blocks.

## 1.0.0 - 2015-03-17
* Initial release.

[unreleased]: https://github.com/valeriangalliat/markdown-it-highlightjs/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/valeriangalliat/markdown-it-highlightjs/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/valeriangalliat/markdown-it-highlightjs/compare/v1.1.2...v2.0.0
[1.1.2]: https://github.com/valeriangalliat/markdown-it-highlightjs/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/valeriangalliat/markdown-it-highlightjs/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/valeriangalliat/markdown-it-highlightjs/compare/v1.0.0...v1.1.0

[#2]: https://github.com/valeriangalliat/markdown-it-highlightjs/pull/2
