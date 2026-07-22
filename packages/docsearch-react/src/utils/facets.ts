import type { DocSearchFacet } from '../DocSearch';

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
