---
title: Migrating from v3 to v4
---

:::warning

DocSearch v4 is currently in beta. While it's suitable for production scenarios, expect potential improvements and minor issues. Use at your discretion.

:::

This guide provides detailed information on migrating from [DocSearch v3](/docs/docsearch-v3) to [DocSearch v4](/docs/docsearch/v4), highlighting key differences and new configuration options. For a comprehensive overview, refer to the [API reference](/docs/v4/api) and [Getting Started Guide](/docs/docsearch/v4).

## If You're Using Algolia Keyword Search Only

If your application utilizes only the Algolia keyword search functionality, **no migration steps are necessary**. DocSearch v4 maintains full backward compatibility for keyword search operations.

## Integrating AskAI with DocSearch v4

### Basic Integration

DocSearch v4 introduces seamless support for Algolia's AskAI feature. To enable AI-powered search, add the `askAi` parameter with your Algolia Assistant ID to your existing DocSearch configuration:

```javascript
docsearch({
  indexName: 'YOUR_INDEX_NAME',
  apiKey: 'YOUR_SEARCH_API_KEY',
  appId: 'YOUR_APP_ID',
  askAi: 'YOUR_ALGOLIA_ASSISTANT_ID',
});
```

Replace `YOUR_ALGOLIA_ASSISTANT_ID` with the ID provided from your Algolia Dashboard under the AskAI section.

### Advanced Integration (Using a Separate Index)

If you prefer to utilize AskAI with a separate configuration from your main DocSearch setup (for instance, using different API credentials or index), you can do so by providing an object to the `askAi` parameter:

```javascript
docsearch({
  indexName: 'YOUR_INDEX_NAME',
  apiKey: 'YOUR_SEARCH_API_KEY',
  appId: 'YOUR_APP_ID',
  askAi: {
    indexName: 'ANOTHER_INDEX_NAME',
    apiKey: 'ANOTHER_SEARCH_API_KEY',
    appId: 'ANOTHER_APP_ID',
    assistantId: 'YOUR_ALGOLIA_ASSISTANT_ID',
  },
});
```

Ensure each field (`indexName`, `apiKey`, `appId`, and `assistantId`) within the `askAi` object is correctly configured for the Algolia index and assistant you wish to use.

## Features in v4 with AskAI

* **BYO-LLM (Bring Your Own LLM) Support**: You can integrate custom AI models by providing your own LLM keys and configurations.
* **Improved Security**: Short-lived tokens and domain verification enhance security, reducing unauthorized access.
* **Enhanced Analytics and Feedback Processing**: Robust analytics to monitor usage and performance of your assistants.

## Styling

We refreshed most of the CSS classes. The new version shouldn't break your existing styling, but more styles & classes were introduced in this version so you'd probably have to customize them again.

## Migration Path and Compatibility

DocSearch v4 provides a clear migration path:

* Update your DocSearch configuration with the new `askAi` settings as required.
* Ensure domain whitelist and assistant settings are properly configured via your Algolia Dashboard.
* Review your indexed content and analytics periodically to optimize AskAI responses and performance.

For full details on endpoint security, caching strategies, and infrastructure, see the dedicated [Security and Infrastructure](/docs/docsearch-v4/security-infrastructure) documentation.

## Support and Resources

* **AskAI documentation**: Learn everything about Algolia AskAI ([Documentation](/#)).
* **DocSearch Playground**: Interactive environment to test DocSearch configurations ([Docsearch Playground](https://community.algolia.com/docsearch-playground/)).
* **Community & Support**: Reach out through the [Algolia Discord](https://alg.li/discord).

Following this guide ensures a smooth transition to DocSearch v4, unlocking the full capabilities of Algolia's powerful AI-driven search features.
