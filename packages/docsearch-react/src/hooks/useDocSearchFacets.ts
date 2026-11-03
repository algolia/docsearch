import React from 'react';

import type { FacetBarFacet } from '../components/FacetBar';
import type { DocSearchFacet, DocSearchIndex } from '../DocSearch';
import { useFacetValues } from '../useFacetValues';
import type { useSearchClient } from '../useSearchClient';
import type {
  FacetSelections,
  FacetSelectionUpdate,
} from '../utils/createDocSearchSources';
import {
  deriveDefaultSelectedFacetsFromIndex,
  normalizeFacets,
} from '../utils/facets';

const EMPTY_SELECTION: string[] = [];

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
  /**
   * Replaces the selected values of a facet. An empty array clears the facet,
   * which also drops any configured `facetFilters` entry for that key.
   */
  handleFacetSelectionChange: (
    facet: string,
    update: FacetSelectionUpdate
  ) => void;
  clearFacetSelections: () => void;
}

/**
 * Compares two selections for a facet. A missing entry and an empty array are
 * both "nothing selected" so clearing an untouched facet doesn't trigger a
 * refresh.
 */
function areSelectionsEqual(
  a: string[] | undefined,
  b: string[] | undefined
): boolean {
  const left = a ?? EMPTY_SELECTION;
  const right = b ?? EMPTY_SELECTION;

  if (left === right) return true;
  if (left.length !== right.length) return false;

  return left.every((value, index) => value === right[index]);
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
    (facet: string, update: FacetSelectionUpdate): void => {
      const existing = facetSelectionsRef.current[facet];
      const values =
        typeof update === 'function'
          ? update(existing ?? EMPTY_SELECTION)
          : update;

      if (areSelectionsEqual(existing, values)) return;

      applySelections({ ...facetSelectionsRef.current, [facet]: values });
    },
    [applySelections]
  );

  const clearFacetSelections = React.useCallback(() => {
    const current = facetSelectionsRef.current;
    const next: FacetSelections = {};
    let hasSelectedValues = false;

    // Keep an explicit empty override for every exposed facet that already
    // has an entry, including facets the user cleared individually. Dropping
    // those entries would silently re-apply their configured `facetFilters`.
    for (const facet of normalizedFacetsRef.current) {
      const values = current[facet.key];

      if (values === undefined) continue;

      if (values.length > 0) {
        hasSelectedValues = true;
      }

      next[facet.key] = EMPTY_SELECTION;
    }

    if (!hasSelectedValues) return;

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
