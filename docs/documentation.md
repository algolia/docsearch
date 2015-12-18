---
layout: page
title: Documentation
permalink: /documentation/
---

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


# How do I get an `apiKey` and `indexName`?

Send us [an email](mailto:docsearch@algolia.com) with the url of
the documentation website you would like to add search to.


# How does it work?

The JavaScript library is a wrapper on top of our
[autocomplete.js](https://github.com/algolia/autocomplete.js) library, along
with default CSS styling of the dropdown.

The indexing of the website data itself is currently done by an internal tool (to be released).

Indexing of websites using docsearch takes places every day.

