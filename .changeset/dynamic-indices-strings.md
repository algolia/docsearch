---
"@docsearch/react": patch
"@docsearch/docusaurus-adapter": patch
---

Align Ask AI dynamic indices with Agent Studio completions: `askAi.indices` is now `string[]` (index names only). Use `askAi.searchParameters` for per-index runtime overrides.
