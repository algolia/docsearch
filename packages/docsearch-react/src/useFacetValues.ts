import type { SearchResponse } from 'algoliasearch/lite';
import React from 'react';

import type { DocSearchFacet, DocSearchIndex } from './DocSearch';
import type { DocSearchHit } from './types';
import type { useSearchClient } from './useSearchClient';

export type FacetValues = Record<string, string[]>;

export function useFacetValues({
  facets,
  indexes,
  searchClient,
}: {
  facets: DocSearchFacet[];
  indexes: DocSearchIndex[];
  searchClient: ReturnType<typeof useSearchClient>;
}): FacetValues {
  const [facetValues, setFacetValues] = React.useState<FacetValues>({});

  // Derive stable string keys so the effect only re-runs when the actual
  // facet keys or index names/searchParameters change, not on every render (the `facets` and
  // `indexes` props are recreated on each render and would otherwise loop).
  const stableFacetKeys = facets.map((facet) => facet.key).join(',');
  const stableIndexes = JSON.stringify(indexes.map((index) => [index.name, index.searchParameters ?? null]));

  React.useEffect(() => {
    let isMounted = true;

    const facetKeys = stableFacetKeys ? stableFacetKeys.split(',') : [];

    if (facetKeys.length === 0 || indexes.length === 0) {
      setFacetValues({});
      return () => {
        isMounted = false;
      };
    }

    searchClient
      .search<DocSearchHit>({
        requests: indexes.map((index) => ({
          ...(index.searchParameters ?? {}),
          indexName: index.name,
          query: '',
          hitsPerPage: 0,
          facets: facetKeys,
        })),
      })
      .then(({ results }) => {
        if (!isMounted) {
          return;
        }

        const valuesByFacet = facetKeys.reduce<FacetValues>((acc, facet) => {
          acc[facet] = [];
          return acc;
        }, {});

        results.forEach((res) => {
          const result = res as SearchResponse<DocSearchHit>;
          Object.entries(result.facets ?? {}).forEach(([facet, values]) => {
            if (!valuesByFacet[facet]) {
              return;
            }

            valuesByFacet[facet] = Array.from(new Set([...valuesByFacet[facet], ...Object.keys(values)])).sort();
          });
        });

        setFacetValues(valuesByFacet);
      })
      .catch(() => {
        if (isMounted) {
          setFacetValues({});
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableFacetKeys, stableIndexes, searchClient]);

  return facetValues;
}
