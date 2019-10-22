# markdown-it-highlightjs [![npm version](http://img.shields.io/npm/v/markdown-it-highlightjs.svg?style=flat-square)](https://www.npmjs.org/package/markdown-it-highlightjs)

> Preset to use [highlight.js] with [markdown-it].

[highlight.js]: https://highlightjs.org/
[markdown-it]: https://github.com/markdown-it/markdown-it

Usage
-----

```js
const md = require('markdown-it')()
  .use(require('markdown-it-highlightjs'), opts)

// All code blocks will be highlighted.
```

The `opts` object can contain:

Name   | Description                                                             | Default
-------|-------------------------------------------------------------------------|--------
`auto` | Whether to automatically detect language if not specified.              | `true`
`code` | Whether to add the `hljs` class to raw code blocks (not fenced blocks). | `true`
