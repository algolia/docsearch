![DocSearch](https://cdn.rawgit.com/algolia/docsearch/master/docs/img/docsearch-logo-horizontal_dark.svg)

The easiest way to add search to your documentation. For free.

Check out our [website][1] to add an outstanding search to your documentation.

[![Version][version-svg]][package-url] [![Build Status][travis-svg]][travis-url] [![Coverage Status][coveralls-svg]][coveralls-url] [![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url] [![jsDelivr Hits][jsdelivr-badge]][jsdelivr-url]

[version-svg]: https://img.shields.io/npm/v/docsearch.js.svg?style=flat-square
[package-url]: https://npmjs.org/package/docsearch.js
[travis-svg]: https://img.shields.io/travis/algolia/docsearch/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/algolia/docsearch
[coveralls-svg]: https://img.shields.io/coveralls/algolia/docsearch/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/algolia/docsearch?branch=docs%2Fbadges
[license-image]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/docsearch.js.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=docsearch.js
[docsearch-website]: https://community.algolia.com/docsearch/?utm_medium=social-owned&utm_source=GitHub&utm_campaign=docsearch%20repository
[docsearch-website-docs]: https://community.algolia.com/docsearch/documentation/?utm_medium=social-owned&utm_source=GitHub&utm_campaign=docsearch%20repository
[jsdelivr-badge]: https://data.jsdelivr.com/v1/package/npm/docsearch.js/badge
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/docsearch.js

![Bootstrap][7]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [Customization](#customization)
  - [Attribution](#attribution)
  - [Default styling](#default-styling)
  - [Advanced styling](#advanced-styling)
- [Custom options](#custom-options)
  - [Autocomplete options](#autocomplete-options)
  - [Docsearch Options](#docsearch-options)
  - [Algolia options](#algolia-options)
- [Contributions and development workflow](#contributions-and-development-workflow)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- START documentation -->

## Introduction

We're scratching our own itch here. As developers, we spend a lot of time
reading documentation, and it isn't always easy to find the information we need.

Not blaming anyone here. Building a good search for a documentation is a complex
challenge. We happen to have a lot of experience doing that, and we want to
share it with the world. For free.

Just submit the form on the [website][16] and we'll get back to you with what
you need to integrate your new search into your website.

 1. We'll crawl your documentation pages,
 2. We'll configure your search experience,
 3. You'll need to add a bit of JavaScript and CSS code to your website.

If you prefer to DIY, you can run the [scraper][28] in your own infra.

## Setup

Once we've crawled your documentation website we'll send you the credentials you
need to add the following code snippet to your website:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>
<script type="text/javascript">
docsearch({
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>'
});
</script>
```

You can also install docsearch via `npm`:

```sh
npm install --save docsearch.js
```

## Customization

### Attribution

We're happy to provide DocSearch free of charge for your site, and you're
welcome to customise that experience in a way that works for you; all we ask is
that Algolia be attributed within the search context. For example, in the
default implementation, we place a small "Search by Algolia" logo in the
corner. If you prefer to roll your own UX, you'll need to make sure that this
logo is included in your implementation as well.

### Default styling

The default colorscheme is white and gray:

![Default colorscheme][17]

To update the colors to suit your website, you just need to override a few
colors. Here is an example of a CSS file that you can use as a basis to
set white and purple colors.

```css
/* Bottom border of each suggestion */
.algolia-docsearch-suggestion {
  border-bottom-color: #3A3DD1;
}
/* Main category headers */
.algolia-docsearch-suggestion--category-header {
  background-color: #4B54DE;
}
/* Highlighted search terms */
.algolia-docsearch-suggestion--highlight {
  color: #3A33D1;
}
/* Highligted search terms in the main category headers */
.algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--highlight  {
  background-color: #4D47D5;
}
/* Currently selected suggestion */
.aa-cursor .algolia-docsearch-suggestion--content {
  color: #272296;
}
.aa-cursor .algolia-docsearch-suggestion {
  background: #EBEBFB;
}

/* For bigger screens, when displaying results in two columns */
@media (min-width: 768px) {
  /* Bottom border of each suggestion */
  .algolia-docsearch-suggestion {
    border-bottom-color: #7671df;
  }
  /* Left column, with secondary category header */
  .algolia-docsearch-suggestion--subcategory-column {
    border-right-color: #7671df;
    background-color: #F2F2FF;
    color: #4E4726;
  }
}
```

### Advanced styling

If you want to do heavy changes to the way results are displayed, you might find
it easier to directly edit the `scss` files in this repository.

[`_variables.scss`][18]
contains all the color, breakpoints and size definitions while
[`main.scss`][19]
holds the structure of the display.

You can regenerate the whole final `css` file from those `scss` files by running
`npm run build:css`. The resulting files will be found in `./dist/cdn/`.

All you have to do now is change the `link` tag that was loading the default
styling from our CDN, to one that is loading your newly compiled file.


## Custom options

DocSearch is a wrapper around the [autocomplete.js][20] library that gets its
results from the Algolia API. As such, you can use any options provided by
[autocomplete.js][21] and by the Algolia API.

### Autocomplete options

You can pass any options to the underlying `autocomplete` instance through
the`autocompleteOptions` parameter. You will find all `autocomplete` options in
its [own documentation][22].

You can also listen to `autocomplete` events through the `.autocomplete`
property of the `docsearch` instance.

```javascript
var search = docsearch({
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>',
  debug: true,
  autocompleteOptions: {
    // See https://github.com/algolia/autocomplete.js#options
    // For full list of options
  }
});

// See https://github.com/algolia/autocomplete.js#custom-events
// For full list of events
search.autocomplete.on('autocomplete:opened', function(e) {
  // Do something when the dropdown menu is opened
});
```

### Docsearch Options


#### handleSelected

We already bind the autocomplete:selected event inside the docsearch.
If you want to replace the default behavior you can pass the `handleSelected` option.

```javascript
var search = docsearch({
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>',
  handleSelected: function (input, event, suggestion) {
  }
});
```

#### queryHook

If you want modify the query before it is send to Algolia you can pass the `queryHook` option.

```javascript
var search = docsearch({
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>',
  queryHook: function (query) {
      return query + "_modified";
  }
});
```

#### transformData

If you want to modify the hits before displaying them you can make use of the
`transformData` option

```
var search = docsearch({
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>',
  transformData: function (hits) {
    // modify hits
    return hits;
  }
});
```

### Algolia options

You can also pass any specific option to the Algolia API to change the way
records are returned. You can pass any options to the Algolia API through
the `algoliaOptions` parameter.

```javascript
docsearch({
  appId: '<APP_ID>', // if you are running the crawler yourself
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>',
  algoliaOptions: {
    hitsPerPage: 10
  }
});
```

You will find all Algolia API options in its [own documentation][23].

<!-- END documentation -->

## Contributions and development workflow

See [CONTRIBUTING](./CONTRIBUTING.md)

<!-- START links -->

[1]: https://community.algolia.com/docsearch/
[2]: https://img.shields.io/npm/v/docsearch.js.svg?style=flat-square
[3]: https://img.shields.io/travis/algolia/docsearch/master.svg?style=flat-square
[4]: https://img.shields.io/coveralls/algolia/docsearch/master.svg?style=flat-square
[5]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[6]: https://img.shields.io/npm/dm/docsearch.js.svg?style=flat-square
[7]: ./docs/bootstrap-docsearch.gif
[8]: #introduction
[9]: #setup
[10]: #customization
[11]: #development-workflow
[12]: #local-example
[13]: #local-build
[14]: #documentation-website
[15]: #macos
[16]: https://community.algolia.com/docsearch/
[17]: https://community.algolia.com/docsearch/img/default-colorscheme.png
[18]: https://github.com/algolia/docsearch/blob/master/src/styles/_variables.scss
[19]: https://github.com/algolia/docsearch/blob/master/src/styles/main.scss
[20]: https://github.com/algolia/autocomplete.js
[21]: https://github.com/algolia/autocomplete.js
[22]: https://github.com/algolia/autocomplete.js#options
[23]: https://www.algolia.com/doc/api-reference/api-parameters/
[24]: https://nodejs.org/en/
[25]: https://jekyllrb.com/
[26]: https://www.ruby-lang.org/en/
[27]: http://bundler.io/
[28]: https://github.com/algolia/docsearch-scraper

<!-- END links -->
