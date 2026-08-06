---
"@docsearch/react": patch
---

fix(askai): support Agent Studio's batched MCP search tool

The Algolia MCP search tool can now issue multiple queries in a single tool
call (`queries[]`), which previously rendered as an empty query and broke
consecutive tool-call aggregation.

- `AlgoliaMCPSearchTool["input"]` accepts both the legacy single-query shape
  and the new batched `queries[]` shape, and tolerates a missing `output`
- New `getSearchToolQueries()` helper normalizes query extraction across
  `searchIndex`, batched MCP, and legacy MCP tool parts
- `ToolCall` renders one tool state per query for both `input-available` and
  `output-available` states
- `groupConsecutiveToolResults` reuses the shared helper so batched calls
  aggregate correctly
- Fix `AggregatedSearchBlock` keyboard handler comparing `e.key === 'enter'`,
  which never matched and made query chips unusable via keyboard
