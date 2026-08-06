---
description: Guide readers to important docs with metadata.
---

# Boost web pages with metadata

Editing metadata is a simple way to manage page boosting. This guide uses the Docusaurus static site generator as an example, but other than the method used to add metadata all the other information in this document is applicable to extracting and applying the metadata with the Algolia Crawler to boost pages in DocSearch.

## Steps

This first step is Docusaurus specific. If you are using a different system Configure DocSearch as documented for your system.

- Configure Docusaurus to use Algolia DocSearch. To get started with DocSearch see [Search](https://docusaurus.io/docs/search).

These steps are common across all systems using the Algolia Crawler and DocSearch:
- Add metadata to pages that you would like to boost.
- Configure your Algolia index to adjust page ranking based on the added metadata.
- Configure the Algolia Crawler to use the added metadata.

## Add metadata

Here is an example of the desired metadata in a page to be boosted by 100 in the page ranking:

```html
<meta data-rh="true" name="pageBoost" content="100">
```

In Docusaurus, adding metadata, other than `description` and `keywords`, is done by adding HTML within your Markdown/MDX files.

This is the edit to a Docusaurus Markdown/MDX file:

```md
---
title: Page name
---

<head>
  <meta name="pageBoost" content="100"/>
</head>

## Overview
```

## Configure the Algolia index

Each Algolia index has several configuration options. The section to configure for page boosting is **Index** → **Configuration** → **Relevance Essentials** → **Ranking and Sorting** → **Custom Ranking**

If **`weight.pageRank`** is not in the list of custom ranking attributes, add it with **Add custom ranking attribute**.

## Configure the Algolia Crawler

The Algolia Crawler configuration is edited in your Algolia account. Access the crawler editor from the Algolia dashboard for your Algolia application at **Data sources** → **Crawler** by choosing the name of the crawler, and then **Editor**.

There are three edits to be made:

### Modify the `recordExtractor` function


:::tip
In the JavaScript snippets the `$` is the Cheerio instance, and allows you to manipulate the HTML Document Object Model (DOM). Links are in the **More information** section at the end of this doc.
:::

The `recordExtractor` needs access to the Cheerio instance to extract the metadata from the DOM.

Verify that the `recordExtractor` function includes the Cheerio instance as a parameter. Your record extractor function may have the `$`, if so you can skip this step. Your record extractor may also have other parameters listed, you should not remove parameters.

```js
recordExtractor: ({ $, helpers }) => {
```

### Extract the `pageBoost` metadata

Within the `recordExtractor` function, add the `const pageBoost` line to extract the `pageBoost` metadata into `const pageBoost`, with a default value of 0 if no metadata is present in the page.

```js
recordExtractor: ({ $, helpers }) => {
  // Extract metadata
  const pageBoost = $("meta[name='pageBoost']").attr("content") || "0";
```

### Assign the `pageRank`

The`pageRank` property is of type `string | number`, add the `pageRank` line to the `recordProps` code. In this example it is added after `content`.

```js
return helpers.docsearch({
  recordProps: {

    // your recordProps may populate lvl0 - lvl6 here

    content: "article p, article li, article td:last-child",
    pageRank: Number(pageBoost),
  },
```

## Testing

1. To test the changes to the page metadata and the Algolia Crawler build and publish your Docusaurus site.
1. View the source of a modified page and check for the added `pageBoost` metadata. It should look like this (with the content you assigned) in the HTML:
    ```html
    <meta data-rh="true" name="pageBoost" content="100">
    ```
1. Open the Crawler UI and test one of the pages you are boosting. Access the crawler editor from the Algolia dashboard for your Algolia application at **Data sources** → **Crawler** by choosing the name of the crawler, and then **Editor**. In the top navigation select **URL Tester** and test a boosted page, verify that `weight.pageRank` is set in the **Records** tab:
  ![Algolia test URL records](/img/boost/boost_algolia_test_url_records.png)

## Production

Run a production crawl after testing individual URLs and confirm the updated search results.

## More information

[Data extraction examples](https://www.algolia.com/doc/tools/crawler/extracting-data/data-extraction-examples/)

[Adding metadata to Docusaurus pages](https://docusaurus.io/docs/markdown-features/head-metadata)

Configuring [Search in Docusaurus](https://docusaurus.io/docs/search)

Algolia Crawler [record extractor](./record-extractor)
