import type {
  AutocompleteApi,
  AutocompleteState,
  BaseItem,
} from '@algolia/autocomplete-core';
import React from 'react';

import type { DocSearchProps } from './DocSearch';
import { ErrorScreen } from './ErrorScreen';
import { NoResultsScreen } from './NoResultsScreen';
import { ResultsScreen } from './ResultsScreen';
import { StartScreen } from './StartScreen';
import type { StoredSearchPlugin } from './stored-searches';
import type { InternalDocSearchHit, StoredDocSearchHit } from './types';

export interface ScreenStateProps<TItem extends BaseItem>
  extends AutocompleteApi<
    TItem,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<TItem>;
  recentSearches: StoredSearchPlugin<StoredDocSearchHit>;
  favoriteSearches: StoredSearchPlugin<StoredDocSearchHit>;
  onItemClick: (item: InternalDocSearchHit) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  hitComponent: DocSearchProps['hitComponent'];
  indexName: DocSearchProps['indexName'];
  disableUserPersonalization: boolean;
  resultsFooterComponent: DocSearchProps['resultsFooterComponent'];
}

export const ScreenState = React.memo(
  (props: ScreenStateProps<InternalDocSearchHit>) => {
    if (props.state.status === 'error') {
      return <ErrorScreen />;
    }

    const hasCollections = props.state.collections.some(
      (collection) => collection.items.length > 0
    );

    if (!props.state.query) {
      return <StartScreen {...props} hasCollections={hasCollections} />;
    }

    if (hasCollections === false) {
      return <NoResultsScreen {...props} />;
    }

    return <ResultsScreen {...props} />;
  },
  function areEqual(_prevProps, nextProps) {
    // We don't update the screen when Autocomplete is loading or stalled to
    // avoid UI flashes:
    //  - Empty screen → Results screen
    //  - NoResults screen → NoResults screen with another query
    return (
      nextProps.state.status === 'loading' ||
      nextProps.state.status === 'stalled'
    );
  }
);
