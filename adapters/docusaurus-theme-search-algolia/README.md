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
      indices: [{ name: 'INDEX_NAME' }],
      askAi: {
        assistantId: 'ASSISTANT_ID',
        indices: [
          {
            index: 'MARKDOWN_INDEX',
            description: 'Documentation content.',
          },
        ],
      },
      sidePanel: true,
    },
  },
};
```

Only `themeConfig.docsearch` is supported.
