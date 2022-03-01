---
title: Migrating from DocSearch v2
---

This page lists the differences between the [DocSearch v2][4] and [DocSearch v3][1] API, you can also take a look at [the exhaustive `API reference` list](/docs/api) and [the `Getting started` guide][1].

```diff
docsearch({
  indexName: 'YOUR_INDEX_NAME',
  apiKey: 'YOUR_SEARCH_API_KEY',

- inputSelector: '<YOUR_CSS_INPUT_SELECTOR>',
+ container: '<YOUR_CSS_CONTAINER_SELECTOR>', -> We now require a container to be provided

- appId: '<YOUR_OPTIONAL_APP_ID>',
+ appId: '<YOUR_REQUIRED_APP_ID>', -> `appId` is now required

- transformData: function(hits) {},
+ transformItems: function(items) {},

- algoliaOptions: {},
+ searchParameters: {},
});
```

[1]: /docs/DocSearch-v3
[2]: https://github.com/algolia/docsearch/
[3]: https://github.com/algolia/docsearch/tree/master
[4]: /docs/legacy/dropdown
