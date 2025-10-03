import React, { type JSX } from 'react';

import { RecentIcon, CloseIcon, StarIcon, SparklesIcon } from './icons';
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
  recentConversationsTitle: string;
  removeRecentConversationButtonTitle: string;
}>;

type StartScreenProps = Omit<ScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  hasCollections: boolean;
  translations?: StartScreenTranslations;
};

export function StartScreen({ translations = {}, ...props }: StartScreenProps): JSX.Element | null {
  const {
    recentSearchesTitle = 'Recent',
    saveRecentSearchButtonTitle = 'Save this search',
    removeRecentSearchButtonTitle = 'Remove this search from history',
    favoriteSearchesTitle = 'Favorite',
    removeFavoriteSearchButtonTitle = 'Remove this search from favorites',
    recentConversationsTitle = 'Recent conversations',
    removeRecentConversationButtonTitle = 'Remove this conversation from history',
  } = translations;

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

      <Results
        {...props}
        title={recentConversationsTitle}
        collection={props.state.collections[2]}
        renderIcon={() => (
          <div className="DocSearch-Hit-icon">
            <SparklesIcon />
          </div>
        )}
        renderAction={({ item }) => (
          <div className="DocSearch-Hit-action">
            <button
              className="DocSearch-Hit-action-button"
              title={removeRecentConversationButtonTitle}
              type="submit"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                props.conversations.remove(item);
                props.refresh();
              }}
            >
              <CloseIcon />
            </button>
          </div>
        )}
      />
    </div>
  );
}
