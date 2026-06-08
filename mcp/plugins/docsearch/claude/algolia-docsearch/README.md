# Algolia DocSearch Plugin for Claude Code

Algolia DocSearch connects Claude Code to the public DocSearch MCP endpoint for current public developer documentation.

## What's Included

- **MCP Server** - Connects Claude Code to `https://mcp.algolia.com/1/docsearch/mcp`.
- **Skill** - Auto-triggers documentation lookups for public developer docs questions.
- **Command** - `/algolia-docsearch:docs` for manual documentation queries.

## Installation

For local beta testing, install this plugin package from:

```text
mcp/plugins/docsearch/claude/algolia-docsearch
```

The MCP server config is also available at:

```text
mcp/plugins/docsearch/claude/algolia-docsearch/.mcp.json
```

For Claude Code marketplace install from this repository:

```bash
claude plugin marketplace add algolia/docsearch
claude plugin install algolia-docsearch@algolia-docsearch-marketplace
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

Ask Claude questions like:

- "How do I configure middleware in Next.js?"
- "Show me Stripe webhook signature verification from the docs."
- "What is the current Algolia InstantSearch React setup?"

Or use the manual command:

```text
/algolia-docsearch:docs Next.js middleware matcher
/algolia-docsearch:docs Stripe webhook signature verification
```

The plugin is for public developer documentation only. It does not expose crawler operations, DocSearch administration, private docs, or Algolia index credentials.
