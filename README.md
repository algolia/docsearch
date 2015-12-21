# DocSearch

[![build status](https://travis-ci.org/algolia/docsearch.svg?branch=master)](http://travis-ci.org/algolia/docsearch)
[![NPM version](https://badge.fury.io/js/docsearch.js.svg)](http://badge.fury.io/js/docsearch.js)

We've created the fastest, easiest way to search within documentation. Check out our [website](https://community.algolia.com/docsearch/) to add an outstanding search to your documentation.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [Customization](#customization)
- [Development workflow](#development-workflow)
  - [Local example](#local-example)
  - [Documentation website](#documentation-website)
  - [MacOS](#macos)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- START documentation.md -->

## Introduction

We're scratching our own itch here. As developers, we spend a lot of time reading documentation, and it isn’t always easy to find the information we need.

Not blaming anyone here. Building a good search for a documentation is a complex challenge. We happen to have a lot of experience doing that, and we want to share it with the world. For free.

Just submit the form on the [community.algolia.com/docsearch/](https://community.algolia.com/docsearch/) website and we'll get back to you with what you need to integrate your new search into your website.

 1. We'll crawl your documentation pages,
 2. We'll configure your search experience,
 3. and you'll need to add the a small JS/CSS code snippet to your website.

## Setup

Once we've crawled your documentation website we'll send you the credentials you need to add the following code snippet to your website:

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/docsearch.js/0/docsearch.min.css" />
<script type="text/javascript" src="//cdn.jsdelivr.net/docsearch.js/0/docsearch.min.js"></script>
<script type="text/javascript">
docSearch({
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>'
});
</script>
```

## Customization

To customize the look & feel of the dropdown menu, you can either:

 * edit the color [variables](https://github.com/algolia/docsearch/blob/master/src/styles/_variables.scss) and rebuild this project CSS,
 * or override the colors like we did in [dev/docsearch-styling.css](https://github.com/algolia/docsearch/blob/master/dev/docsearch-styling.css).

<!-- END documentation.md -->
## Development workflow

### Local example

We use a simple documentation example website as a way to develop the docsearch.js library.

Requirements:
- [Node.js](https://nodejs.org/en/)
- npm@2

```sh
npm run dev
# open http://localhost:8080
```

### Documentation website

This is the [Jekyll](https://jekyllrb.com/) instance running at https://community.algolia.com/docsearch.

Requirements:
- [Ruby](https://www.ruby-lang.org/en/)
- [Bundler](http://bundler.io/)

```sh
npm run dev:docs
# open http://localhost:4000/docsearch/
```

### MacOS

If you are using `brew` and you had `brew install openssl`, you may need to configure the build path of eventmachine with

```sh
bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include
```
