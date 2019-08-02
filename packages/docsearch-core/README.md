# DocSearch Core

This package contains the primitives to create a DocSearch experience.

## Installation

```sh
npm install docsearch-core
# or
yarn add docsearch-core
```

## Usage

```ts
import docsearch from 'docsearch-core';

const docsearchIndex = docsearch({
  indexName: 'YOUR_INDEX_NAME',
  apiKey: 'YOUR_API_KEY',
});

const container = document.querySelector('#container');
const searchInput = document.querySelector('input[type="search"]');

searchInput.addEventListener('input', event => {
  const { hits, result } = docsearchIndex.search({
    query: event.target.value,
    // Other search parameters: https://www.algolia.com/doc/api-reference/api-parameters/
  });

  container.innerHTML = JSON.stringify(hits, null, 2);

  console.log({ hits, result });
});
```

## API

### `docsearch(options)`

```ts
docsearch({
  appId,
  apiKey,
  indexName,
  searchParameters,
  transformQuery,
  transformHits,
}: DocSearchCoreOptions)

interface DocSearchCoreOptions {
  /**
   * The Algolia application identifier.
   *
   * It needs to be specified only if you run DocSearch
   * on your own.
   *
   * @default `"BH4D9OD16A"`
   */
  appId?: string;
  /**
   * Your Algolia search API key.
   */
  apiKey: string;
  /**
   * Your Algolia index name.
   */
  indexName: string;
  /**
   * The search parameters to forward to Algolia.
   *
   * @see https://www.algolia.com/doc/api-reference/api-parameters/
   */
  searchParameters?: QueryParameters;
  /**
   * Transforms the query before sending to Algolia.
   *
   * @param query The transformed query
   */
  transformQuery?(query: string): string;
  /**
   * Transforms the hits before displaying them.
   *
   * @param hits The hits
   */
  transformHits?(hits: DocSearchHits): DocSearchHits;
}
```

### `docsearch(options).search({ query, ...searchParameters })`

Sends a search request to the Algolia index.

```ts
const { hits, result } = docsearchIndex.search({
  query: 'side effet',
  // Other search parameters: https://www.algolia.com/doc/api-reference/api-parameters/
});

console.log({
  // Formatted hits ready to be displayed
  hits,
  // Raw response from Algolia
  result,
});
```
