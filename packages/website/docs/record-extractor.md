---
title: Record Extractor
description: Configure the DocSearch record extractor for Algolia Crawler records.
---

## Introduction

:::info

This page documents the **helpers.docsearch** method. See the **[Algolia Crawler documentation][7]** for information about the **[Algolia Crawler][8]**.

:::

Set the [`recordExtractor`][9] parameter on an [`action`][12] to extract each page. Its function returns the data to index as an array of JSON objects.

The helpers are functions for extracting content and generating Algolia records.

### Useful links

- [Extracting records with the Algolia Crawler][11]
- [`recordExtractor` parameters][10]

## Usage

The most common way to use the DocSearch helper is to return its result to the [`recordExtractor`][9] function.

```js
recordExtractor: ({ helpers }) => {
  return helpers.docsearch({
    recordProps: {
      lvl0: {
        selectors: "header h1",
      },
      lvl1: "article h2",
      lvl2: "article h3",
      lvl3: "article h4",
      lvl4: "article h5",
      lvl5: "article h6",
      content: "main p, main li",
    },
  });
},
```

### Manipulate the DOM with Cheerio

The [`Cheerio instance ($)`](https://cheerio.js.org/) allows you to manipulate the DOM:

```js
recordExtractor: ({ $, helpers }) => {
  // Removing DOM elements we don't want to crawl
  $(".my-warning-message").remove();

  return helpers.docsearch({
    recordProps: {
      lvl0: {
        selectors: "header h1",
      },
      lvl1: "article h2",
      lvl2: "article h3",
      lvl3: "article h4",
      lvl4: "article h5",
      lvl5: "article h6",
      content: "main p, main li",
    },
  });
},
```

### Provide fallback selectors

Fallback selectors can be useful when retrieving content that might not exist in some pages:

```js
recordExtractor: ({ $, helpers }) => {
  return helpers.docsearch({
    recordProps: {
      // `.exists h1` will be selected if `.exists-probably h1` does not exists.
      lvl0: {
        selectors: [".exists-probably h1", ".exists h1"],
      },
      lvl1: "article h2",
      lvl2: "article h3",
      lvl3: "article h4",
      lvl4: "article h5",
      lvl5: "article h6",
      // `.exists p, .exists li` will be selected.
      content: [
        ".does-not-exists p, .does-not-exists li",
        ".exists p, .exists li",
      ],
    },
  });
},
```

### Provide raw text (`defaultValue`)

_Only the `lvl0` and [custom variables][13] selectors support this option_

You might want to structure your search results differently than your website, or provide a `defaultValue` to a potentially non-existent selector:

```js
recordExtractor: ({ $, helpers }) => {
  return helpers.docsearch({
    recordProps: {
      lvl0: {
        // It also supports the fallback DOM selectors syntax!
        selectors: ".exists-probably h1",
        defaultValue: "myRawTextIfDoesNotExists",
      },
      lvl1: "article h2",
      lvl2: "article h3",
      lvl3: "article h4",
      lvl4: "article h5",
      lvl5: "article h6",
      content: "main p, main li",
      // The variables below can be used to filter your search
      language: {
        // It also supports the fallback DOM selectors syntax!
        selectors: ".exists-probably .language",
        // Since custom variables are used for filtering, we allow sending
        // multiple raw values
        defaultValue: ["en", "en-US"],
      },
    },
  });
},
```

### Indexing content for faceting

_These selectors also support [`defaultValue`](#provide-raw-text-defaultvalue) and [fallback selectors](#provide-fallback-selectors)_

To index content for frontend filters, such as `version` or `language`, define custom variables in `recordProps`. The helper adds them to each matching Algolia record:

```js
recordExtractor: ({ helpers }) => {
  return helpers.docsearch({
    recordProps: {
      lvl0: {
        selectors: "header h1",
      },
      lvl1: "article h2",
      lvl2: "article h3",
      lvl3: "article h4",
      lvl4: "article h5",
      lvl5: "article h6",
      content: "main p, main li",
      // The variables below can be used to filter your search
      foo: ".bar",
      language: {
        // It also supports the fallback DOM selectors syntax!
        selectors: ".does-not-exists",
        // Since custom variables are used for filtering, we allow sending
        // multiple raw values
        defaultValue: ["en", "en-US"],
      },
      version: {
        // You can send raw values without `selectors`
        defaultValue: ["latest", "stable"],
      },
    },
  });
},
```

The `version`, `language`, and `foo` attributes are then available in your records:

```json
{
  "foo": "valueFromBarSelector",
  "language": ["en", "en-US"],
  "version": ["latest", "stable"]
}
```

Add every filter attribute to the index's `attributesForFaceting`, then expose up to five of them with the v5 [`facets` option][16]. If you display one with `resultBadgeKey`, also add that attribute to `attributesToRetrieve`; see the [`resultBadgeKey` reference][17].

V5 result breadcrumbs use the `hierarchy.lvl0` through `hierarchy.lvl6` values generated from your selectors. Keep the heading levels ordered and include the hierarchy attributes in `attributesToRetrieve`.

### Boost search results with `pageRank`

This parameter allows you to boost records using a custom ranking attribute built from the current `pathsToMatch`. Pages with highest [`pageRank`](#pagerank) will be returned before pages with a lower [`pageRank`](#pagerank). The default value is 0 and you can pass any numeric value **as a string**, including negative values.

Search results are sorted by weight (desc), so you can have both boosted and non boosted results. The weight of each result will be computed for a given query based on multiple factors: match level, position, etc. and the pageRank value will be added to this final weight. The pageRank on its own may not be enough to influence the results of your query depending on how your [overall ranking is set up](https://www.algolia.com/doc/guides/managing-results/relevance-overview/in-depth/ranking-criteria/). If changing the pageRank value doesn't influence your search results enough, even with large values, move weight.pageRank higher in the Ranking and Sorting page for your index.

You can view the computed weight directly from the Algolia dashboard (dashboard.algolia.com->search->perform a search->mouse hover over the "ranking criteria" icon bottom right of each record). That will give you an idea of what pageRank value is acceptable for your case.

```js
{
  indexName: "YOUR_INDEX_NAME",
  pathsToMatch: ["https://YOUR_WEBSITE_URL/api/**"],
  recordExtractor: ({ $, helpers, url }) => {
    const isDocPage = /\/[\w-]+\/docs\//.test(url.pathname);
    const isBlogPage = /\/[\w-]+\/blog\//.test(url.pathname);
    return helpers.docsearch({
      recordProps: {
        lvl0: {
          selectors: "header h1",
        },
        lvl1: "article h2",
        lvl2: "article h3",
        lvl3: "article h4",
        lvl4: "article h5",
        lvl5: "article h6",
        content: "article p, article li",
        pageRank: isDocPage ? "-2000" : isBlogPage ? "-1000" : "0",
      },
    });
  },
},
```

### Reduce the number of records

If you encounter the `Extractors returned too many records` error when your page outputs more than 750 records, the [`aggregateContent`](#aggregatecontent) option helps you reduce the number of records at the `content` level of the extractor.

```js
{
  indexName: "YOUR_INDEX_NAME",
  pathsToMatch: ["https://YOUR_WEBSITE_URL/api/**"],
  recordExtractor: ({ $, helpers }) => {
    return helpers.docsearch({
      recordProps: {
        lvl0: {
          selectors: "header h1",
        },
        lvl1: "article h2",
        lvl2: "article h3",
        lvl3: "article h4",
        lvl4: "article h5",
        lvl5: "article h6",
        content: "article p, article li",
      },
      aggregateContent: true,
    });
  },
},
```

### Reduce the record size

If you encounter the `Records extracted are too big` error, your records or source page might contain too much information. The [`recordVersion`](#recordversion) option reduces record size by removing fields used only by the [DocSearch v2 UI](/docs/legacy/dropdown).

```js
{
  indexName: "YOUR_INDEX_NAME",
  pathsToMatch: ["https://YOUR_WEBSITE_URL/api/**"],
  recordExtractor: ({ $, helpers }) => {
    return helpers.docsearch({
      recordProps: {
        lvl0: {
          selectors: "header h1",
        },
        lvl1: "article h2",
        lvl2: "article h3",
        lvl3: "article h4",
        lvl4: "article h5",
        lvl5: "article h6",
        content: "article p, article li",
      },
      recordVersion: "v3",
    });
  },
},
```

## `recordProps` API Reference

### `lvl0`

> `type: Lvl0` | **required**

```ts
type Lvl0 = {
  selectors: string | string[];
  defaultValue?: string;
};
```

### `lvl1`, `content`

> `type: string | string[]` | **required**

### `lvl2`, `lvl3`, `lvl4`, `lvl5`, `lvl6`

> `type: string | string[]` | **optional**

### `pageRank`

> `type: number` | **optional**

See the [live example](#boost-search-results-with-pagerank)

### Custom variables

> `type: string | string[] | CustomVariable` | **optional**

```ts
type CustomVariable =
  | {
      defaultValue: string | string[];
    }
  | {
      selectors: string | string[];
      defaultValue?: string | string[];
    };
```

Define custom variables in [`recordProps`](#indexing-content-for-faceting). You can use them with v5 [`facets` and per-index filters][16].

## `helpers.docsearch` API Reference

### `aggregateContent`

> `type: boolean` | default: `true` | **optional**

[This option](#reduce-the-number-of-records) groups the Algolia records created at the `content` level of the selector into a single record for its matching heading.

### `recordVersion`

> `type: 'v3' | 'v2'` | default: `v2` | **optional**

This option selects the crawler record schema. It doesn't select the DocSearch UI package version. Set it to `v3` to remove fields used only by the [DocSearch v2 UI](/docs/legacy/dropdown). The `v3` value is also the current record schema for DocSearch v5 frontends.

### `indexHeadings`

> `type: boolean | { from: number, to: number }` | default: `true` | **optional**

This option tells the crawler if the `headings` (`lvlX`) should be indexed.

- When `false`, only records for the `content` level will be created.
- When `from, to` is provided, only records for the `lvlX` to `lvlY` will be created.

[2]: https://github.com/algolia/docsearch/
[3]: https://github.com/algolia/docsearch/tree/master
[4]: /docs/legacy/dropdown
[5]: /docs/migrating-from-legacy
[6]: /docs/legacy/run-your-own
[7]: https://www.algolia.com/doc/tools/crawler/getting-started/overview/
[8]: https://www.algolia.com/products/search-and-discovery/crawler/
[9]: https://www.algolia.com/doc/tools/crawler/apis/configuration/actions/#parameter-param-recordextractor
[10]: https://www.algolia.com/doc/tools/crawler/apis/configuration/actions/#parameter-param-recordextractor-2
[11]: https://www.algolia.com/doc/tools/crawler/guides/extracting-data/#extracting-records
[12]: https://www.algolia.com/doc/tools/crawler/apis/configuration/actions/
[13]: /docs/record-extractor#indexing-content-for-faceting
[15]: https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/
[16]: /docs/packages/js/api-reference#facets
[17]: /docs/packages/js/api-reference#resultbadgekey
