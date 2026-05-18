import React, { type JSX } from 'react';

import { CloseIcon, RecentIcon, StarIcon } from '../../icons';
import { Results } from '../../Results';
import type { ScreenStateProps } from '../../ScreenState';
import type { InternalDocSearchHit } from '../../types';

export type StoredSearchesSectionsTranslations = Partial<{
  recentSearchesTitle: string;
  noRecentSearchesText: string;
  saveRecentSearchButtonTitle: string;
  removeRecentSearchButtonTitle: string;
  favoriteSearchesTitle: string;
  removeFavoriteSearchButtonTitle: string;
}>;

type StoredSearchesSectionsProps = Omit<ScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  translations?: StoredSearchesSectionsTranslations;
};

export function StoredSearchesSections({ translations = {}, ...props }: StoredSearchesSectionsProps): JSX.Element {
  const {
    recentSearchesTitle = 'Recent',
    saveRecentSearchButtonTitle = 'Save this search',
    removeRecentSearchButtonTitle = 'Remove this search from history',
    favoriteSearchesTitle = 'Favorite',
    removeFavoriteSearchButtonTitle = 'Remove this search from favorites',
  } = translations;
  const recentSearchesCollection = props.state.collections[0];

  return (
    <>
      <Results
        {...props}
        title={recentSearchesTitle}
        collection={recentSearchesCollection}
        renderIcon={() => (
          <div className="DocSearch-Hit-icon">
            <RecentIcon />
          </div>
        )}
        renderAction={({ item }) => (
          <>
            <div className="DocSearch-Hit-action">
              <button
                className="DocSearch-Hit-action-button"
                title={saveRecentSearchButtonTitle}
                type="submit"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  props.favoriteSearches.add(item);
                  props.recentSearches.remove(item);
                  props.refresh();
                }}
              >
                <StarIcon />
              </button>
            </div>
            <div className="DocSearch-Hit-action">
              <button
                className="DocSearch-Hit-action-button"
                title={removeRecentSearchButtonTitle}
                type="submit"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  props.recentSearches.remove(item);
                  props.refresh();
                }}
              >
                <CloseIcon />
              </button>
            </div>
          </>
        )}
      />

      <Results
        {...props}
        title={favoriteSearchesTitle}
        collection={props.state.collections[1]}
        renderIcon={() => (
          <div className="DocSearch-Hit-icon">
            <StarIcon />
          </div>
        )}
        renderAction={({ item }) => (
          <div className="DocSearch-Hit-action">
            <button
              className="DocSearch-Hit-action-button"
              title={removeFavoriteSearchButtonTitle}
              type="submit"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                props.favoriteSearches.remove(item);
                props.refresh();
              }}
            >
              <CloseIcon />
            </button>
          </div>
        )}
      />
    </>
  );
}
