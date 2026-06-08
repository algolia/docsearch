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

## Tool Flow

### Step 1: Resolve The Docset

Call `algolia_docsearch_resolve_docset` first.

Use a concise keyword-only query, not the user's full sentence. Good examples:

- `Next.js middleware`
- `React Server Components`
- `Stripe webhooks`
- `Algolia InstantSearch React`

Input:

- `query`: concise keywords for the library, product, API, or concept.
- `topN`: optional. Use the default unless the initial result is ambiguous.

### Step 2: Select The Best Candidate

Choose the candidate that best matches the user's target docs.

Prefer:

- Exact product, library, or framework name matches.
- Official or primary documentation when the title/description makes that clear.
- Higher `trustScore`, `benchmarkScore`, or `popularityScore` when multiple candidates look similar.

Keep the selected candidate's:

- `docset_id`
- `targetIndex`

Convert that pair into a `targets` entry for the next tool:

```json
{
  "docsetId": "<docset_id>",
  "indexName": "<targetIndex>"
}
```

### Step 3: Query The Docs

Call `algolia_docsearch_query_docs`.

Use a concise keyword-only query for the specific documentation content. Good examples:

- `middleware matcher config`
- `server components data fetching`
- `webhook signature verification`
- `configure search client`

Input:

- `query`: concise keywords for the docs content.
- `docsetIds`: an array containing the selected `docset_id` values.
- `targets`: an array of `{ "docsetId": "...", "indexName": "..." }` entries built from the selected candidates.

### Step 4: Answer With Sources

Use the returned documentation content to answer the user directly.

Guidelines:

- Include source URLs from the tool result when available.
- Say when DocSearch does not return a relevant result.
- Do not invent source citations.
- Keep the answer focused on the user's question.
