# docsearch.js

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

Indexing of docsearch.js linked websites takes places every day.

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

This is the [Jekyll](https://jekyllrb.com/) instance running at https://community.algolia.com/docsearch.js.

Requirements:
- [Ruby](https://www.ruby-lang.org/en/)
- [Bundler](http://bundler.io/)

```sh
npm run dev:docs
# open http://localhost:4000/docsearch.js/
```

## MacOS

If you are using `brew` and you had `brew install openssl`, you may need to configure the build path of eventmachine with

```sh
bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include
```
