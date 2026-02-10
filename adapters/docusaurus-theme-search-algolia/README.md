# `@docsearch/docusaurus-adapter`

Algolia search component for Docusaurus.

## Usage

Prefer configuring the adapter with `themeConfig.docsearch`:

```js
// docusaurus.config.js
export default {
  // ...
  themeConfig: {
    docsearch: {
      appId: 'APP_ID',
      apiKey: 'SEARCH_API_KEY',
      indexName: 'INDEX_NAME',
      askAi: {
        assistantId: 'ASSISTANT_ID',
        sidePanel: true,
      },
    },
  },
};
```

`themeConfig.algolia` is still supported as a backward-compatible alias.
