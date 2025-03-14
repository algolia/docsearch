import type {
  AutocompleteContext,
  AutocompleteInsightsApi,
  AutocompleteState,
  BaseItem,
} from '@algolia/autocomplete-core';

interface DocSearchContext extends AutocompleteContext {
  algoliaInsightsPlugin?: {
    insights: AutocompleteInsightsApi;
  };
}

export interface DocSearchState<TItem extends BaseItem> extends AutocompleteState<TItem> {
  context: DocSearchContext;
}
