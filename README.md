# Documentation Search

Add a search autocomplete to your documentation.

# Usage

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/documentationsearch.js/0/documentationsearch.min.css" />
<script src="//cdn.jsdelivr.net/documentationsearch.js/0/documentationsearch.min.js"></script>
```

```javascript
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

# How do I get my `apiKey` and `indexName`?

Just send us [an email](mailto:documentationsearch@algolia.com) with the url of
the documentation you would like to search, and we'll this info back to you.

# How does it work?

The JavaScript library is a wrapper on top of our
[autocomplete.js](https://github.com/algolia/autocomplete.js) library, along
with default CSS styling of the dropdown.

The indexing of the data itself is currently done by an internal tool (we will
release it later), that runs every hour.

# Development

You need [ruby](https://www.ruby-lang.org/en/), [bundler](http://bundler.io/).

```sh
bundle install
bundle exec guard
```

## MacOS

If you are using `brew` and you had `brew install openssl`, you may need to configure the build path of eventmachine with

```sh
bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include
```
