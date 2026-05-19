import React from 'react';

import { createStoredSearches } from '../stored-searches';
import type { StoredDocSearchHit } from '../types';

export function useStoredDocSearches({
  defaultIndexName,
  recentSearchesLimit,
  recentSearchesWithFavoritesLimit,
}: {
  defaultIndexName: string;
  recentSearchesLimit: number;
  recentSearchesWithFavoritesLimit: number;
}): {
  favoriteSearches: ReturnType<typeof createStoredSearches<StoredDocSearchHit>>;
  recentSearches: ReturnType<typeof createStoredSearches<StoredDocSearchHit>>;
} {
  const favoriteSearches = React.useRef(
    createStoredSearches<StoredDocSearchHit>({
      key: `__DOCSEARCH_FAVORITE_SEARCHES__${defaultIndexName}`,
      limit: 10,
    }),
  ).current;

  const recentSearches = React.useRef(
    createStoredSearches<StoredDocSearchHit>({
      key: `__DOCSEARCH_RECENT_SEARCHES__${defaultIndexName}`,
      limit: favoriteSearches.getAll().length === 0 ? recentSearchesLimit : recentSearchesWithFavoritesLimit,
    }),
  ).current;

  return { favoriteSearches, recentSearches };
}
