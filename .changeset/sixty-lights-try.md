---
"@docsearch/react": patch
"@docsearch/css": patch
"@docsearch/js": patch
---

feat(v5): add customizable footer action

- New `footerAction` prop renders a custom action in the modal footer,
  before the Algolia logo, inside `.DocSearch-Footer-Action`
- `@docsearch/js` supports `footerAction` via template patterns (html helper,
  JSX, or function-based)
- Fixes typing differences between `@docsearch/react` and `@docsearch/js`
- Restyle the footer with a `.DocSearch-Footer-Actions` wrapper
