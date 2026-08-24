# @docsearch/docusaurus-adapter

## 5.0.4

### Patch Changes

- 46f1096: Respect a caller-supplied `transformSearchClient` instead of discarding it.
- Updated dependencies [f29b541]
  - @docsearch/react@5.0.4
  - @docsearch/modal@5.0.4
  - @docsearch/sidepanel@5.0.4
  - @docsearch/core@5.0.4

## 5.0.3

### Patch Changes

- Updated dependencies [537afaa]
  - @docsearch/react@5.0.3
  - @docsearch/modal@5.0.3
  - @docsearch/sidepanel@5.0.3
  - @docsearch/core@5.0.3

## 5.0.2

### Patch Changes

- Updated dependencies [1508196]
- Updated dependencies [59c575f]
  - @docsearch/react@5.0.2
  - @docsearch/modal@5.0.2
  - @docsearch/sidepanel@5.0.2
  - @docsearch/core@5.0.2

## 5.0.1

### Patch Changes

- Updated dependencies [4ac53c4]
  - @docsearch/react@5.0.1
  - @docsearch/modal@5.0.1
  - @docsearch/sidepanel@5.0.1
  - @docsearch/core@5.0.1

## 5.0.0

### Major Changes

- ecd905d: # DocSearch v5-beta

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

- ecd905d: feat(v5): General UI styling updates and fixes

  - New `--docsearch-font-family` variable, used by the search button, keyboard
    keys, modal, and sidepanel. It replaces the system font stacks that were
    duplicated across `sidepanel.css` and `button.css`, so overriding one
    variable now themes every DocSearch surface
  - The search input and modal heading are `1rem` at every breakpoint
    (previously `0.875rem` with a mobile-only override)
  - `.DocSearch-Title` uses `line-height: 1.5em` instead of `0.5em` and adds
    `overflow-wrap: anywhere`, so long titles wrap instead of overlapping (#2908)
  - Hit icon `svg` sizing moved into `.DocSearch-Hit-icon`. The
    `.DocSearch-Hit-icon--small` modifier is replaced by
    `.DocSearch-Hit-icon--start`, which top-aligns the icon; recent
    conversations use it
  - The Ask AI button icon centers with `display: inline-flex` instead of
    `margin-block-start`/`align-self` overrides
  - Removed the 2px offset on the Ask AI sources action text
  - `SourcesPanel` accepts `pluralTitleText`. `titleText` is now the singular
    label, and the trigger renders `{count} {label}`
  - `AskAiScreenTranslations` and `ConversationScreenTranslations` expose
    `relatedSourcesTextPlural`
  - Docusaurus adapter: `theme.SearchModal.askAiScreen.relatedSourcesText` is
    now the singular "Source", and the new
    `theme.SearchModal.askAiScreen.relatedSourcesTextPlural` provides "Sources"

- ecd905d: feat(v5): UI and DX updates

  - Rename the Ask AI assistantId option to agentId (adapter theme.SearchModal.askAi.assistantId → agentId)
  - appId and apiKey moved up into @docsearch/core, so they're configured once and shared
  - Removed the indexName prop from the Sidepanel
  - Facet defaults can now be read from the index searchParameters
  - Restored nested grouping of search results

- ecd905d: Align Ask AI dynamic indices with Agent Studio completions: `askAi.indices` is now `string[]` (index names only). Use `askAi.searchParameters` for per-index runtime overrides.
- ecd905d: fix(docusaurus-adapter): Docusaurus styling cleanup
- ecd905d: Align CSS class and animation names with the `DocSearch-` naming convention.

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

- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
- Updated dependencies [ecd905d]
  - @docsearch/react@5.0.0
  - @docsearch/sidepanel@5.0.0
  - @docsearch/modal@5.0.0
  - @docsearch/core@5.0.0

## 5.0.0-beta.4

### Patch Changes

- Updated dependencies [ee9fddb]
  - @docsearch/react@5.0.0-beta.4
  - @docsearch/sidepanel@5.0.0-beta.4
  - @docsearch/modal@5.0.0-beta.4
  - @docsearch/core@5.0.0-beta.4

## 5.0.0-beta.3

### Patch Changes

- fe4d0c2: Align Ask AI dynamic indices with Agent Studio completions: `askAi.indices` is now `string[]` (index names only). Use `askAi.searchParameters` for per-index runtime overrides.
- c6a1ce1: fix(docusaurus-adapter): Docusaurus styling cleanup
- Updated dependencies [3f74c33]
- Updated dependencies [b33a7f7]
- Updated dependencies [fe4d0c2]
- Updated dependencies [4e44b55]
- Updated dependencies [9a1b3e4]
- Updated dependencies [b28bc84]
  - @docsearch/core@5.0.0-beta.3
  - @docsearch/react@5.0.0-beta.3
  - @docsearch/modal@5.0.0-beta.3
  - @docsearch/sidepanel@5.0.0-beta.3

## 5.0.0-beta.2

### Patch Changes

- 5eac1fd: feat(v5): General UI styling updates and fixes

  - New `--docsearch-font-family` variable, used by the search button, keyboard
    keys, modal, and sidepanel. It replaces the system font stacks that were
    duplicated across `sidepanel.css` and `button.css`, so overriding one
    variable now themes every DocSearch surface
  - The search input and modal heading are `1rem` at every breakpoint
    (previously `0.875rem` with a mobile-only override)
  - `.DocSearch-Title` uses `line-height: 1.5em` instead of `0.5em` and adds
    `overflow-wrap: anywhere`, so long titles wrap instead of overlapping (#2908)
  - Hit icon `svg` sizing moved into `.DocSearch-Hit-icon`. The
    `.DocSearch-Hit-icon--small` modifier is replaced by
    `.DocSearch-Hit-icon--start`, which top-aligns the icon; recent
    conversations use it
  - The Ask AI button icon centers with `display: inline-flex` instead of
    `margin-block-start`/`align-self` overrides
  - Removed the 2px offset on the Ask AI sources action text
  - `SourcesPanel` accepts `pluralTitleText`. `titleText` is now the singular
    label, and the trigger renders `{count} {label}`
  - `AskAiScreenTranslations` and `ConversationScreenTranslations` expose
    `relatedSourcesTextPlural`
  - Docusaurus adapter: `theme.SearchModal.askAiScreen.relatedSourcesText` is
    now the singular "Source", and the new
    `theme.SearchModal.askAiScreen.relatedSourcesTextPlural` provides "Sources"

- 4f6b5b1: feat(v5): UI and DX updates

  - Rename the Ask AI assistantId option to agentId (adapter theme.SearchModal.askAi.assistantId → agentId)
  - appId and apiKey moved up into @docsearch/core, so they're configured once and shared
  - Removed the indexName prop from the Sidepanel
  - Facet defaults can now be read from the index searchParameters
  - Restored nested grouping of search results

- Updated dependencies [5eac1fd]
- Updated dependencies [4f6b5b1]
- Updated dependencies [9fe6738]
  - @docsearch/react@5.0.0-beta.2
  - @docsearch/sidepanel@5.0.0-beta.2
  - @docsearch/modal@5.0.0-beta.2
  - @docsearch/core@5.0.0-beta.2

## 5.0.0-beta.1

### Patch Changes

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

- Updated dependencies [f8e0678]
- Updated dependencies [09861c8]
  - @docsearch/react@5.0.0-beta.1
  - @docsearch/modal@5.0.0-beta.1
  - @docsearch/sidepanel@5.0.0-beta.1
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
  - @docsearch/modal@5.0.0-beta.0
  - @docsearch/react@5.0.0-beta.0
  - @docsearch/sidepanel@5.0.0-beta.0
