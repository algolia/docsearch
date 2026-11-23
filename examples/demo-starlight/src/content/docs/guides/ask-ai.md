---
title: Ask AI
description: Add an Agent Studio agent and the Ask AI side panel.
sidebar:
  order: 3
---

## Enable Ask AI

Set `askAi` to your Agent Studio agent ID. The search modal then offers to ask AI about the current query:

```js
docsearch({
	appId: 'YOUR_APP_ID',
	apiKey: 'YOUR_SEARCH_ONLY_API_KEY',
	indices: ['YOUR_INDEX_NAME'],
	askAi: 'YOUR_AGENT_ID',
});
```

Pass an object for more control:

```js
askAi: {
	agentId: 'YOUR_AGENT_ID',
	indices: ['YOUR_INDEX_NAME'],
	searchParameters: {
		YOUR_INDEX_NAME: { facetFilters: ['lang:en'] },
	},
	suggestedQuestions: true,
},
```

The agent uses the top-level `appId` and `apiKey` unless you set them on `askAi`.

## Add the Side Panel

Add `sidePanel` to open Ask AI conversations in a side panel. It requires `askAi` and reuses its agent and credentials:

```js
docsearch({
	appId: 'YOUR_APP_ID',
	apiKey: 'YOUR_SEARCH_ONLY_API_KEY',
	indices: ['YOUR_INDEX_NAME'],
	askAi: 'YOUR_AGENT_ID',
	sidePanel: true,
});
```

Open the panel with the floating button in the bottom corner or with `Ctrl/Cmd+I`. Choosing Ask AI in the search modal also opens the panel with your question. Only one of the two is open at a time.

Two options control the layout:

- `buttonVariant`: `'floating'` (default) shows a button in the bottom corner. `'inline'` shows an icon next to the search button.
- `variant`: `'floating'` (default) overlays the page. `'inline'` pushes the main content aside.

```js
sidePanel: {
	buttonVariant: 'inline',
	variant: 'inline',
	side: 'left',
},
```

See the [adapter README](https://github.com/algolia/docsearch/tree/main/adapters/docsearch-starlight#ask-ai) for every `askAi` and `sidePanel` option.

## Limitations

The agent's `tools` and `memory` options are not supported. Tools need functions, which can't be passed through the static site configuration. Memory needs a per-user token, which a static site cannot keep private.

## Related Pages

- [Search Configuration](../search-configuration/)
- [Adapter Reference](../../reference/example/)
