---
title: Adapter Reference
description: Supported options and Starlight integration behavior.
---

## Options

| Option | Required | Description |
| --- | --- | --- |
| `appId` | Yes | Your Algolia application ID. |
| `apiKey` | Yes | A public search-only API key for your application. |
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
| `askAi` | No | An Agent Studio agent ID, or an Ask AI configuration object. |
| `sidePanel` | No | Opens Ask AI in a side panel. Requires `askAi`. |

Options must be JSON-serializable. See [Search Configuration](../../guides/search-configuration/) and [Ask AI](../../guides/ask-ai/) for examples.

## Search Component

Without an existing Search override, the plugin disables Pagefind and registers its DocSearch component. Other Starlight component overrides are preserved.

If `components.Search` is already configured, the plugin keeps it and leaves Pagefind unchanged.

## Theme and Labels

The search button and modal inherit Starlight's light/dark theme colors and custom accent properties. Configured button labels and placeholder take precedence over Starlight's localized search label; other strings retain DocSearch defaults unless overridden.

## Navigation

Standard page loads initialize search on each page. For sites opting into Astro's `ClientRouter`, the adapter destroys the old instance before a page swap and initializes search on the next page. This playground uses standard navigation.

Search results keep the URLs stored in the index, including query strings and heading anchors. The adapter does not crawl content or rewrite destinations.

## Ask AI Loading

Ask AI code loads only when `askAi` is configured. Side panel code and styles load only when both `askAi` and `sidePanel` are configured. Keyword-only sites download neither. If Ask AI fails to load, keyword search keeps working.

## Related Pages

- [Getting Started](../../guides/getting-started/)
- [Search Configuration](../../guides/search-configuration/)
- [Ask AI](../../guides/ask-ai/)
