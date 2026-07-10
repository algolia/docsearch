---
name: algolia-docsearch-mcp
description: Use this skill when the user asks about public developer documentation, SDKs, APIs, libraries, frameworks, setup, configuration, or code examples. Fetch current docs from Algolia DocSearch MCP and cite source URLs.
---

When the user asks about public developer documentation, use Algolia DocSearch MCP instead of relying only on training data.

## When To Use

Use this skill when the user:

- Asks setup or configuration questions for a public library, framework, SDK, API, or developer tool.
- Requests code examples that should match current docs.
- Needs API reference details, migration guidance, or command syntax.
- Mentions a library or framework whose docs may have changed recently.
- Asks for sources or citations from public documentation.

Do not use this skill for private company docs, internal repositories, unpublished APIs, or questions where the user already supplied the relevant docs.

## Tools

DocSearch MCP exposes three tools. You can query in natural language — full sentences and questions work well.

- `algolia_docsearch_search_docs` — one-shot lookup. Use this by default.
- `algolia_docsearch_resolve_docset` — step 1 of the manual flow: find documentation sets.
- `algolia_docsearch_query_docs` — step 2 of the manual flow: fetch content for chosen docsets.

## Default Flow: One-Shot Search

Call `algolia_docsearch_search_docs` for most lookups.

Input:

- `library`: the product, library, SDK, or platform. Use the official name (for example: `Next.js`, `Stripe`, `Algolia InstantSearch`).
- `query`: the question, in natural language (for example: `how do middleware matchers work`).

It resolves the best matching documentation set and returns ranked content in a single call. If `library` is ambiguous, it returns candidate documentation sets instead — pick the right one and pass its `docset_id` to `algolia_docsearch_query_docs`, or retry with the official product name.

## Manual Flow: Resolve, Then Query

Use the two-step flow when a question spans several products, or when you want to inspect and hand-pick documentation sets.

### Step 1: Resolve The Docset

Call `algolia_docsearch_resolve_docset`.

Input:

- `query`: describe the product, library, SDK, or platform. Including the vendor name improves matching.
- `topN`: optional. Use the default unless the initial result is ambiguous.

Each candidate returns a `title`, `docset_id`, `description`, and ranking signals (`trustScore`, `benchmarkScore`, `popularityScore`). Prefer the official vendor's docset over third-party mentions, breaking ties by the higher scores.

### Step 2: Query The Docs

Call `algolia_docsearch_query_docs`.

Input:

- `query`: what to find in the docs, in natural language.
- `docsetIds`: an array of the `docset_id` values you selected. Pass several when a question spans multiple products.

## Answer With Sources

Use the returned documentation content to answer the user directly.

Guidelines:

- Include source URLs from the tool result when available.
- Say when DocSearch does not return a relevant result.
- Do not invent source citations.
- Keep the answer focused on the user's question.
