# Algolia DocSearch Plugin for ChatGPT and Codex

Algolia DocSearch connects ChatGPT and Codex to the public DocSearch MCP endpoint for current public developer documentation.

## What's included

- **Plugin manifest** - Identifies the universal ChatGPT and Codex plugin and its listing metadata.
- **MCP server** - Connects to `https://mcp.algolia.com/1/docsearch/mcp` without user authentication.
- **Skill** - Routes public developer documentation questions through DocSearch and requires source-grounded answers.

The plugin teaches the one-shot `search_docs` lookup and the `resolve_docset` plus `query_docs` flow.

## Public submission

Submit this as **With MCP** using the universal MCP URL:

```text
https://mcp.algolia.com/1/docsearch/mcp
```

Do not submit an existing ChatGPT integration ID. The OpenAI submission portal scans the production MCP URL directly. See [SUBMISSION.md](SUBMISSION.md) for listing copy, tool annotation requirements, starter prompts, test cases, and the pre-submission checklist.

## Local ChatGPT testing

1. Enable Developer mode in ChatGPT under **Settings → Security and login**.
2. Open ChatGPT Plugins, add a connection, and enter the MCP URL above.
3. Test each tool and the bundled skill in a new chat.

If a packaged local plugin must reference the registered ChatGPT connection, copy its technical ID from the browser URL and add a `.app.json` file:

```json
{
  "apps": {
    "algolia-docsearch": {
      "id": "plugin_asdk_app_<registered-id>"
    }
  }
}
```

Then add `"apps": "./.app.json"` to `.codex-plugin/plugin.json`. The committed package intentionally omits this machine-specific development ID.

## Available tools

### `algolia_docsearch_search_docs`

The default one-shot lookup. It resolves a documentation set from `library`, searches it with `query`, and returns ranked documentation chunks with source URLs.

### `algolia_docsearch_resolve_docset`

Finds candidate documentation sets for an official product, library, SDK, or platform.

### `algolia_docsearch_query_docs`

Queries one or more selected `docset_id` values. Use it after resolving an ambiguous library or when a question spans products.

This plugin is limited to public developer documentation. It does not expose crawler operations, DocSearch administration, private documentation, or Algolia index credentials.
