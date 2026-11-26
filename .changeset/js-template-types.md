---
"@docsearch/js": patch
---

Fix the types of `hitComponent`, `resultsFooterComponent` and `footerAction` templates. The published declarations referenced an undeclared `JSXInternal` namespace, so TypeScript accepted any return value.
