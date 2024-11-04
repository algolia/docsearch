---
title: Migrating from DocSearch v2
---

This page lists the differences between the [DocSearch v2](/docs/legacy/dropdown) and [DocSearch v3](/docs/docsearch-v3) API, you can also take a look at [the exhaustive `API reference` list](/docs/api) and [the `Getting started` guide](/docs/docsearch-v3).

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
