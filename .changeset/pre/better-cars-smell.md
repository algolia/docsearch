---
"@docsearch/docusaurus-adapter": patch
"@docsearch/react": patch
"@docsearch/css": patch
---

feat(v5): General UI styling updates and fixes

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
