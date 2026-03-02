# @docsearch/sidepanel-js

JavaScript package for [DocSearch Sidepanel](http://docsearch.algolia.com/), a standalone Ask AI chat panel.

## Installation

```bash
npm install @docsearch/sidepanel-js
```

## Get started

If you don’t want to use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@docsearch/sidepanel-js@4"></script>
```

To get started, you need a [`container`](https://docsearch.algolia.com/docs/api#container) for your DocSearch Sidepanel component to go in. If you don’t have one already, you can insert one into your markup:

```html
<div id="docsearch-sidepanel"></div>
```

Then, insert DocSearch Sidepanel into it by calling the [`sidepanel`](https://docsearch.algolia.com/docs/api) function and providing the container. It can be a [CSS selector](https://developer.mozilla.org/en-us/docs/web/css/css_selectors) or an [Element](https://developer.mozilla.org/en-us/docs/web/api/htmlelement).

Make sure to provide a [`container`](https://docsearch.algolia.com/docs/api#container) (for example, a `div`).

```js app.js
import sidepanel from '@docsearch/sidepanel-js';

import '@docsearch/css/dist/sidepanel.css';

sidepanel({
  container: '#docsearch-sidepanel',
  indexName: 'YOUR_INDEX_NAME',
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_SEARCH_API_KEY',
  assistantId: 'YOUR_ASSISTANT_ID',
});
```

## Documentation

[Read documentation →](https://docsearch.algolia.com)
