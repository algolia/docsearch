---
title: Dropdown Search-UI
---

Once your Algolia DocSearch index is ready, set up, and filled with the right
data, you will need to integrate our dedicated Search-UI. To add the dropdown of
results below your search input, you'll have to include our DocSearch library
into your website as per the following example. You will receive your `apiKey`
and `indexName` credentials as soon as we've created your config.

```html
<!-- Before the closing </head> -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/docsearch.js@{{docSearchJSVersion}}/dist/cdn/docsearch.min.css"
/>

<!-- Before the closing </body> -->
<script src="https://cdn.jsdelivr.net/npm/docsearch.js@{{docSearchJSVersion}}/dist/cdn/docsearch.min.js"></script>
<script>
  docsearch({
    // Your apiKey and indexName will be given to you once
    // we create your config
    apiKey: '<API_KEY>',
    indexName: '<INDEX_NAME>',
    //appId: '<APP_ID>', // Should be only included if you are running DocSearch on your own.
    // Replace inputSelector with a CSS selector
    // matching your search input
    inputSelector: '<YOUR_CSS_SELECTOR>',
    // Set debug to true if you want to inspect the dropdown
    debug: false,
  });
</script>
```

You need to integrate this snippet into every page that integrates the
dropdown UI

## Testing

If you're eager to test DocSearch but don't have any credentials of your own
yet, you can try out the one we use on this website:

```javascript
docsearch({
  apiKey: '25626fae796133dc1e734c6bcaaeac3c',
  indexName: 'docsearch',
});
```
