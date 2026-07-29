---
"@docsearch/docusaurus-adapter": patch
"@docsearch/css": patch
"@docsearch/react": patch
---

Add an "Add Docs MCP" action to the footer and replace the "Powered by Algolia"
logo with the DocSearch × Algolia lockup.

- New `hideMCPCallout` prop (default `false`) on `DocSearch`, `DocSearchModal`
  and `DocSearchAskAiModal`, exposed as `themeConfig.docsearch.hideMCPCallout`
  in the Docusaurus adapter
- Footer commands and branding are now grouped under
  `.DocSearch-Footer-Actions`, with new `.DocSearch-ByAlgolia*` and
  `.DocSearch-DocsMCPAction` styles
- `AlgoliaLogo` is replaced by `DocSearchByAlgolia` and `AlgoliaWordMark`, with
  new `DocSearchMarkIcon` and `PlusIcon` icon exports
- `footer.poweredByText` and `footer.searchByText` are removed in favour of
  `footer.addDocsMCPText` and `footer.byAlgoliaAriaLabel`
- The Sidepanel `translations.logo` object is replaced by the
  `translations.byAlgoliaAriaLabel` string

If you override these footer or Sidepanel translations, or style any of the
removed selectors, update them accordingly.
