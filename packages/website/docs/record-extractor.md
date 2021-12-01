---
title: Record Extractor
---

:::info

The following content is for **[the new DocSearch infrastructure](/docs/migrating-from-legacy)**. If you haven't received an email to migrate your account yet, please refer to the **[legacy](/docs/legacy/dropdown)** documentation.

:::

## Introduction

:::info

This documentation will only contain information regarding the **helpers.docsearch** method, see **[Algolia Crawler Documentation][7]** for more information on the **[Algolia Crawler][8]**.

:::

Pages are extracted by a [`recordExtractor`][9]. These extractors are assigned to [`actions`][12] via the [`recordExtractor`][9] parameter. This parameter links to a function that returns the data you want to index, organized in a array of JSON objects.

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

## Complex extractors

### Using the Cheerio instance (`$`)

We provide a [`Cheerio instance ($)`][14] for you to retrieve or remove content from the DOM:

```js
recordExtractor: ({ $, helpers }) => {
  // Removing DOM elements we don't want to crawl
  $(".my-warning-message").remove();

  return helpers.docsearch({
    recordProps: {
      lvl0: "header h1",
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

### Handling fallback DOM selectors

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

### With custom variables

_These selectors also support [`defaultValue`](#with-raw-text-defaultvalue) and [fallback selectors](#with-fallback-dom-selectors)_

Custom variables are added to your Algolia records to be used as filters in the frontend (e.g. `version`, `lang`, etc.):

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

The `version`, `lang` and `foo` attribute of these records will be :

```json
foo: "valueFromBarSelector",
language: ["en", "en-US"],
version: ["latest", "stable"]
```

You can now use them to [filter your search in the frontend][16]

### With raw text (`defaultValue`)

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

### Boosting search results with `pageRank`

_[`pageRank`](#pagerank) used to be an **integer**, it is now a **string**_

This parameter helps to boost records built from the current `pathsToMatch`. Pages with highest [`pageRank`](#pagerank) will be returned before pages with a lower [`pageRank`](#pagerank). Note that you can pass any numeric value **as a string**, including negative values:

```js
{
  indexName: "YOUR_INDEX_NAME",
  pathsToMatch: ["https://YOUR_WEBSITE_URL/api/**"],
  recordExtractor: ({ $, helpers }) => {
    return helpers.docsearch({
      recordProps: {
        lvl0: "header h1",
        lvl1: "article h2",
        lvl2: "article h3",
        lvl3: "article h4",
        lvl4: "article h5",
        lvl5: "article h6",
        content: "article p, article li",
        pageRank: "30",
      },
      indexHeadings: true,
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

> `type: string` | **optional**

See the [live example](#boosting-search-results-with-pagerank)

### Custom variables (`[k: string]`)

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

Contains values that can be used as [`facetFilters`][15]

[1]: /docs/DocSearch-v3
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
[13]: /docs/record-extractor#with-custom-variables
[14]: https://cheerio.js.org/
[15]: https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/
[16]: /docs/docsearch-v3/#filtering-your-search
