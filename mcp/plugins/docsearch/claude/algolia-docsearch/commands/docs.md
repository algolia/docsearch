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

For most lookups, call `algolia_docsearch_search_docs` in a single step:

1. Set `library` to the product, library, or platform (use the official name).
2. Set `query` to the topic or question, in natural language.
3. Answer using the returned docs and include source URLs when available.

If the library is ambiguous, `algolia_docsearch_search_docs` returns candidate documentation sets — pick the right `docset_id` and pass it to `algolia_docsearch_query_docs`. Use the `algolia_docsearch_resolve_docset` + `algolia_docsearch_query_docs` flow when a question spans several products.

## Examples

```text
/algolia-docsearch:docs Next.js middleware matcher
/algolia-docsearch:docs Stripe webhook signature verification
/algolia-docsearch:docs Algolia InstantSearch React configure search client
/algolia-docsearch:docs React Server Components data fetching
```
