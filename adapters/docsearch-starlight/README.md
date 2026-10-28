# `@docsearch/starlight-adapter`

Add Algolia DocSearch v5 keyword search to your Astro Starlight site.

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

## How It Works

- **Search:** DocSearch replaces Pagefind. If your site already sets `components.Search`, the adapter keeps that component, leaves Pagefind unchanged, and logs a warning.
- **Theme:** the search button and modal follow Starlight's light and dark themes and custom accent colors.
- **Labels:** the button text, button accessible label, and placeholder use Starlight's localized search label unless you override them. Other text uses DocSearch defaults.
- **Navigation:** works with standard page loads and with Astro's `ClientRouter` if your site uses it. No React integration is needed.
- **Indexing:** you need an Algolia index of your documentation. Results link to their indexed URLs; the adapter does not crawl your site or rewrite them.

