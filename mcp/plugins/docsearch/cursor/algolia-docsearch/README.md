# Algolia DocSearch Plugin for Cursor

Algolia DocSearch connects Cursor to the public DocSearch MCP endpoint for current public developer documentation.

## What's Included

- **MCP Server** - Connects Cursor to `https://mcp.algolia.com/1/docsearch/mcp`.
- **Rule** - Nudges the agent to use DocSearch for public developer docs instead of guessing from training data.
- **Skill** - Documents the two-step `resolve_docset` then `query_docs` lookup flow.

## Installation

For local beta testing, install this plugin package from:

```text
plugins/docsearch/cursor/algolia-docsearch
```

The MCP server config is also available at:

```text
plugins/docsearch/cursor/algolia-docsearch/mcp.json
```

## Available Tools

### algolia_docsearch_resolve_docset

Finds matching documentation sets and returns `docset_id` plus `targetIndex` values.

Use keyword-only queries:

```text
Next.js middleware
Stripe webhooks
Algolia InstantSearch React
```

### algolia_docsearch_query_docs

Queries documentation content for selected docsets.

Use the `docset_id` values returned by `algolia_docsearch_resolve_docset`, and pass each selected `targetIndex` as the `indexName` in `targets`.

## Usage Examples

Ask Cursor questions like:

- "How do I configure middleware in Next.js?"
- "Show me Stripe webhook signature verification from the docs."
- "What is the current Algolia InstantSearch React setup?"

The plugin is for public developer documentation only. It does not expose crawler operations, DocSearch administration, private docs, or Algolia index credentials.
