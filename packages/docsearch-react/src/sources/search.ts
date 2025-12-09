import type { AutocompleteSource, AutocompleteState } from '@algolia/autocomplete-core';
import type { SearchResponse } from 'algoliasearch/lite';

import type { DocSearchIndex, DocSearchProps } from '../DocSearch';
import type { DocSearchHit, DocSearchState, InternalDocSearchHit } from '../types';
import type { useSearchClient } from '../useSearchClient';
import { groupBy, identity, isModifierEvent, removeHighlightTags } from '../utils';

export type BuildQuerySourcesState = Pick<AutocompleteState<InternalDocSearchHit>, 'context'>;

/**
 * Helper function to build sources when there is a query
 * note: we only need specific parts of the state, not the full DocSearchState.
 */
export const buildQuerySources = async ({
  query,
  state: sourcesState,
  setContext,
  setStatus,
  searchClient,
  indexes: indices,
  snippetLength,
  insights,
  appId,
  apiKey,
  maxResultsPerGroup,
  transformItems = identity,
  saveRecentSearch,
  onClose,
}: {
  query: string;
  state: BuildQuerySourcesState;
  setContext: (context: Partial<DocSearchState<InternalDocSearchHit>['context']>) => void;
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
}): Promise<Array<AutocompleteSource<InternalDocSearchHit>>> => {
  const insightsActive = insights;

  try {
    const { results } = await searchClient.search<DocSearchHit>({
      requests: indices.map((index) => {
        const indexName = typeof index === 'string' ? index : index.name;
        const searchParams = typeof index === 'string' ? {} : index.searchParameters;

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
          ...(searchParams ?? {}),
        };
      }),
    });

    return results.flatMap((res) => {
      const result = res as SearchResponse<DocSearchHit>;
      const { hits, nbHits } = result;
      const transformedHits = transformItems(hits);
      const sources = groupBy<DocSearchHit>(transformedHits, (hit) => removeHighlightTags(hit), maxResultsPerGroup);

      // We store the `lvl0`s to display them as search suggestions
      // in the "no results" screen.
      if ((sourcesState.context.searchSuggestions as any[]).length < Object.keys(sources).length) {
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
          __autocomplete_algoliaCredentials: {
            appId,
            apiKey,
          },
        };
      }

      return Object.values<DocSearchHit[]>(sources).map((items, index) => {
        return {
          sourceId: `hits_${result.index}_${index}`,
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
            return Object.values(groupBy(items, (item) => item.hierarchy.lvl1, maxResultsPerGroup))
              .map((groupedHits) =>
                groupedHits.map((item) => {
                  let parent: InternalDocSearchHit | null = null;

                  const potentialParent = groupedHits.find(
                    (siblingItem) => siblingItem.type === 'lvl1' && siblingItem.hierarchy.lvl1 === item.hierarchy.lvl1,
                  ) as InternalDocSearchHit | undefined;

                  if (item.type !== 'lvl1' && potentialParent) {
                    parent = potentialParent;
                  }

                  return {
                    ...item,
                    __docsearch_parent: parent,
                    ...insightsParams,
                  };
                }),
              )
              .flat();
          },
        };
      });
    });
  } catch (error) {
    // The Algolia `RetryError` happens when all the servers have
    // failed, meaning that there's no chance the response comes
    // back. This is the right time to display an error.
    // See https://github.com/algolia/algoliasearch-client-javascript/blob/2ffddf59bc765cd1b664ee0346b28f00229d6e12/packages/transporter/src/errors/createRetryError.ts#L5
    if ((error as Error).name === 'RetryError') {
      setStatus('error');
    }
    throw error;
  }
};
