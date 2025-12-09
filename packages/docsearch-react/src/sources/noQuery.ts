import type { AutocompleteSource } from '@algolia/autocomplete-core';

import type { createStoredSearches } from '../stored-searches';
import type { InternalDocSearchHit } from '../types';
import { isModifierEvent } from '../utils';

type BuildNoQuerySourcesOptions = {
  recentSearches: ReturnType<typeof createStoredSearches>;
  favoriteSearches: ReturnType<typeof createStoredSearches>;
  saveRecentSearch: (item: InternalDocSearchHit) => void;
  onClose: () => void;
  disableUserPersonalization: boolean;
  canHandleAskAi: boolean;
};

/**
 * Helper function to build sources when there is no query
 * useful for recent searches and favorite searches.
 */
export const buildNoQuerySources = ({
  recentSearches,
  favoriteSearches,
  saveRecentSearch,
  onClose,
  disableUserPersonalization,
}: BuildNoQuerySourcesOptions): Array<AutocompleteSource<InternalDocSearchHit>> => {
  if (disableUserPersonalization) {
    return [];
  }

  const sources: Array<AutocompleteSource<InternalDocSearchHit>> = [
    {
      sourceId: 'recentSearches',
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
    {
      sourceId: 'favoriteSearches',
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
  ];

  return sources;
};
