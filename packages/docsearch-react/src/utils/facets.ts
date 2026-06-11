import type { DocSearchFacet } from '../DocSearch';

export const MAX_FACETS = 5;

export function normalizeFacets(facets: DocSearchFacet[] = []): DocSearchFacet[] {
  const normalizedFacets = facets.filter((facet) => facet.key.trim().length > 0).slice(0, MAX_FACETS);

  if (process.env.NODE_ENV !== 'production' && facets.length > MAX_FACETS) {
    // eslint-disable-next-line no-console
    console.warn(`DocSearch supports a maximum of ${MAX_FACETS} facets. Extra facets were ignored.`);
  }

  return normalizedFacets;
}

export function getFacetLabel(facet: DocSearchFacet): string {
  if (facet.label) {
    return facet.label;
  }

  return facet.key.replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
