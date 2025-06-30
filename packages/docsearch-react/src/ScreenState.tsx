import type { UseChatHelpers } from '@ai-sdk/react';
import type { AutocompleteApi, AutocompleteState, BaseItem } from '@algolia/autocomplete-core';
import React from 'react';

import type { AskAiScreenTranslations } from './AskAiScreen';
import { AskAiScreen } from './AskAiScreen';
import type { DocSearchProps } from './DocSearch';
import type { ErrorScreenTranslations } from './ErrorScreen';
import { ErrorScreen } from './ErrorScreen';
import type { NoResultsScreenTranslations } from './NoResultsScreen';
import { NoResultsScreen } from './NoResultsScreen';
import type { ResultsScreenTranslations } from './ResultsScreen';
import { ResultsScreen } from './ResultsScreen';
import type { StartScreenTranslations } from './StartScreen';
import { StartScreen } from './StartScreen';
import type { StoredSearchPlugin } from './stored-searches';
import type { InternalDocSearchHit, StoredAskAiState, StoredDocSearchHit } from './types';

export type ScreenStateTranslations = Partial<{
  errorScreen: ErrorScreenTranslations;
  startScreen: StartScreenTranslations;
  noResultsScreen: NoResultsScreenTranslations;
  resultsScreen: ResultsScreenTranslations;
  askAiScreen: AskAiScreenTranslations;
}>;

export interface ScreenStateProps<TItem extends BaseItem>
  extends AutocompleteApi<TItem, React.FormEvent, React.MouseEvent, React.KeyboardEvent> {
  state: AutocompleteState<TItem>;
  recentSearches: StoredSearchPlugin<StoredDocSearchHit>;
  favoriteSearches: StoredSearchPlugin<StoredDocSearchHit>;
  conversations: StoredSearchPlugin<StoredAskAiState>;
  onItemClick: (item: InternalDocSearchHit, event: KeyboardEvent | MouseEvent) => void;
  onAskAiToggle: (toggle: boolean) => void;
  isAskAiActive: boolean;
  canHandleAskAi: boolean;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  hitComponent: DocSearchProps['hitComponent'];
  indexName: DocSearchProps['indexName'];
  messages: UseChatHelpers['messages'];
  status: UseChatHelpers['status'];
  askAiStreamError: Error | null;
  askAiFetchError: Error | undefined;
  disableUserPersonalization: boolean;
  resultsFooterComponent: DocSearchProps['resultsFooterComponent'];
  translations: ScreenStateTranslations;
  getMissingResultsUrl?: DocSearchProps['getMissingResultsUrl'];
}

export const ScreenState = React.memo(
  ({ translations = {}, ...props }: ScreenStateProps<InternalDocSearchHit>) => {
    if (props.isAskAiActive && props.canHandleAskAi) {
      return (
        <AskAiScreen
          {...props}
          messages={props.messages}
          status={props.status}
          askAiStreamError={props.askAiStreamError}
          askAiFetchError={props.askAiFetchError}
          translations={translations?.askAiScreen}
        />
      );
    }

    if (props.state?.status === 'error') {
      return <ErrorScreen translations={translations?.errorScreen} />;
    }

    const hasCollections = props.state.collections.some((collection) => collection.items.length > 0);

    if (!props.state.query) {
      return <StartScreen {...props} hasCollections={hasCollections} translations={translations?.startScreen} />;
    }

    if (hasCollections === false && !props.canHandleAskAi) {
      return <NoResultsScreen {...props} translations={translations?.noResultsScreen} />;
    }

    return (
      <>
        <ResultsScreen {...props} translations={translations?.resultsScreen} />
        {props.canHandleAskAi && props.state.collections.length === 1 && (
          // if there's one collection it is the ask ai action, show the no results screen
          <NoResultsScreen {...props} translations={translations?.noResultsScreen} />
        )}
      </>
    );
  },
  function areEqual(_prevProps, nextProps) {
    // We don't update the screen when Autocomplete is loading or stalled to
    // avoid UI flashes:
    //  - Empty screen → Results screen
    //  - NoResults screen → NoResults screen with another query
    return nextProps.state.status === 'loading' || nextProps.state.status === 'stalled';
  },
);
