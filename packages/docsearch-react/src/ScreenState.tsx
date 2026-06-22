import type { AutocompleteApi, AutocompleteState, BaseItem } from '@algolia/autocomplete-core';
import React from 'react';

import type { KeywordStartScreenTranslations } from './components/KeywordStartScreen';
import { KeywordStartScreen } from './components/KeywordStartScreen';
import type { DocSearchProps } from './DocSearch';
import type { ErrorScreenTranslations } from './ErrorScreen';
import { ErrorScreen } from './ErrorScreen';
import type { NoResultsScreenTranslations } from './NoResultsScreen';
import { NoResultsScreen } from './NoResultsScreen';
import type { ResultsScreenTranslations } from './ResultsScreen';
import { ResultsScreen } from './ResultsScreen';
import type { StoredSearchPlugin } from './stored-searches';
import type { InternalDocSearchHit, StoredDocSearchHit } from './types';

export type ScreenStateTranslations = Partial<{
  errorScreen: ErrorScreenTranslations;
  startScreen: KeywordStartScreenTranslations;
  noResultsScreen: NoResultsScreenTranslations;
  resultsScreen: ResultsScreenTranslations;
}>;

export interface ScreenStateProps<TItem extends BaseItem>
  extends AutocompleteApi<TItem, React.FormEvent, React.MouseEvent, React.KeyboardEvent> {
  state: AutocompleteState<TItem>;
  recentSearches: StoredSearchPlugin<StoredDocSearchHit>;
  favoriteSearches: StoredSearchPlugin<StoredDocSearchHit>;
  onItemClick: (item: InternalDocSearchHit, event: KeyboardEvent | MouseEvent) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  hitComponent: DocSearchProps['hitComponent'];
  indexName: DocSearchProps['indexName'];
  disableUserPersonalization: boolean;
  resultsFooterComponent: DocSearchProps['resultsFooterComponent'];
  translations: ScreenStateTranslations;
  getMissingResultsUrl?: DocSearchProps['getMissingResultsUrl'];
  hasCollections: boolean;
  resultBadgeKey?: string;
}

export const ScreenState = React.memo(
  ({ translations = {}, ...props }: ScreenStateProps<InternalDocSearchHit>) => {
    if (props.state?.status === 'error') {
      return <ErrorScreen translations={translations?.errorScreen} />;
    }

    if (!props.state.query) {
      return (
        <KeywordStartScreen {...props} hasCollections={props.hasCollections} translations={translations?.startScreen} />
      );
    }

    if (!props.hasCollections) {
      return <NoResultsScreen {...props} translations={translations?.noResultsScreen} />;
    }

    return <ResultsScreen {...props} translations={translations?.resultsScreen} />;
  },
  function areEqual(_prevProps, nextProps) {
    // We don't update the screen when Autocomplete is loading or stalled to
    // avoid UI flashes:
    //  - Empty screen → Results screen
    //  - NoResults screen → NoResults screen with another query
    return nextProps.state.status === 'loading' || nextProps.state.status === 'stalled';
  },
);
