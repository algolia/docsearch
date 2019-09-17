# DocSearch.js

Library that packages DocSearch in a single function.

## Installation

```sh
npm install docsearch.js
# or
yarn add docsearch.js
```

## Usage

```ts
docsearch({
  indexName: 'YOUR_INDEX_NAME',
  apiKey: 'YOUR_API_KEY',
  inputSelector: 'input[type="search"]',
});
```

## API

### `docsearch(options)`

```ts
docsearch({
  inputSelector,
  placeholder,
  stalledSearchDelay,
  onItemSelect,
  onItemHighlight,
}: DocSearchOptions);

interface DocSearchOptions extends DocSearchCoreOptions {
  /**
   * The container of the search box.
   */
  inputSelector: HTMLElement | string;
  /**
   * The text that appears in the search box input when there is
   * no query.
   *
   * @default `"Search"`
   */
  placeholder?: string;
  /**
   * The number of milliseconds before the search is considered
   * as stalled
   *
   * @default `300`
   */
  stalledSearchDelay?: number;
  /**
   * Function called when the user highlights an item.
   * Highlighting happens on hover and on keyboard navigation.
   */
  onItemHighlight?({ hit }: { hit: DocSearchHit }): void;
  /**
   * Function called when the user selects an item.
   */
  onItemSelect?({ hit }: { hit: DocSearchHit }): void;
}
```
