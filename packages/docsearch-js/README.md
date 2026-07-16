# @docsearch/js

JavaScript package for [DocSearch](http://docsearch.algolia.com/), the best search experience for docs.

## Installation

```sh
npm install @docsearch/js@5
```

## Get started

If you don’t want to use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@docsearch/js@5"></script>
```

To get started, you need a [`container`](https://docsearch.algolia.com/docs/api#container) for your DocSearch component to go in. If you don’t have one already, you can insert one into your markup:

```html
<div id="docsearch"></div>
```

Then, insert DocSearch into it by calling the [`docsearch`](https://docsearch.algolia.com/docs/api) function and providing the container. It can be a [CSS selector](https://developer.mozilla.org/en-us/docs/web/css/css_selectors) or an [Element](https://developer.mozilla.org/en-us/docs/web/api/htmlelement).

Make sure to provide a [`container`](https://docsearch.algolia.com/docs/api#container) (for example, a `div`), not an `input`. DocSearch generates a fully accessible search box for you.

```js app.js
import docsearch from '@docsearch/js';

import '@docsearch/css';

docsearch({
  container: '#docsearch',
  appId: 'YOUR_APP_ID',
  indexName: 'YOUR_INDEX_NAME',
  apiKey: 'YOUR_SEARCH_API_KEY',
});
```

The default entry includes keyword search and Ask AI. Configure `askAi` or call `openAskAi()` on the returned instance when using Ask AI.

## Keyword-only entry

Use the `docsearch` subpath when your integration only needs keyword search. This entry excludes Ask AI code.

```js app.js
import docsearch from '@docsearch/js/docsearch';

import '@docsearch/css';

docsearch({
  container: '#docsearch',
  appId: 'YOUR_APP_ID',
  indexName: 'YOUR_INDEX_NAME',
  apiKey: 'YOUR_SEARCH_API_KEY',
});
```

For a standalone keyword-only script, load the explicit UMD file:

```html
<script src="https://cdn.jsdelivr.net/npm/@docsearch/js@5/dist/umd/docsearch.js"></script>
<script>
  window.docsearch({
    container: '#docsearch',
    appId: 'YOUR_APP_ID',
    indexName: 'YOUR_INDEX_NAME',
    apiKey: 'YOUR_SEARCH_API_KEY',
  });
</script>
```

Both UMD entries expose callable `window.docsearch`. Load only one of them: the package default loads the AI-capable `dist/umd/index.js`, while `dist/umd/docsearch.js` is keyword-only.

## Documentation

[Read documentation →](https://docsearch.algolia.com/docs/docsearch-v3)
