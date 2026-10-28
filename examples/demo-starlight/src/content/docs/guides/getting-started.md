---
title: Getting Started
description: Register the DocSearch adapter in an Astro Starlight site.
---

## Requirements

The adapter requires Astro `^7.2.10`, Starlight `^0.42.7`, and an Algolia index containing your documentation. No Astro React integration is needed.

## Installation

Install the adapter in your Starlight project:

```sh
npm install @docsearch/starlight-adapter
```

## Register the Plugin

Add the adapter to the `plugins` array in your existing Starlight configuration:

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

Use a public search-only API key. Configuration is included in browser code, so never supply an admin key or private credentials.

Replace `@astrojs/starlight-docsearch` if it is already installed. An existing `components.Search` override is preserved with a warning; remove that override to render this adapter's search component.

## First Search

Start your site's development server. DocSearch replaces Pagefind and queries the configured index. In this playground, results come from the hosted DocSearch documentation index.

## Next Steps

Continue to [Search Configuration](../search-configuration/) for per-index parameters and text overrides, or consult the [Adapter Reference](../../reference/example/).

Return to [Installation](#installation).