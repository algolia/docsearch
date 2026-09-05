---
"@docsearch/react": minor
"@docsearch/css": minor
---

feat(facets): Support selecting multiple values per facet

`FacetBar` now renders checkbox items instead of a radio group, so users can
select more than one value per facet. Selected values for the same facet are
combined into an Algolia `facetFilters` OR group; different facets are still
combined with AND. Configured `facetFilters` OR groups that share a single
facet key (for example `['lang:en', 'lang:fr']`) are now recognized as the
default selection for that facet, in addition to single `key:value` entries.
