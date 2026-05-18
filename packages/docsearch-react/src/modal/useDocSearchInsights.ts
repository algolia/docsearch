import type { AlgoliaInsightsHit } from '@algolia/autocomplete-core';
import React from 'react';

import type { DocSearchState, InternalDocSearchHit } from '../types';

export function useSendItemClickEvent(
  state: DocSearchState<InternalDocSearchHit>,
): (item: InternalDocSearchHit) => void {
  return React.useCallback(
    (item: InternalDocSearchHit): void => {
      if (!state.context.algoliaInsightsPlugin || !item.__autocomplete_id) {
        return;
      }

      const insightsItem = item as AlgoliaInsightsHit;

      state.context.algoliaInsightsPlugin.insights.clickedObjectIDsAfterSearch({
        eventName: 'Item Selected',
        index: insightsItem.__autocomplete_indexName,
        items: [insightsItem],
        positions: [item.__autocomplete_id],
        queryID: insightsItem.__autocomplete_queryID,
      });
    },
    [state.context.algoliaInsightsPlugin],
  );
}
