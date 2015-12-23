# DocSearch

The easiest way to add search to your documentation. For free.

Check out our [website][3] to add an outstanding search to your documentation.

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

![Eslint][4]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Introduction][5]
- [Setup][6]
- [Customization][7]
- [Development workflow][8]
  - [Local example][9]
  - [Documentation website][10]
  - [MacOS][11]

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- START documentation.md -->

## Introduction

We're scratching our own itch here. As developers, we spend a lot of time reading documentation, and it isn't always easy to find the information we need.

Not blaming anyone here. Building a good search for a documentation is a complex challenge. We happen to have a lot of experience doing that, and we want to share it with the world. For free.

Just submit the form on the [website][12] and we'll get back to you with what you need to integrate your new search into your website.

 1. We'll crawl your documentation pages,
 2. We'll configure your search experience,
 3. You'll need to add a bit of JavaScript and CSS code to your website.

## Setup

Once we've crawled your documentation website we'll send you the credentials you need to add the following code snippet to your website:

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/docsearch.js/0/docsearch.min.css" />
<script type="text/javascript" src="//cdn.jsdelivr.net/docsearch.js/0/docsearch.min.js"></script>
<script type="text/javascript">
docsearch({
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>'
});
</script>
```

## Customization

The default colorscheme is blue and gray:

![Default colorscheme][13]

To update the colors to suit your website, you just need to override a few
colors. Here is an example of a CSS file that you can use as a basis and that
sets white and purples colors.

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

Advanced users can also clone the repository, edit the [_variables.scss][14]
file and re-build the CSS file using `npm run build:css`.

<!-- END documentation.md -->

## Development workflow

### Local example

We use a simple documentation example website as a way to develop the docsearch library.

Requirements:
- [Node.js][17]
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

### Documentation website

This is the [Jekyll][18] instance running at [https://community.algolia.com/docsearch](https://community.algolia.com/docsearch).

Requirements:
- [Ruby][19]
- [Bundler][20]

```sh
npm run dev:docs
# open http://localhost:4000/docsearch/
# Note that it also implicitly starts another server on localhost:8080, to load
the bundled JavaScript from
```

### MacOS

If you are using `brew` and you had `brew install openssl`, you may need to configure the build path of eventmachine with

```sh
bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include
```


[1]: https://travis-ci.org/algolia/docsearch.svg?branch=master
[2]: https://badge.fury.io/js/docsearch.js.svg
[3]: https://community.algolia.com/docsearch/
[4]: ./docs/img/showcase/example-eslint.gif
[5]: #introduction
[6]: #setup
[7]: #customization
[8]: #development-workflow
[9]: #local-example
[10]: #documentation-website
[11]: #macos
[12]: https://community.algolia.com/docsearch/
[13]: ./docs/img/default-colorscheme.png
[14]: https://github.com/algolia/docsearch/blob/master/src/styles/_variables.scss
[15]: https://github.com/algolia/docsearch/blob/master/dev/docsearch-styling.css
[16]: https://github.com/algolia/docsearch/blob/master/src/styles/_variables.scss
[17]: https://nodejs.org/en/
[18]: https://jekyllrb.com/
[19]: https://www.ruby-lang.org/en/
[20]: http://bundler.io/
