---
title: Modal Search UI
---

Once your Algolia DocSearch index is ready, set up, and filled with the right
data, you will need to integrate our dedicated search UI. To add this modal
search, you need to include our DocSearch library into your website as per the
following example. You will receive your `apiKey` and `indexName` credentials as
soon as we've deployed your configuration.

```html
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@docsearch/css@alpha"
    />
  </head>
  <body>
    <div id="docsearch"></div>

    <script src="https://cdn.jsdelivr.net/npm/@docsearch/js@alpha"></script>
    <script>
      docsearch({
        container: '#docsearch',
        apiKey: '<YOUR_API_KEY>',
        indexName: '<YOUR_INDEX_NAME>',
      });
    </script>
  </body>
</html>
```

You need to integrate this snippet into every page that integrates the search
UI.

## Testing

If you're eager to test DocSearch but don't have any credentials of your own
yet, you can try out the ones we use on this website:

```javascript
docsearch({
  apiKey: '25626fae796133dc1e734c6bcaaeac3c',
  indexName: 'docsearch',
});
```
