<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [docsearch](#docsearch)
- [Usage](#usage)
- [Examples](#examples)
- [How do I get an `apiKey` and `indexName`?](#how-do-i-get-an-apikey-and-indexname)
- [How does it work?](#how-does-it-work)
- [Development workflow](#development-workflow)
  - [Local example](#local-example)
  - [Documentation website](#documentation-website)
  - [MacOS](#macos)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# docsearch

Add a search autocomplete to any documentation.

Currently on-demand, send an email to [docsearch@algolia.com](mailto:docsearch@algolia.com)
if you want documentation search on your website.

# Usage

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/docsearch.js/0/docsearch.min.css" />
<script src="//cdn.jsdelivr.net/docsearch.js/0/docsearch.min.js"></script>
```

```js
documentationSearch({
  apiKey: apiKey, // Mandatory
  indexName: indexName, // Mandatory
  inputSelector: '#search-input' // Mandatory
});
```

# Examples

- http://eslint.org/
- https://bootstrap.algolia.com/
- https://reactjs.algolia.com/
- https://babeljs.algolia.com/

# How do I get an `apiKey` and `indexName`?

Send us [an email](mailto:docsearch@algolia.com) with the url of
the documentation website you would like to add search to.

# How does it work?

The JavaScript library is a wrapper on top of our
[autocomplete.js](https://github.com/algolia/autocomplete.js) library, along
with default CSS styling of the dropdown.

The indexing of the website data itself is currently done by an internal tool (to be released).

Indexing of websites using docsearch takes places every day.

# Development workflow

## Local example

We use a simple documentation example website as a way to develop the docsearch.js library.

Requirements:
- [Node.js](https://nodejs.org/en/)
- npm@2
 
```sh
npm run dev
# open http://localhost:8080
```

## Documentation website

This is the [Jekyll](https://jekyllrb.com/) instance running at https://community.algolia.com/docsearch.

Requirements:
- [Ruby](https://www.ruby-lang.org/en/)
- [Bundler](http://bundler.io/)

```sh
npm run dev:docs
# open http://localhost:4000/docsearch/
```

## MacOS

If you are using `brew` and you had `brew install openssl`, you may need to configure the build path of eventmachine with

```sh
bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include
```
