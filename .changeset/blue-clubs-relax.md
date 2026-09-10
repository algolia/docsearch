---
"@docsearch/sidepanel": minor
"@docsearch/react": minor
---

Add `@docsearch/react/sidepanelButton` and `@docsearch/react/sidepanelPanel` entry points so consumers can statically import the Sidepanel trigger while dynamically importing the panel (and its Ask AI/Markdown dependencies) only when needed. `@docsearch/sidepanel` now uses these split entries internally.
