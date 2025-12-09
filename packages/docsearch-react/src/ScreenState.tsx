import type { UseChatHelpers } from '@ai-sdk/react';
import type { AutocompleteApi, AutocompleteState, BaseItem } from '@algolia/autocomplete-core';
import React from 'react';

import type { AskAiScreenTranslations } from './AskAiScreen';
import { AskAiScreen } from './AskAiScreen';
import { ConversationHistoryScreen } from './ConversationHistoryScreen';
import type { DocSearchProps } from './DocSearch';
import type { ErrorScreenTranslations } from './ErrorScreen';
import { ErrorScreen } from './ErrorScreen';
import type { NewConversationTranslations } from './NewConversationScreen';
import { NewConversationScreen } from './NewConversationScreen';
import type { NoResultsScreenTranslations } from './NoResultsScreen';
import { NoResultsScreen } from './NoResultsScreen';
import type { ResultsScreenTranslations } from './ResultsScreen';
import { ResultsScreen } from './ResultsScreen';
import type { StartScreenTranslations } from './StartScreen';
import { StartScreen } from './StartScreen';
import type { StoredSearchPlugin } from './stored-searches';
import type { InternalDocSearchHit, StoredAskAiState, StoredDocSearchHit, SuggestedQuestionHit } from './types';
import type { AIMessage, AskAiState } from './types/AskiAi';

export type ScreenStateTranslations = Partial<{
  errorScreen: ErrorScreenTranslations;
  startScreen: StartScreenTranslations;
  noResultsScreen: NoResultsScreenTranslations;
  resultsScreen: ResultsScreenTranslations;
  askAiScreen: AskAiScreenTranslations;
  newConversation: NewConversationTranslations;
}>;

type SharedProps<TItem extends BaseItem> = {
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
};

export type AskAiScreenStateProps = {
  canHandleAskAi: boolean | true;
  isAskAiActive: boolean;
  onAskAiToggle: (toggle: boolean) => void;
  conversations: StoredSearchPlugin<StoredAskAiState>;
  messages: UseChatHelpers<AIMessage>['messages'];
  status: UseChatHelpers<AIMessage>['status'];
  askAiError?: Error;
  onFeedback?: (messageId: string, thumbs: 0 | 1) => Promise<void>;
  askAiState: AskAiState;
  selectAskAiQuestion: (toggle: boolean, query: string) => void;
  suggestedQuestions: SuggestedQuestionHit[];
  selectSuggestedQuestion: (question: SuggestedQuestionHit) => void;
};

type SearchOnlyaskAiScreenProps = {
  canHandleAskAi: false;
  isAskAiActive?: undefined;
  onAskAiToggle?: undefined;
  conversations?: undefined;
  messages?: undefined;
  status?: undefined;
  askAiError?: undefined;
  onFeedback?: undefined;
  askAiState?: undefined;
  selectAskAiQuestion?: undefined;
  suggestedQuestions?: undefined;
  selectSuggestedQuestion?: undefined;
};

export type ScreenStateProps<TItem extends BaseItem> = AutocompleteApi<
  TItem,
  React.FormEvent,
  React.MouseEvent,
  React.KeyboardEvent
> &
  SharedProps<TItem> &
  (AskAiScreenStateProps | SearchOnlyaskAiScreenProps);

export const ScreenState = React.memo(
  ({ translations = {}, ...props }: ScreenStateProps<InternalDocSearchHit>) => {
    if (props.canHandleAskAi && props.isAskAiActive && props.askAiState === 'conversation-history') {
      return <ConversationHistoryScreen {...props} />;
    }

    if (props.canHandleAskAi && props.isAskAiActive && props.askAiState === 'new-conversation') {
      return (
        <NewConversationScreen
          translations={translations?.newConversation}
          selectSuggestedQuestion={props.selectSuggestedQuestion}
          suggestedQuestions={props.suggestedQuestions}
        />
      );
    }

    if (props.canHandleAskAi && props.isAskAiActive) {
      return (
        <AskAiScreen
          {...props}
          messages={props.messages}
          status={props.status}
          askAiError={props.askAiError}
          translations={translations?.askAiScreen}
        />
      );
    }

    if (props.state?.status === 'error') {
      return <ErrorScreen translations={translations?.errorScreen} />;
    }

    if (!props.state.query) {
      return <StartScreen {...props} hasCollections={props.hasCollections} translations={translations?.startScreen} />;
    }

    if (!props.hasCollections && !props.canHandleAskAi) {
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
