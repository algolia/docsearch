import React from 'react';

import { RecentIcon, ResetIcon, StarIcon } from './icons';
import { Results } from './Results';
import type { ScreenStateProps } from './ScreenState';
import type { InternalDocSearchHit } from './types';

export type StartScreenTranslations = Partial<{
  recentSearchesTitle: string;
  noRecentSearchesText: string;
  saveRecentSearchButtonTitle: string;
  removeRecentSearchButtonTitle: string;
  favoriteSearchesTitle: string;
  removeFavoriteSearchButtonTitle: string;
}>;

type StartScreenProps = Omit<
  ScreenStateProps<InternalDocSearchHit>,
  'translations'
> & {
  hasCollections: boolean;
  translations?: StartScreenTranslations;
};

export function StartScreen({ translations = {}, ...props }: StartScreenProps) {
  const {
    recentSearchesTitle = 'Recent',
    noRecentSearchesText = 'No recent searches',
    saveRecentSearchButtonTitle = 'Save this search',
    removeRecentSearchButtonTitle = 'Remove this search from history',
    favoriteSearchesTitle = 'Favorite',
    removeFavoriteSearchButtonTitle = 'Remove this search from favorites',
  } = translations;
  if (props.state.status === 'idle' && props.hasCollections === false) {
    if (props.disableUserPersonalization) {
      return null;
    }

    return (
      <div className="DocSearch-StartScreen">
        <p className="DocSearch-Help">{noRecentSearchesText}</p>
      </div>
    );
  }

  if (props.hasCollections === false) {
    return null;
  }

  return (
    <div className="DocSearch-Dropdown-Container">
      <Results
        {...props}
        title={recentSearchesTitle}
        collection={props.state.collections[0]}
        renderIcon={() => (
          <div className="DocSearch-Hit-icon">
            <RecentIcon />
          </div>
        )}
        renderAction={({
          item,
          runFavoriteTransition,
          runDeleteTransition,
        }) => (
          <>
            <div className="DocSearch-Hit-action">
              <button
                className="DocSearch-Hit-action-button"
                title={saveRecentSearchButtonTitle}
                type="submit"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  runFavoriteTransition(() => {
                    props.favoriteSearches.add(item);
                    props.recentSearches.remove(item);
                    props.refresh();
                  });
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
                  runDeleteTransition(() => {
                    props.recentSearches.remove(item);
                    props.refresh();
                  });
                }}
              >
                <ResetIcon />
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
        renderAction={({ item, runDeleteTransition }) => (
          <div className="DocSearch-Hit-action">
            <button
              className="DocSearch-Hit-action-button"
              title={removeFavoriteSearchButtonTitle}
              type="submit"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                runDeleteTransition(() => {
                  props.favoriteSearches.remove(item);
                  props.refresh();
                });
              }}
            >
              <ResetIcon />
            </button>
          </div>
        )}
      />
    </div>
  );
}
