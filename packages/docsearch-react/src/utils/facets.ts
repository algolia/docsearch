import type { DocSearchFacet, DocSearchIndex } from '../DocSearch';

import type { FacetSelections } from './createDocSearchSources';

export const MAX_FACETS = 5;

export function normalizeFacets(
  facets: DocSearchFacet[] = []
): DocSearchFacet[] {
  const facetsMap = new Map<string, DocSearchFacet>();

  for (const facet of facets) {
    const key = facet.key.trim().toLowerCase();
    if (key.length === 0 || facetsMap.has(key)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (facetsMap.size >= MAX_FACETS) {
      break;
    }

    facetsMap.set(key, facet);
  }

  if (process.env.NODE_ENV !== 'production' && facets.length > MAX_FACETS) {
    // eslint-disable-next-line no-console
    console.warn(
      `DocSearch supports a maximum of ${MAX_FACETS} facets. Extra facets were ignored.`
    );
  }

  return Array.from(facetsMap.values());
}

export function getFacetLabel(facet: DocSearchFacet): string {
  if (facet.label) {
    return facet.label;
  }

  return facet.key
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function deriveDefaultSelectedFacetsFromIndex(
  indices: DocSearchIndex[]
): FacetSelections {
  const defaultFacets: FacetSelections = {};

  for (const index of indices) {
    const facetFilters = index.searchParameters?.facetFilters;

    for (const facetFilter of Array.isArray(facetFilters)
      ? facetFilters
      : [facetFilters]) {
      if (typeof facetFilter !== 'string') {
        continue;
      }

      const separatorIndex = facetFilter.indexOf(':');

      if (separatorIndex <= 0) {
        continue;
      }

      const key = facetFilter.slice(0, separatorIndex);
      const value = facetFilter.slice(separatorIndex + 1);

      if (key && value) {
        defaultFacets[key] = value;
      }
    }
  }

  return defaultFacets;
}
