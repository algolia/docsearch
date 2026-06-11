---
description: Look up public developer documentation with Algolia DocSearch
argument-hint: [query]
---

# /algolia-docsearch:docs

Fetch current public developer documentation from the Algolia DocSearch MCP corpus.

## Usage

```text
/algolia-docsearch:docs <library-or-product> [topic]
```

The command should use the DocSearch two-step flow:

1. Call `algolia_docsearch_resolve_docset` with a concise keyword query for the library, product, API, or framework.
2. Pick the best matching `docset_id` and `targetIndex`.
3. Call `algolia_docsearch_query_docs` with a concise keyword query, `docsetIds`, and `targets`.
4. Answer using the returned docs and include source URLs when available.

## Examples

```text
/algolia-docsearch:docs Next.js middleware matcher
/algolia-docsearch:docs Stripe webhook signature verification
/algolia-docsearch:docs Algolia InstantSearch React configure search client
/algolia-docsearch:docs React Server Components data fetching
```

Use keyword-only tool queries. Do not pass full sentences or conversational phrasing to the MCP tools.
