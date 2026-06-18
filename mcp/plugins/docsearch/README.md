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

You can query in natural language — full sentences and questions work well.

### algolia_docsearch_search_docs

One-shot lookup, and the right default for most questions. Pass a `library` and a `query`; it resolves the best matching documentation set and returns ranked content in a single call:

```json
{
  "library": "Next.js",
  "query": "how do middleware matchers work"
}
```

If the library is ambiguous, it returns candidate documentation sets instead — pick a `docset_id` and pass it to `algolia_docsearch_query_docs`.

### algolia_docsearch_resolve_docset

Step 1 of the manual flow. Finds matching documentation sets and returns candidates with:

- `docset_id`
- title and description
- optional quality signals such as `trustScore`, `benchmarkScore`, and `popularityScore`

```json
{
  "query": "Next.js app router"
}
```

### algolia_docsearch_query_docs

Step 2 of the manual flow. Queries documentation content for the selected `docset_id` values. Pass several when a question spans multiple products:

```json
{
  "query": "middleware matcher config",
  "docsetIds": ["nextjs"]
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
