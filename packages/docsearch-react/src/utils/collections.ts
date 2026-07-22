import type { AutocompleteState, BaseItem } from '@algolia/autocomplete-core';

export const SOURCE_IDS = {
  askAI: 'askAI',
  favoriteSearches: 'favoriteSearches',
  recentConversations: 'recentConversations',
  recentSearches: 'recentSearches',
} as const;

export type KnownSourceId = (typeof SOURCE_IDS)[keyof typeof SOURCE_IDS];

type Collection<TItem extends BaseItem> =
  AutocompleteState<TItem>['collections'][number];

export function getCollection<TItem extends BaseItem>(
  state: { collections: Array<Collection<TItem> | null | undefined> },
  sourceId: KnownSourceId
): Collection<TItem> | undefined {
  return state.collections.find(
    (collection): collection is Collection<TItem> =>
      collection?.source.sourceId === sourceId
  );
}
