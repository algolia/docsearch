---
layout: two-columns
title: Dropdown
---

To add the dropdown of results next to your search input, you'll have to include
the `docsearch.js` library into your website as per the following example. Your
`apiKey` and `indexName` credentials will be given to you as soon as we've
created your config.

```html
<!-- Before the closing </head> -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/docsearch.js@{{docSearchJSVersion}}/dist/cdn/docsearch.min.css"
/>

<!-- Before the closing </body> -->
<script
  src="https://cdn.jsdelivr.net/npm/docsearch.js@{{docSearchJSVersion}}/dist/cdn/docsearch.min.js"></script>
<script>
  docsearch({
    // Your apiKey and indexName will be given to you once
    // we create your config
    apiKey: '<API_KEY>',
    indexName: '<INDEX_NAME>',
    // Replace inputSelector with a CSS selector
    // matching your search input
    inputSelector: '<YOUR_CSS_SELECTOR>',
  });
</script>
```

## Testing

If you're eager to test DocSearch but don't have credentials of your own yet,
you can use the one we use on this own website:

```javascript
docsearch({
  apiKey: '25626fae796133dc1e734c6bcaaeac3c',
  indexName: 'docsearch',
});
```
