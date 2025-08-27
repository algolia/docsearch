---
title: Dropdown Search-UI
---

Once your Algolia DocSearch index is ready, set up, and filled with the right data, you will need to integrate our dedicated Search-UI. To add the dropdown of results below your search input, you'll have to include our DocSearch library into your website as per the following example.

```html
<!-- Before the closing </head> -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
/>

<!-- Before the closing </body> -->
<script src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>
<script>
  docsearch({
    // Your Search API Key
    apiKey: '<YOUR_API_KEY>',
    // The index populated by the DocSearch scraper
    indexName: '<YOUR_INDEX_NAME>',
    // Your Algolia Application ID
    appId: '<YOUR_APP_ID>',
    // Replace inputSelector with a CSS selector
    // matching your search input
    inputSelector: '<YOUR_CSS_SELECTOR>',
    // Set debug to true to inspect the dropdown
    debug: false,
  });
</script>
```

You need to integrate this snippet into every page that integrates the dropdown UI.

## Testing

If you're eager to test DocSearch but don't have any credentials of your own yet, you can try out the one we use on this website:

```javascript
docsearch({
  appId: 'PMZUYBQDAK',
  apiKey: '24b09689d5b4223813d9b8e48563c8f6',
  indexName: 'docsearch',
});
```
