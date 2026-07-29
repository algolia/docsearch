---
name: algolia-docsearch-mcp
description: Use when the user asks about public developer documentation for a library, framework, SDK, API, CLI tool, or cloud service. Fetch current docs from Algolia DocSearch MCP and cite source URLs.
---

Use Algolia DocSearch MCP when the answer depends on current public developer documentation.

## Scope

Use this skill for:

- Setup and configuration questions about public libraries, frameworks, SDKs, APIs, CLI tools, and cloud services.
- API reference details, migrations, and code examples that should match current documentation.
- Questions that ask for documentation sources or citations.

Do not use this skill for:

- Private or internal documentation.
- Local code review or business logic.
- General programming concepts that do not require external documentation.
- Questions already answered by documentation the user supplied.
- DocSearch crawler operations, administration, or private Algolia indices.

## Default flow

For most questions, call `algolia_docsearch_search_docs`.

1. Set `library` to the official product, library, SDK, or platform name.
2. Set `query` to the actual documentation question in natural language.
3. Answer only from the returned documentation chunks.
4. Include returned source URLs when available.

If the selected documentation set is ambiguous or irrelevant, do not answer from it. Retry with the exact official product name or use the manual flow.

## Manual flow

Use `algolia_docsearch_resolve_docset` followed by `algolia_docsearch_query_docs` when:

- The question spans multiple products.
- The right documentation set is ambiguous.
- The user asks to compare guidance across products.

Resolve the documentation set once, select the official vendor's best match, and pass its `docset_id` to `algolia_docsearch_query_docs`. Pass multiple IDs when the question genuinely spans products.

## Answering

- Ground the answer only in returned documentation content.
- Prefer official vendor documentation sets over third-party mentions.
- Include source links next to the claims they support.
- If no relevant documentation is returned, say so and ask for a more specific product name or documentation source.
- Never invent citations, credentials, private data, or unsupported capabilities.
