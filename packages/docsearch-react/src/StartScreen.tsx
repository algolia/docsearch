import React from 'react';

import { RecentIcon, ResetIcon, StarIcon } from './icons';
import { Results } from './Results';
import type { ScreenStateProps } from './ScreenState';
import type { InternalDocSearchHit } from './types';

interface StartScreenProps extends ScreenStateProps<InternalDocSearchHit> {
  hasCollections: boolean;
}

export function StartScreen(props: StartScreenProps) {
  if (props.state.status === 'idle' && props.hasCollections === false) {
    if (props.disableUserPersonalization) {
      return null;
    }

    return (
      <div className="DocSearch-StartScreen">
        <p className="DocSearch-Help">No recent searches</p>
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
        title="Recent"
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
                title="Save this search"
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
                title="Remove this search from history"
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
        title="Favorites"
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
              title="Remove this search from favorites"
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
