---
title: Record Extractor
---

## Introduction

:::info

This documentation will only contain information regarding the **helpers.docsearch** method, see **[Algolia Crawler Documentation][7]** for more information on the **[Algolia Crawler][8]**.

:::

Pages are extracted by a [`recordExtractor`][9]. These extractors are assigned to [`actions`][12] via the [`recordExtractor`][9] parameter. This parameter links to a function that returns the data you want to index, organized in an array of JSON objects.

_The helpers are a collection of functions to help you extract content and generate Algolia records._

### Useful links

- [Extracting records with the Algolia Crawler][11]
- [`recordExtractor` parameters][10]

## Usage

The most common way to use the DocSearch helper, is to return its result to the [`recordExtractor`][9] function.

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
      }
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

You might want to index content that will be used as filters in your frontend (e.g. `version` or `lang`), you can defined any custom variable to the `recordProps` object to add them to your Algolia records:

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

The following `version`, `lang` and `foo` attributes will be available in your records:

```json
foo: "valueFromBarSelector",
language: ["en", "en-US"],
version: ["latest", "stable"]
```

You can now use them to [filter your search in the frontend][16]

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

If you encounter the `Extractors returned too many records` error when your page outputs more than 750 records. The [`aggregateContent`](#aggregatecontent) option helps you reducing the number of records at the `content` level of the extractor.

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

If you encounter the `Records extracted are too big` error when crawling your website, it's mostly because there was too many informations in your records, or that your page is too big. The [`recordVersion`](#recordversion) option helps you reducing the records size by removing informations that are only used with [DocSearch v2](/docs/legacy/dropdown).

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

Custom variables are used to [`filter your search`](/docs/docsearch-v3#filtering-your-search), you can define them in the [`recordProps`](#indexing-content-for-faceting)

## `helpers.docsearch` API Reference

### `aggregateContent`

> `type: boolean` | default: `true` | **optional**

[This option](#reduce-the-number-of-records) groups the Algolia records created at the `content` level of the selector into a single record for its matching heading.

### `recordVersion`

> `type: 'v3' | 'v2'` | default: `v2` | **optional**

This option remove content from the Algolia records that are only used for [DocSearch v2](/docs/legacy/dropdown). If you are using [the latest version of DocSearch](/docs/docsearch-v3), you can [set it to `v3`](#reduce-the-record-size).

### `indexHeadings`

> `type: boolean | { from: number, to: number }` | default: `true` | **optional**

This option tells the crawler if the `headings` (`lvlX`) should be indexed.

- When `false`, only records for the `content` level will be created.
- When `from, to` is provided, only records for the `lvlX` to `lvlY` will be created.

[1]: /docs/docsearch-v3
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
[16]: /docs/docsearch-v3/#filtering-your-search
