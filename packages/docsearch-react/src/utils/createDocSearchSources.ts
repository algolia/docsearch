import type {
  AutocompleteSource,
  AutocompleteState,
} from '@algolia/autocomplete-core';
import type { SearchParamsObject, SearchResponse } from 'algoliasearch/lite';
import type React from 'react';

import type { DocSearchIndex, DocSearchProps } from '../DocSearch';
import type {
  DocSearchHit,
  DocSearchState,
  InternalDocSearchHit,
} from '../types';
import type { useSearchClient } from '../useSearchClient';

import { SOURCE_IDS } from './collections';
import { groupBy } from './groupBy';
import { identity } from './identity';
import { isModifierEvent } from './isModifierEvent';
import { removeHighlightTags } from './removeHighlightTags';

export type BuildQuerySourcesState = Pick<
  AutocompleteState<InternalDocSearchHit>,
  'context'
>;

export type StoredSearchesLike<TItem> = {
  getAll: () => TItem[];
};

export type FacetSelections = Record<string, string>;

export function createFacetFilters(
  searchParametersFacetFilters: SearchParamsObject['facetFilters'],
  facetSelections: FacetSelections
): SearchParamsObject['facetFilters'] {
  const dynamicFacetFilters = Object.entries(facetSelections)
    .filter(([, value]) => value)
    .map(([facet, value]) => `${facet}:${value}`);

  if (dynamicFacetFilters.length === 0) {
    return searchParametersFacetFilters;
  }

  if (!searchParametersFacetFilters) {
    return dynamicFacetFilters;
  }

  return [...searchParametersFacetFilters, ...dynamicFacetFilters];
}

export function buildNoQuerySources({
  recentSearches,
  favoriteSearches,
  saveRecentSearch,
  onClose,
  disableUserPersonalization,
}: {
  recentSearches: StoredSearchesLike<unknown>;
  favoriteSearches: StoredSearchesLike<unknown>;
  saveRecentSearch: (item: InternalDocSearchHit) => void;
  onClose: () => void;
  disableUserPersonalization: boolean;
}): Array<AutocompleteSource<InternalDocSearchHit>> {
  if (disableUserPersonalization) {
    return [];
  }

  return [
    {
      sourceId: SOURCE_IDS.favoriteSearches,
      onSelect({ item, event }): void {
        saveRecentSearch(item);
        if (!isModifierEvent(event)) {
          onClose();
        }
      },
      getItemUrl({ item }): string {
        return item.url;
      },
      getItems(): InternalDocSearchHit[] {
        return favoriteSearches.getAll() as InternalDocSearchHit[];
      },
    },
    {
      sourceId: SOURCE_IDS.recentSearches,
      onSelect({ item, event }): void {
        saveRecentSearch(item);
        if (!isModifierEvent(event)) {
          onClose();
        }
      },
      getItemUrl({ item }): string {
        return item.url;
      },
      getItems(): InternalDocSearchHit[] {
        return recentSearches.getAll() as InternalDocSearchHit[];
      },
    },
  ];
}

export async function buildQuerySources({
  query,
  state: sourcesState,
  setContext,
  setStatus,
  searchClient,
  indexes,
  snippetLength,
  insights,
  appId,
  apiKey,
  maxResultsPerGroup,
  transformItems = identity,
  saveRecentSearch,
  onClose,
  facetSelections,
}: {
  query: string;
  state: BuildQuerySourcesState;
  setContext: (
    context: Partial<DocSearchState<InternalDocSearchHit>['context']>
  ) => void;
  setStatus: (status: DocSearchState<InternalDocSearchHit>['status']) => void;
  searchClient: ReturnType<typeof useSearchClient>;
  indexes: DocSearchIndex[];
  snippetLength: React.MutableRefObject<number>;
  insights: boolean;
  appId?: string;
  apiKey?: string;
  maxResultsPerGroup?: number;
  transformItems?: DocSearchProps['transformItems'];
  saveRecentSearch: (item: InternalDocSearchHit) => void;
  onClose: () => void;
  facetSelections: React.MutableRefObject<FacetSelections>;
}): Promise<Array<AutocompleteSource<InternalDocSearchHit>>> {
  const insightsActive = insights;

  try {
    const { results } = await searchClient.search<DocSearchHit>({
      requests: indexes.map((index) => {
        const indexName = index.name;
        const searchParams = index.searchParameters;
        const facetFilters = createFacetFilters(
          searchParams?.facetFilters,
          facetSelections.current
        );

        return {
          query,
          indexName,
          attributesToRetrieve: searchParams?.attributesToRetrieve ?? [
            'hierarchy.lvl0',
            'hierarchy.lvl1',
            'hierarchy.lvl2',
            'hierarchy.lvl3',
            'hierarchy.lvl4',
            'hierarchy.lvl5',
            'hierarchy.lvl6',
            'content',
            'type',
            'url',
          ],
          attributesToSnippet: searchParams?.attributesToSnippet ?? [
            `hierarchy.lvl1:${snippetLength.current}`,
            `hierarchy.lvl2:${snippetLength.current}`,
            `hierarchy.lvl3:${snippetLength.current}`,
            `hierarchy.lvl4:${snippetLength.current}`,
            `hierarchy.lvl5:${snippetLength.current}`,
            `hierarchy.lvl6:${snippetLength.current}`,
            `content:${snippetLength.current}`,
          ],
          snippetEllipsisText: searchParams?.snippetEllipsisText ?? '…',
          highlightPreTag: searchParams?.highlightPreTag ?? '<mark>',
          highlightPostTag: searchParams?.highlightPostTag ?? '</mark>',
          hitsPerPage: searchParams?.hitsPerPage ?? 20,
          clickAnalytics: searchParams?.clickAnalytics ?? insightsActive,
          ...searchParams,
          ...(facetFilters ? { facetFilters } : {}),
        };
      }),
    });

    return results.flatMap((res) => {
      const result = res as SearchResponse<DocSearchHit>;
      const { hits, nbHits } = result;
      const transformedHits = transformItems(hits);
      const sources = groupBy<DocSearchHit>(
        transformedHits,
        (hit) => removeHighlightTags(hit),
        maxResultsPerGroup
      );

      if (
        (sourcesState.context.searchSuggestions as unknown[]).length <
        Object.keys(sources).length
      ) {
        setContext({
          searchSuggestions: {
            ...(sourcesState.context.searchSuggestions ?? []),
            ...Object.keys(sources),
          },
        });
      }

      if (nbHits) {
        const currentNbHits = sourcesState.context.nbHits as number | undefined;
        setContext({
          nbHits: (currentNbHits ?? 0) + nbHits,
        });
      }

      let insightsParams = {};

      if (insightsActive) {
        insightsParams = {
          __autocomplete_indexName: result.index,
          __autocomplete_queryID: result.queryID,
          __autocomplete_algoliaCredentials: { appId, apiKey },
        };
      }

      const items = Object.values(sources).flat();

      return {
        sourceId: `hits_${result.index}`,
        onSelect({ item, event }): void {
          saveRecentSearch(item);
          if (!isModifierEvent(event)) {
            onClose();
          }
        },
        getItemUrl({ item }): string {
          return item.url;
        },
        getItems() {
          return Object.values(
            groupBy(items, (item) => item.hierarchy.lvl1, maxResultsPerGroup)
          )
            .map((groupedHits) =>
              groupedHits
                .map((item) => {
                  let parent: InternalDocSearchHit | null = null;

                  const potentialParent = groupedHits.find(
                    (siblingItem) =>
                      siblingItem.type === 'lvl1' &&
                      siblingItem.hierarchy.lvl1 === item.hierarchy.lvl1
                  ) as InternalDocSearchHit | undefined;

                  if (item.type !== 'lvl1' && potentialParent) {
                    parent = potentialParent;
                  }

                  return {
                    ...item,
                    __docsearch_parent: parent,
                    ...insightsParams,
                  };
                })
                .flat()
            )
            .flat();
        },
      };
    });
  } catch (error) {
    if ((error as Error).name === 'RetryError') {
      setStatus('error');
    }
    throw error;
  }
}
