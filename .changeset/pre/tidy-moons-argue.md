---
"@docsearch/docusaurus-adapter": patch
"@docsearch/css": patch
"@docsearch/react": patch
---

Align CSS class and animation names with the `DocSearch-` naming convention.

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
