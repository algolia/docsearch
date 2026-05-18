import React from 'react';

import type { StoredSearchPlugin } from '../stored-searches';
import type { InternalDocSearchHit, StoredDocSearchHit } from '../types';

function createSyntheticParent(item: InternalDocSearchHit): InternalDocSearchHit {
  const hierarchy = item.hierarchy;
  const levels = ['lvl6', 'lvl5', 'lvl4', 'lvl3', 'lvl2', 'lvl1', 'lvl0'] as const;
  const deepestLevel = levels.find((level) => hierarchy[level]);

  return {
    ...item,
    type: deepestLevel || 'lvl0',
    content: null,
  };
}

export function useSaveRecentSearch({
  favoriteSearches,
  recentSearches,
  disableUserPersonalization,
}: {
  favoriteSearches: StoredSearchPlugin<StoredDocSearchHit>;
  recentSearches: StoredSearchPlugin<StoredDocSearchHit>;
  disableUserPersonalization: boolean;
}): (item: InternalDocSearchHit) => void {
  return React.useCallback(
    function saveRecentSearch(item: InternalDocSearchHit): void {
      if (disableUserPersonalization) {
        return;
      }

      const search = item.type === 'content' ? item.__docsearch_parent || createSyntheticParent(item) : item;

      if (search && favoriteSearches.getAll().findIndex((x) => x.objectID === search.objectID) === -1) {
        recentSearches.add(search);
      }
    },
    [favoriteSearches, recentSearches, disableUserPersonalization],
  );
}
