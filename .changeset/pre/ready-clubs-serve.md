---
"@docsearch/react": patch
"@docsearch/css": patch
---

fix(askai): Ask AI fixes for v5

- `getMessageContent` now joins every assistant text part instead of stopping
  at the first one, so copying an answer that interleaves text with tool calls
  returns the complete response (#2782)
- Key Ask AI conversation storage by `appId` instead of `indexName`, fixes
  triggering a new conversation in hybrid mode
- Negative feedback panel is labelled with `aria-labelledby` and reason chips
  expose selection via `aria-pressed` (styling moved off the
  `--selected` modifier)
- `Popover.Trigger` forwards refs, fixes sources panel not showing in some cases
- Add `--docsearch-error-soft-color`, `--docsearch-error-text-color`, and
  `--docsearch-code-block-background` variables; restyle the Ask AI error panel
  and markdown code blocks to use them
```
