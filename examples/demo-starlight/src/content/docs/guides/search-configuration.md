---
title: Search Configuration
description: Configure indices, search parameters, and DocSearch text overrides.
---

## Keyword Search

The required options are `appId`, `apiKey`, and a non-empty `indices` array. Use v5's `indices` option, not the older `indexName` option.

Each index can be a name or an object with its own search parameters:

```js
docsearch({
	appId: 'YOUR_APP_ID',
	apiKey: 'YOUR_SEARCH_ONLY_API_KEY',
	indices: [
		'YOUR_INDEX_NAME',
		{
			name: 'YOUR_SECOND_INDEX',
			searchParameters: { hitsPerPage: 5 },
		},
	],
});
```

Search parameters apply to their index. Results link to the URLs stored in that index.

## Placeholder and Translations

The button text, accessible label, and input placeholder default to Starlight's localized search label. Override them explicitly when needed:

```js
docsearch({
	appId: 'YOUR_APP_ID',
	apiKey: 'YOUR_SEARCH_ONLY_API_KEY',
	indices: ['YOUR_INDEX_NAME'],
	placeholder: 'Search documentation',
	translations: {
		button: {
			buttonText: 'Find docs',
			buttonAriaLabel: 'Search the documentation',
		},
	},
});
```

Other modal text uses DocSearch defaults unless supplied through `translations`.

Options must be JSON-serializable.

## Related Pages

- [Getting Started](../getting-started/)
- [Adapter Reference](../../reference/example/)