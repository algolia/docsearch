/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import { DOCSEARCH_MCP_SERVER_NAME } from '../constants.js';

import type { SetupAgent } from './agents.js';

const BASE_GUIDANCE = `Use DocSearch MCP when the user asks about public developer documentation for a library, framework, SDK, API, CLI tool, or cloud service.

Prefer the one-shot \`algolia_docsearch_search_docs\` tool for normal lookups:

1. Put the official product, library, SDK, or platform name in \`library\`.
2. Put the actual documentation question in \`query\`.
3. Answer only from returned documentation chunks and include source links when available.

Use \`algolia_docsearch_resolve_docset\` followed by \`algolia_docsearch_query_docs\` when a question spans multiple products or when the right documentation set is ambiguous.

Do not use DocSearch MCP for general programming concepts, local code review, or business logic that is not answered by public docs.`;

const CURSOR_FRONTMATTER = `---\nalwaysApply: true\n---\n\n`;

export function getRuleContent(agent: SetupAgent): string {
  if (agent === 'cursor') {
    return `${CURSOR_FRONTMATTER}${BASE_GUIDANCE}\n`;
  }

  return `${BASE_GUIDANCE}\n`;
}

export function getSkillContent(): string {
  return `---
name: ${DOCSEARCH_MCP_SERVER_NAME}
description: Search current public developer documentation through DocSearch MCP. Use for library, framework, SDK, API, CLI, and cloud service documentation questions.
---

# DocSearch MCP

Use this skill to fetch current public developer documentation through DocSearch MCP before answering documentation questions.

## When to use

- The user asks about a library, framework, SDK, API, CLI tool, or cloud service.
- The answer depends on current public docs, configuration, API syntax, migration steps, or version-specific behavior.
- The user explicitly says to use DocSearch MCP.

## Steps

1. For most questions, call \`algolia_docsearch_search_docs\`.
   - \`library\`: official product or vendor/library name, for example \`Next.js\`, \`Stripe\`, or \`Algolia InstantSearch\`.
   - \`query\`: the user's actual documentation question.
2. If the library is ambiguous, call \`algolia_docsearch_resolve_docset\`, pick the best \`docset_id\`, then call \`algolia_docsearch_query_docs\`.
3. Use separate focused queries for unrelated topics. Combined broad queries dilute ranking.
4. Answer from retrieved chunks only. Include source URLs when present.

## Fallback

If DocSearch MCP returns no useful results, retry with the official product name and a narrower query. If it still returns nothing, say that the answer was not found in the indexed docs.
`;
}
