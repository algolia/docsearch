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

- ecd905d: feat(v5): add customizable footer action

  - New `footerAction` prop renders a custom action in the modal footer,
    before the Algolia logo, inside `.DocSearch-Footer-Action`
  - `@docsearch/js` supports `footerAction` via template patterns (html helper,
    JSX, or function-based)
  - Fixes typing differences between `@docsearch/react` and `@docsearch/js`
  - Restyle the footer with a `.DocSearch-Footer-Actions` wrapper

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
  - @docsearch/core@5.0.0