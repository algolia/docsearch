# Algolia DocSearch MCP Plugins

This directory contains client plugin packages for the public Algolia DocSearch MCP endpoint:

```text
https://mcp.algolia.com/1/docsearch/mcp
```

The plugins connect AI coding clients to the public DocSearch documentation corpus. They do not expose crawler operations, DocSearch administration, private documentation, or Algolia index credentials.

## Packages

- `mcp/plugins/docsearch/cursor/algolia-docsearch` - Cursor plugin package with MCP config, rule, skill, and README.
- `mcp/plugins/docsearch/claude/algolia-docsearch` - Claude Code plugin package with MCP config, skill, command, and README.

## Public MCP Tools

### algolia_docsearch_resolve_docset

Finds matching documentation sets and returns candidates with:

- `docset_id`
- `targetIndex`
- optional quality signals such as `trustScore`, `benchmarkScore`, and `popularityScore`

Use concise keyword-only queries, for example:

```text
Next.js middleware
Stripe webhooks
Algolia InstantSearch React
```

### algolia_docsearch_query_docs

Queries documentation content for selected docsets.

Use the selected `docset_id` values as `docsetIds`. Pass each selected `targetIndex` as `indexName` in the `targets` array:

```json
{
  "query": "middleware matcher config",
  "docsetIds": ["nextjs"],
  "targets": [
    {
      "docsetId": "nextjs",
      "indexName": "nextjs_docs"
    }
  ]
}
```

## Claude Desktop And claude.ai

Claude Desktop and claude.ai can connect directly to the same remote MCP endpoint when remote connectors are available in the client:

```json
{
  "algolia-docsearch": {
    "type": "http",
    "url": "https://mcp.algolia.com/1/docsearch/mcp"
  }
}
```

No user authentication is required for the public DocSearch MCP endpoint.
