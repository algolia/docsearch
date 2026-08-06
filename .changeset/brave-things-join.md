---
"@docsearch/docusaurus-adapter": patch
"@docsearch/sidepanel": patch
"@docsearch/modal": patch
"@docsearch/react": patch
"@docsearch/core": patch
---

feat(v5): UI and DX updates

- Rename the Ask AI assistantId option to agentId (adapter theme.SearchModal.askAi.assistantId → agentId)
- appId and apiKey moved up into @docsearch/core, so they're configured once and shared
- Removed the indexName prop from the Sidepanel
- Facet defaults can now be read from the index searchParameters
- Restored nested grouping of search results
