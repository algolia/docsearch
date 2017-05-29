![DocSearch](docs/img/docsearch-logo.png)

The easiest way to add search to your documentation. For free.

Check out our [website][1] to add an outstanding search to your documentation.

[![Version][version-svg]][package-url] [![Build Status][travis-svg]][travis-url] [![Coverage Status][coveralls-svg]][coveralls-url] [![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

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

![Eslint][7]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [Customization](#customization)
  - [Advanced styling](#advanced-styling)
- [Custom options](#custom-options)
  - [Autocomplete options](#autocomplete-options)
  - [Algolia options](#algolia-options)
- [Development workflow](#development-workflow)
  - [Local example](#local-example)
  - [Local build](#local-build)
  - [Documentation website](#documentation-website)
  - [MacOS](#macos)

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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js"></script>
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

#### transformData

If you want to modify the hits before displaying them you can make use of the
`transformData` option

var search = docsearch({
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>',
  transformData: function (hits) {
    // modify hits
    return hits;
  }
});

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

## Development workflow

### Local example

We use a simple documentation example website as a way to develop the docsearch
library.

Requirements:
- [Node.js][24]
- npm@2

```sh
npm run dev
# open http://localhost:8080
```

### Local build

- `npm run build:js:` will transpile all the JavaScript files inside `./dist`.
  We build a bundled (and bundled + minified) version for CDNs and another one
  for npm
- `npm run build:css` will convert the SCSS to CSS, along with sourcemaps and
  minified versions
- `npm run build:docs` will create the `./docs/documentation.md` file from the
  `README.md` file, to be displayed on the website.
- `npm run build` will run all three previous commands
- `npm run serve` will serve and watch the JavaScript and CSS files on
  [http://localhost:8080/](http://localhost:8080/). If port `8080` is already
  taken, it will choose an available port. Source files will also be available
  and watched in `./dist/`.

### Documentation website

This is the [Jekyll][25] instance running at
[https://community.algolia.com/docsearch](https://community.algolia.com/docsearch).

Requirements:
- [Ruby][26]
- [Bundler][27]

```sh
npm run dev:docs
# open http://localhost:4000/docsearch/
# Note that it also implicitly starts another server on localhost:8080, to load
# the bundled JavaScript from
```

### MacOS

If you are using `brew` and you had `brew install openssl`, you may need to
configure the build path of eventmachine with

```sh
bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include
```

<!-- START links -->

[1]: https://community.algolia.com/docsearch/
[2]: https://img.shields.io/npm/v/docsearch.js.svg?style=flat-square
[3]: https://img.shields.io/travis/algolia/docsearch/master.svg?style=flat-square
[4]: https://img.shields.io/coveralls/algolia/docsearch/master.svg?style=flat-square
[5]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[6]: https://img.shields.io/npm/dm/docsearch.js.svg?style=flat-square
[7]: https://community.algolia.com/docsearch/img/showcase/example-apiary.gif
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
[23]: https://www.algolia.com/doc/api-client/javascript/parameters/#overview
[24]: https://nodejs.org/en/
[25]: https://jekyllrb.com/
[26]: https://www.ruby-lang.org/en/
[27]: http://bundler.io/
[28]: https://github.com/algolia/docsearch-scraper

<!-- END links -->
