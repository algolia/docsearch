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

/**
 * Extracts the facet key from an Algolia `facetFilters` string entry such as
 * `language:en`. Returns `null` when the entry doesn't have a `key:value`
 * shape.
 */
export function getFacetFilterKey(facetFilter: string): string | null {
  const separatorIndex = facetFilter.indexOf(':');

  return separatorIndex <= 0 ? null : facetFilter.slice(0, separatorIndex);
}

function parseFacetFilter(
  facetFilter: string
): { key: string; value: string } | null {
  const key = getFacetFilterKey(facetFilter);

  if (key === null) {
    return null;
  }

  const value = facetFilter.slice(key.length + 1);

  return value ? { key, value } : null;
}

/**
 * Reads the initial facet selections from the configured `facetFilters` of each
 * index. Later indices override earlier ones for the same facet key.
 *
 * - A `key:value` string selects a single value.
 * - A nested OR group whose entries all share the same key (for example
 *   `['docusaurus_tag:default', 'docusaurus_tag:docs-default-current']`)
 *   selects every value in the group.
 * - OR groups that mix facet keys can't map to a single facet and are ignored.
 */
export function deriveDefaultSelectedFacetsFromIndex(
  indices: DocSearchIndex[]
): FacetSelections {
  const defaultFacets: FacetSelections = {};

  for (const index of indices) {
    const facetFilters = index.searchParameters?.facetFilters;

    for (const facetFilter of Array.isArray(facetFilters)
      ? facetFilters
      : [facetFilters]) {
      if (typeof facetFilter === 'string') {
        const parsed = parseFacetFilter(facetFilter);

        if (parsed) {
          defaultFacets[parsed.key] = [parsed.value];
        }

        continue;
      }

      if (!Array.isArray(facetFilter) || facetFilter.length === 0) {
        continue;
      }

      let groupKey: string | null = null;
      const groupValues: string[] = [];

      for (const entry of facetFilter) {
        const parsed =
          typeof entry === 'string' ? parseFacetFilter(entry) : null;

        if (!parsed || (groupKey !== null && parsed.key !== groupKey)) {
          groupKey = null;
          break;
        }

        groupKey = parsed.key;
        groupValues.push(parsed.value);
      }

      if (groupKey !== null) {
        defaultFacets[groupKey] = groupValues;
      }
    }
  }

  return defaultFacets;
}
