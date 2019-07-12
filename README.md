<div align="center">

[![DocSearch][docsearch-logo]][docsearch-website]

The easiest way to add search to your documentation – for free.

[![npm version][docsearch-badge-npm]](https://npmjs.org/package/docsearch.js) [![build][docsearch-badge-travis]](https://travis-ci.org/algolia/docsearch) [![License][docsearch-badge-license]](./LICENSE) [![Downloads][docsearch-badge-downloads]](https://npm-stat.com/charts.html?package=docsearch.js) [![jsDelivr Hits][docsearch-badge-jsdelivr]](https://www.jsdelivr.com/package/npm/docsearch.js)

</div>

---

DocSearch crawls your documentation, pushes the content to an Algolia index and provides a dropdown search experience on your website.

Check out our [website][docsearch-website] for a complete explanation and documentation.

## Preview

[![Bootstrap demo][docsearch-preview]][docsearch-website]

## Usage

> Don't have your Algolia credentials yet? [Apply to DocSearch](https://community.algolia.com/docsearch/apply.html)!

**1.** Import the library as an EcmaScript module:

```sh
npm install docsearch.js
# or
yarn add docsearch.js
```

```js
import docsearch from 'docsearch.js';
```

**1–bis.** Or with a script tag:

```html
<!-- At the end of the `body` -->
<script src="https://cdn.jsdelivr.net/docsearch.js/3"></script>
```

**2.** Import the theme:

```html
<!-- In the `head` -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/docsearch-theme-light@3"
/>
```

**3.** Use the library:

```js
docsearch({
  apiKey: 'YOUR_API_KEY',
  indexName: 'YOUR_INDEX_NAME',
  container: '#searchbox',
});
```

**4.** [Customize the color scheme](https://community.algolia.com/docsearch/styling.html).

## Contributing

### `watch`

> This commands builds all the DocSearch packages in the monorepo into their own folders in watch mode.

### `test`

> This commands runs the tests for all the packages.

Please read our [contributing guide](CONTRIBUTING.md) to learn more.

## Related

DocSearch is made of 3 repositories:

- **[algolia/docsearch][docsearch-github]**: DocSearch.js source code and website.
- **[algolia/docsearch-configs][docsearch-configs-github]**: DocSearch website configurations that DocSearch powers.
- **[algolia/docsearch-scraper][docsearch-scraper-github]** DocSearch crawler that extracts data from your documentation.

## License

DocSearch.js is [MIT licensed][docsearch-license].

<!-- Links -->

[docsearch-logo]: ./.github/docsearch-logo.svg
[docsearch-preview]: ./.github/demo.gif
[docsearch-badge-npm]: https://img.shields.io/npm/v/docsearch.js.svg?style=flat-square
[docsearch-badge-travis]: https://img.shields.io/travis/algolia/docsearch/master.svg?style=flat-square
[docsearch-badge-license]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[docsearch-badge-downloads]: https://img.shields.io/npm/dm/docsearch.js.svg?style=flat-square
[docsearch-badge-jsdelivr]: https://data.jsdelivr.com/v1/package/npm/docsearch.js/badge
[docsearch-license]: LICENSE
[docsearch-website]: https://community.algolia.com/docsearch/
[docsearch-github]: https://github.com/algolia/docsearch
[docsearch-configs-github]: https://github.com/algolia/docsearch-configs
[docsearch-scraper-github]: https://github.com/algolia/docsearch-scraper
