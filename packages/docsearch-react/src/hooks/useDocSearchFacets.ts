import React from 'react';

import type { FacetBarFacet } from '../components/FacetBar';
import type { DocSearchFacet, DocSearchIndex } from '../DocSearch';
import { useFacetValues } from '../useFacetValues';
import type { useSearchClient } from '../useSearchClient';
import type { FacetSelections } from '../utils/createDocSearchSources';
import {
  deriveDefaultSelectedFacetsFromIndex,
  normalizeFacets,
} from '../utils/facets';

export interface UseDocSearchFacetsProps {
  facets?: DocSearchFacet[];
  indexes: DocSearchIndex[];
  searchClient: ReturnType<typeof useSearchClient>;
  /**
   * Called after any facet selection change. Modals use this to refresh the
   * autocomplete results.
   */
  onSelectionsChange?: () => void;
}

export interface UseDocSearchFacetsResult {
  /** Facets that have at least one value, ready to be rendered by `FacetBar`. */
  visibleFacets: FacetBarFacet[];
  facetSelections: FacetSelections;
  /** Always-current selections, for consumption inside `getSources` closures. */
  facetSelectionsRef: React.MutableRefObject<FacetSelections>;
  handleFacetSelectionChange: (facet: string, value: string) => void;
  clearFacetSelections: () => void;
}

export function useDocSearchFacets({
  facets,
  indexes,
  searchClient,
  onSelectionsChange,
}: UseDocSearchFacetsProps): UseDocSearchFacetsResult {
  const normalizedFacets = React.useMemo(
    () => normalizeFacets(facets),
    [facets]
  );
  const normalizedFacetsRef = React.useRef(normalizedFacets);
  const facetValues = useFacetValues({
    facets: normalizedFacets,
    indexes,
    searchClient,
  });
  const [facetSelections, setFacetSelections] = React.useState<FacetSelections>(
    () => deriveDefaultSelectedFacetsFromIndex(indexes)
  );
  const facetSelectionsRef = React.useRef(facetSelections);

  const onSelectionsChangeRef = React.useRef(onSelectionsChange);

  const visibleFacets = React.useMemo(
    () =>
      normalizedFacets
        .map((facet) => ({ ...facet, values: facetValues[facet.key] ?? [] }))
        .filter((facet) => facet.values.length > 0),
    [facetValues, normalizedFacets]
  );

  React.useLayoutEffect(() => {
    normalizedFacetsRef.current = normalizedFacets;
    onSelectionsChangeRef.current = onSelectionsChange;
  });

  const applySelections = React.useCallback((next: FacetSelections): void => {
    facetSelectionsRef.current = next;
    setFacetSelections(next);
    onSelectionsChangeRef.current?.();
  }, []);

  const handleFacetSelectionChange = React.useCallback(
    (facet: string, value: string): void => {
      const existing = facetSelectionsRef.current[facet];

      if (existing === value) return;

      const next = { ...facetSelectionsRef.current };

      next[facet] = value;

      applySelections(next);
    },
    [applySelections]
  );

  const clearFacetSelections = React.useCallback(() => {
    if (Object.keys(facetSelectionsRef.current).length === 0) return;
    const next = {};

    for (const facet of normalizedFacetsRef.current) {
      if (facetSelectionsRef.current[facet.key]) {
        next[facet.key] = '';
      }
    }

    applySelections(next);
  }, [applySelections]);

  return {
    visibleFacets,
    facetSelections,
    facetSelectionsRef,
    handleFacetSelectionChange,
    clearFacetSelections,
  };
}
