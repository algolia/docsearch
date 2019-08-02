# DocSearch Downshift Renderer

This packages contains the renderer for DocSearch based on Downshift.

## Installation

```sh
npm install docsearch-renderer-downshift
# or
yarn add docsearch-renderer-downshift
```

## Usage

```tsx
import docsearch from 'docsearch-core';
import DocSearch from 'docsearch-renderer-downshift';

const docsearchIndex = docsearch({
  appId: 'YOUR_APP_ID',
  indexName: 'YOUR_INDEX_NAME',
});

function App() {
  return <DocSearch placeholder="Search…" search={docsearchIndex.search} />;
}
```

## API

### `placeholder`

> Defaults to `""`

The text that appears in the search box input when there is no query.

```tsx
<DocSearch
  placeholder="Search…"
  // other options
/>
```

### `stalledSearchDelay`

> Defaults to `300`

The number of milliseconds before the search is considered as stalled.

```tsx
<DocSearch
  stalledSearchDelay={500}
  // other options
/>
```

### `search`

The search method to call at each key stroke.

```tsx
<DocSearch
  search={docsearchIndex.search}
  // other options
/>
```

### `onItemHighlight`

The function called when the user highlights an item. Highlighting happens on hover and on keyboard navigation.

```tsx
<DocSearch
  onItemHighlight={({ hit }) => {
    console.log(`${hit.objectID} is highlighted`);
  }}
  // other options
/>
```

### `onItemSelect`

> Defaults to `({ hit }) => window.location.assign(hit.url)`

The function called when the user selects an item.

```tsx
<DocSearch
  onItemSelect={({ hit }) => {
    navigate(hit.url);
  }}
  // other options
/>
```
