<div align="center">

[![DocSearch](.github/logo.svg)](https://docsearch.algolia.com)

The easiest way to add search to your documentation – for free.

[![Netlify Status](https://api.netlify.com/api/v1/badges/30eacc09-d4b2-4a53-879b-04d40aaea454/deploy-status)](https://app.netlify.com/sites/docsearch/deploys) [![npm version](https://img.shields.io/npm/v/@docsearch/js.svg?style=flat-square)](https://www.npmjs.com/package/@docsearch/js/v/alpha) [![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](./LICENSE)

<p align="center">
  <strong>
  <a href="https://docsearch.algolia.com">Documentation</a> •
  <a href="https://codesandbox.io/s/docsearchjs-v3-playground-z9oxj">JavaScript Playground</a> •
  <a href="https://codesandbox.io/s/docsearch-react-v3-playground-619yg">React Playground</a>
  </strong>
</p>

</div>

---

DocSearch crawls your documentation, pushes the content to an Algolia index and provides a dropdown search experience on your website.

## Preview

![Ask AI demo](packages/website/static/img/resources/askai_demo.gif)

## Usage

> Don't have your Algolia credentials yet? [Apply to DocSearch](https://docsearch.algolia.com/apply)!

### JavaScript

#### Installation

```sh
bun add @docsearch/js@4
# or
npm install @docsearch/js@4
```

If you don’t want to use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@docsearch/js@4"></script>
```

#### Get started

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

### React

#### Installation

```bash
bun add @docsearch/react@4
# or
npm install @docsearch/react@4
```

If you don’t want to use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@docsearch/react@4"></script>
```

#### Get started

DocSearch generates a fully accessible search box for you.

```jsx App.js
import { DocSearch } from '@docsearch/react';

import '@docsearch/css';

function App() {
  return (
    <DocSearch
      appId="YOUR_APP_ID"
      apiKey="YOUR_SEARCH_API_KEY"
      indices=["YOUR_ALGOLIA_INDEX"]
    />
  );
}

export default App;
```

## Styling

[Read documentation →](https://docsearch.algolia.com/docs/styling)

## Related projects

DocSearch is made of the following repositories:

- **[algolia/docsearch](https://github.com/algolia/docsearch)**: DocSearch source code.
- **[algolia/docsearch/packages/website](https://github.com/algolia/docsearch/tree/main/packages/website)**: DocSearch website and documentation.
- **[algolia/docsearch-configs](https://github.com/algolia/docsearch-configs)**: DocSearch websites configurations that DocSearch powers.
- **[algolia/docsearch-scraper](https://github.com/algolia/docsearch-scraper)**: DocSearch crawler that extracts data from your documentation.

## License

[MIT](LICENSE)
