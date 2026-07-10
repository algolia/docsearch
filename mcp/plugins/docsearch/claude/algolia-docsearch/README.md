# Algolia DocSearch Plugin for Claude Code

Algolia DocSearch connects Claude Code to the public DocSearch MCP endpoint for current public developer documentation.

## What's Included

- **MCP Server** - Connects Claude Code to `https://mcp.algolia.com/1/docsearch/mcp`.
- **Skill** - Auto-triggers documentation lookups for public developer docs questions.
- **Command** - `/algolia-docsearch:docs` for manual documentation queries.

The plugin teaches the one-shot `search_docs` lookup and the `resolve_docset` + `query_docs` flow.

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

```text
/plugin marketplace add algolia/docsearch
/plugin install algolia-docsearch@algolia-docsearch-marketplace
```

## Available Tools

### algolia_docsearch_search_docs

One-shot lookup, and the right default for most questions. Pass a `library` (product or platform) and a `query` (the question); it resolves the best documentation set and returns ranked content in a single call.

### algolia_docsearch_resolve_docset

Step 1 of the manual flow. Finds matching documentation sets and returns candidates with a `docset_id`, title, description, and ranking signals.

### algolia_docsearch_query_docs

Step 2 of the manual flow. Queries documentation content for the `docset_id` values returned by `algolia_docsearch_resolve_docset`. Pass several `docsetIds` when a question spans multiple products.

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
