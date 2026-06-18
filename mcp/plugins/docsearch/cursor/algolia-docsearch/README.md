# Algolia DocSearch Plugin for Cursor

Algolia DocSearch connects Cursor to the public DocSearch MCP endpoint for current public developer documentation.

## What's Included

- **MCP Server** - Connects Cursor to `https://mcp.algolia.com/1/docsearch/mcp`.
- **Rule** - Nudges the agent to use DocSearch for public developer docs instead of guessing from training data.
- **Skill** - Documents the one-shot `search_docs` lookup and the `resolve_docset` + `query_docs` flow.

## Installation

For local beta testing, install this plugin package from:

```text
mcp/plugins/docsearch/cursor/algolia-docsearch
```

The MCP server config is also available at:

```text
mcp/plugins/docsearch/cursor/algolia-docsearch/mcp.json
```

## Available Tools

### algolia_docsearch_search_docs

One-shot lookup, and the right default for most questions. Pass a `library` (product or platform) and a `query` (the question); it resolves the best documentation set and returns ranked content in a single call.

### algolia_docsearch_resolve_docset

Step 1 of the manual flow. Finds matching documentation sets and returns candidates with a `docset_id`, title, description, and ranking signals.

### algolia_docsearch_query_docs

Step 2 of the manual flow. Queries documentation content for the `docset_id` values returned by `algolia_docsearch_resolve_docset`. Pass several `docsetIds` when a question spans multiple products.

## Usage Examples

Ask Cursor questions like:

- "How do I configure middleware in Next.js?"
- "Show me Stripe webhook signature verification from the docs."
- "What is the current Algolia InstantSearch React setup?"

The plugin is for public developer documentation only. It does not expose crawler operations, DocSearch administration, private docs, or Algolia index credentials.
