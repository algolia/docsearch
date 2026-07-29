# @docsearch/react

## 5.0.0-beta.1

### Patch Changes

- f8e0678: fix(askai): support Agent Studio's batched MCP search tool

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

- 09861c8: Align CSS class and animation names with the `DocSearch-` naming convention.

  - The `shimmer` utility class is now `DocSearch-shimmer`
  - Fixed a typo in `DocSearck-AskAiScreen-MessageContent-Stopped`, now
    `DocSearch-AskAiScreen-MessageContent-Stopped`
  - Keyframes renamed to kebab-case: `shimmerText` → `shimmer-text`,
    `slideDown` → `slide-down`, `fadeIn` → `fade-in`
  - Dark theme selectors use `:root[data-theme='dark']` instead of
    `html[data-theme='dark']`
  - Dropped redundant type qualifiers from `.DocSearch-Hits-padded` and
    `.DocSearch-Hit-Select-Icon` selectors, slightly lowering their specificity

  If you override these classes or keyframes in custom styles, update your
  selectors accordingly.

- Updated dependencies [09861c8]
  - @docsearch/css@5.0.0-beta.1
  - @docsearch/core@5.0.0-beta.1

## 5.0.0-beta.0

### Major Changes

- a8ed1ea: # DocSearch v5-beta

  DocSearch v5 is a major release that introduces AI-powered answers via Agent
  Studio, a refreshed search UI, and a modernized package architecture.

  ## Ask AI & Agent Studio

  - Agent Studio integration with core tools and dynamic tool calls
  - Conversation memory support
  - Compatibility with the Algolia MCP search tool, with aggregated MCP search
    tool calls
  - Dynamic index selection for Agent Studio
  - Feedback integration, including feedback notes and tags
  - Prompt suggestions in keyword search and follow-up prompt suggestions
  - Ask AI modal split into its own component and Ask AI transport layer removed

  ## Search UI

  - Refreshed v5 UI with improved dark theme, sources panel, and accessibility
  - Faceted search with filter chips
  - Hit breadcrumbs and result badges

  ## Packaging & architecture

  - New `@docsearch/cli` package for MCP setup and search
  - MCP plugin support
  - Split JS bundles for search-only usage and JS-based hybrid mode
  - Migrated the build system to tsdown
  - Migrated CSS building to LightningCSS

  ## Breaking changes

  - Ask AI related props are now nested under a single root `askai` option
  - The Ask AI transport layer has been removed

### Patch Changes

- Updated dependencies [a8ed1ea]
  - @docsearch/core@5.0.0-beta.0
  - @docsearch/css@5.0.0-beta.0
