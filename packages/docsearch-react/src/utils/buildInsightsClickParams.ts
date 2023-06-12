import type { AlgoliaInsightsHit } from '@algolia/autocomplete-core';
import type {
  InsightsParamsWithItems,
  ClickedObjectIDsAfterSearchParams,
} from '@algolia/autocomplete-plugin-algolia-insights';

import type { InternalDocSearchHit } from '../types';

export function buildInsightsClickParams(
  item: InternalDocSearchHit,
  itemPosition: number
): InsightsParamsWithItems<ClickedObjectIDsAfterSearchParams> {
  const insightsItem = item as AlgoliaInsightsHit;

  return {
    eventName: 'Item Selected',
    index: insightsItem.__autocomplete_indexName,
    items: [insightsItem],
    positions: [itemPosition],
    queryID: insightsItem.__autocomplete_queryID,
  };
}
