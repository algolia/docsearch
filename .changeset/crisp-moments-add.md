---
"@docsearch/react": minor
---

---

## "@docsearch/react": minor

feat(react): add `mergeFacetFilters` helper, exported from `@docsearch/react/utils`

Merges `facetFilters` the way faceted search does: values for the same facet across inputs are ORed, and different facets are ANDed. Negated values (`facet:-value`) are always ANDed.
