/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { liteClient } from 'algoliasearch/lite';
import { useEffect, useMemo, useState } from 'react';

import { useAlgoliaContextualFacetFiltersIfEnabled, useAlgoliaThemeConfig } from '../../../client';
import { TOP_SECTIONS_FACET, TOP_SECTIONS_LIMIT } from '../constants';
import type { FacetValueItem } from '../types';
import { getIndexName } from '../utils';

/**
 * Fetches the most common top-level sections (`hierarchy.lvl0`) so the empty
 * state can offer "Browse by section" shortcuts. Runs a single facet-only query
 * (no hits) on mount.
 */
export function useTopSections(): FacetValueItem[] {
  const { appId, apiKey, indices } = useAlgoliaThemeConfig();
  const facetFilters = useAlgoliaContextualFacetFiltersIfEnabled();
  const searchIndex = indices[0]!;
  const indexName = getIndexName(searchIndex);

  const facetFiltersKey = useMemo(() => JSON.stringify(facetFilters ?? null), [facetFilters]);
  const [sections, setSections] = useState<FacetValueItem[]>([]);

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return undefined;
    }

    let cancelled = false;
    const client = liteClient(appId, apiKey);
    const parsedFacetFilters = JSON.parse(facetFiltersKey);

    client
      .search({
        requests: [
          {
            indexName,
            query: '',
            hitsPerPage: 0,
            facets: [TOP_SECTIONS_FACET],
            maxValuesPerFacet: TOP_SECTIONS_LIMIT,
            ...(parsedFacetFilters ? { facetFilters: parsedFacetFilters } : {}),
          },
        ],
      })
      .then((response) => {
        if (cancelled) {
          return;
        }
        const firstResult = response.results[0] as { facets?: { [facet: string]: { [value: string]: number } } };
        const values = firstResult?.facets?.[TOP_SECTIONS_FACET] ?? {};
        const items = Object.entries(values)
          .map(([name, count]) => ({ name, count, isRefined: false }))
          .sort((a, b) => b.count - a.count)
          .slice(0, TOP_SECTIONS_LIMIT);
        setSections(items);
      })
      .catch(() => {
        // Browse shortcuts are a non-critical enhancement; ignore failures.
      });

    return () => {
      cancelled = true;
    };
  }, [appId, apiKey, indexName, facetFiltersKey]);

  return sections;
}
