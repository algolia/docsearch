# `@docsearch/starlight-adapter`

Add Algolia DocSearch v5 keyword search and Ask AI to your Astro Starlight site.

## Installation

```sh
npm install @docsearch/starlight-adapter
```

Requires Astro `^7.2.10` and Starlight `^0.42.7`.

If you use `@astrojs/starlight-docsearch`, replace it with this adapter.

## Usage

Add the adapter to Starlight's `plugins` array in `astro.config.mjs`, alongside any existing plugins:

```js
import starlight from '@astrojs/starlight';
import docsearch from '@docsearch/starlight-adapter';
import { defineConfig } from 'astro/config';

export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			plugins: [
				docsearch({
					appId: 'YOUR_APP_ID',
					apiKey: 'YOUR_SEARCH_ONLY_API_KEY',
					indices: ['YOUR_INDEX_NAME'],
				}),
			],
		}),
	],
});
```

Use a public search-only API key. These options are included in your site's browser code, so never use an admin key or other private credential.

## Options

| Option | Required | Description |
| --- | --- | --- |
| `appId` | Yes | Your Algolia application ID. |
| `apiKey` | Yes | A public search-only API key. |
| `indices` | Yes | One or more indices to search. Each entry is an index name or an object with `name` and optional `searchParameters`. |
| `placeholder` | No | Search input placeholder. Defaults to Starlight's localized search label. |
| `translations` | No | Overrides for DocSearch button and modal text. |
| `facets` | No | Facets to show as filter controls, as `{ key, label? }` objects. |
| `maxResultsPerGroup` | No | Maximum number of hits per group. |
| `disableUserPersonalization` | No | Disables recent and favorite searches. |
| `initialQuery` | No | Query prefilled when the modal opens. |
| `insights` | No | `true`, or `{ insightsInitParams }` to send analytics events. |
| `recentSearchesLimit` | No | Number of recent searches to keep. |
| `recentSearchesWithFavoritesLimit` | No | Number of recent searches to keep when favorites exist. |
| `keyboardShortcuts` | No | Enable or disable the `Ctrl/Cmd+K` and `/` shortcuts. |
| `resultBadgeKey` | No | Hit attribute shown as a badge on each result. |
| `askAi` | No | Enables Ask AI. See [Ask AI](#ask-ai). |
| `sidePanel` | No | Opens Ask AI in a side panel. Requires `askAi`. See [Ask AI](#ask-ai). |

This example sets search parameters for an index and customizes the placeholder and button text:

```js
docsearch({
	appId: 'YOUR_APP_ID',
	apiKey: 'YOUR_SEARCH_ONLY_API_KEY',
	indices: [
		{ name: 'YOUR_INDEX_NAME', searchParameters: { hitsPerPage: 5 } },
	],
	placeholder: 'Search documentation',
	translations: {
		button: { buttonText: 'Find docs' },
	},
});
```

Options must be JSON-serializable, so functions and callbacks are not supported.

## Ask AI

Set `askAi` to an Agent Studio agent ID to add Ask AI to the search modal. Add `sidePanel` to open conversations in a side panel instead:

```js
docsearch({
	appId: 'YOUR_APP_ID',
	apiKey: 'YOUR_SEARCH_ONLY_API_KEY',
	indices: ['YOUR_INDEX_NAME'],
	askAi: 'YOUR_AGENT_ID',
	sidePanel: true,
});
```

`askAi` also accepts an object:

| Option | Description |
| --- | --- |
| `agentId` | Required. Your Agent Studio agent ID. |
| `appId`, `apiKey` | Credentials for the agent. Default to the top-level `appId` and `apiKey`. |
| `indices` | Index names the agent searches. |
| `searchParameters` | Per-index overrides, keyed by index name: `facetFilters`, `filters`, `attributesToRetrieve`, `restrictSearchableAttributes`, `distinct`. |
| `suggestedQuestions` | Shows suggested questions when a conversation starts. |
| `promptSuggestions` | Shows prompt suggestions during keyword search, as `{ indexName, hitsPerPage? }`. |

`sidePanel` accepts `true` or an object:

| Option | Description |
| --- | --- |
| `buttonVariant` | `'floating'` (default) shows a button in the bottom corner. `'inline'` shows an icon next to the search button. |
| `variant` | `'floating'` (default) overlays the page. `'inline'` pushes the page content aside. |
| `side` | `'right'` (default) or `'left'`. |
| `width`, `expandedWidth` | Panel width, as pixels or any CSS width. |
| `pushSelector` | Element pushed aside by the `inline` variant. Defaults to Starlight's main content. |
| `suggestedQuestions`, `indices` | Override the `askAi` values for the panel. |
| `translations` | Overrides for the panel text. |
| `keyboardShortcuts` | Enable or disable the `Ctrl/Cmd+I` shortcut. |

The agent's `tools` and `memory` options are not supported: tools need functions, and memory needs a per-user token that a static site cannot keep private.

## How It Works

- **Search:** DocSearch replaces Pagefind. If your site already sets `components.Search`, the adapter keeps that component, leaves Pagefind unchanged, and logs a warning.
- **Theme:** the search button and modal follow Starlight's light and dark themes and custom accent colors.
- **Labels:** the button text, button accessible label, and placeholder use Starlight's localized search label unless you override them. Other text uses DocSearch defaults.
- **Navigation:** works with standard page loads and with Astro's `ClientRouter` if your site uses it. No React integration is needed.
- **Ask AI loading:** the Ask AI and side panel code loads only when you configure them, so keyword-only sites don't download it. If it fails to load, keyword search keeps working.
- **Side panel:** Ask AI from the search modal opens the side panel, and only one of the two is open at a time.
- **Indexing:** you need an Algolia index of your documentation. Results link to their indexed URLs; the adapter does not crawl your site or rewrite them.

