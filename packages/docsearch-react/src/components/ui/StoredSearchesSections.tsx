import React, { type JSX } from 'react';

import { CloseIcon, PinIcon, RecentIcon, SourceIcon } from '../../icons';
import { Results } from '../../Results';
import type { ScreenStateProps } from '../../ScreenState';
import type { InternalDocSearchHit } from '../../types';
import { getCollection } from '../../utils';

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
    recentSearchesTitle = 'Recently viewed docs',
    saveRecentSearchButtonTitle = 'Pin this search',
    removeRecentSearchButtonTitle = 'Remove this search from history',
    favoriteSearchesTitle = 'Pinned',
    removeFavoriteSearchButtonTitle = 'Remove this saved search',
  } = translations;
  const favoriteSearches = getCollection(props.state, 'favoriteSearches');
  const recentSearchesCollection = getCollection(props.state, 'recentSearches');

  return (
    <>
      {favoriteSearches && (
        <Results
          {...props}
          title={favoriteSearchesTitle}
          collection={favoriteSearches}
          sourceIcon={<PinIcon />}
          renderIcon={({ item }) => (
            <div className="DocSearch-Hit-icon">
              <SourceIcon type={item.type} />
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
      )}

      {recentSearchesCollection && (
        <Results
          {...props}
          title={recentSearchesTitle}
          collection={recentSearchesCollection}
          sourceIcon={<RecentIcon />}
          renderIcon={({ item }) => (
            <div className="DocSearch-Hit-icon">
              <SourceIcon type={item.type} />
            </div>
          )}
          renderAction={({ item }) => (
            <>
              <div className="DocSearch-Hit-action">
                <button
                  className="DocSearch-Hit-action-button DocSearch-Hit-action-button--pin"
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
                  <PinIcon />
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
      )}
    </>
  );
}
