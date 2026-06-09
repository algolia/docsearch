import type { UseChatHelpers } from '@ai-sdk/react';
import type { AutocompleteApi, AutocompleteState, BaseItem } from '@algolia/autocomplete-core';
import React from 'react';

import type { AskAiScreenTranslations } from './AskAiScreen';
import { AskAiScreen } from './AskAiScreen';
import type { AskAiStartScreenTranslations } from './components/AskAiStartScreen';
import { AskAiStartScreen } from './components/AskAiStartScreen';
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
import type { StoredSearchPlugin } from './stored-searches';
import type {
  InternalDocSearchHit,
  OnAskAiFeedback,
  StoredAskAiState,
  StoredDocSearchHit,
  SuggestedQuestionHit,
} from './types';
import type { AIMessage, AskAiState, ToolCalls } from './types/AskiAi';

export type AskAiScreenStateTranslations = Partial<{
  errorScreen: ErrorScreenTranslations;
  startScreen: AskAiStartScreenTranslations;
  noResultsScreen: NoResultsScreenTranslations;
  resultsScreen: ResultsScreenTranslations;
  askAiScreen: AskAiScreenTranslations;
  newConversation: NewConversationTranslations;
}>;

export interface AskAiScreenStateProps<TItem extends BaseItem>
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
  messages: UseChatHelpers<AIMessage>['messages'];
  tools: ToolCalls;
  status: UseChatHelpers<AIMessage>['status'];
  askAiError?: Error;
  disableUserPersonalization: boolean;
  resultsFooterComponent: DocSearchProps['resultsFooterComponent'];
  translations: AskAiScreenStateTranslations;
  getMissingResultsUrl?: DocSearchProps['getMissingResultsUrl'];
  hasCollections: boolean;
  onFeedback?: OnAskAiFeedback;
  askAiState: AskAiState;
  selectAskAiQuestion: (toggle: boolean, query: string) => void;
  suggestedQuestions: SuggestedQuestionHit[];
  selectSuggestedQuestion: (question: SuggestedQuestionHit) => void;
  onNewConversation: () => void;
  memoryEnabled?: boolean;
}

export const AskAiScreenState = React.memo(
  ({ translations = {}, ...props }: AskAiScreenStateProps<InternalDocSearchHit>) => {
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

    if (props.isAskAiActive && props.canHandleAskAi) {
      return (
        <AskAiScreen
          {...props}
          messages={props.messages}
          tools={props.tools}
          status={props.status}
          askAiError={props.askAiError}
          translations={translations?.askAiScreen}
          memoryEnabled={props.memoryEnabled}
        />
      );
    }

    if (props.state?.status === 'error') {
      return <ErrorScreen translations={translations?.errorScreen} />;
    }

    if (!props.state.query) {
      return (
        <AskAiStartScreen {...props} hasCollections={props.hasCollections} translations={translations?.startScreen} />
      );
    }

    if (!props.hasCollections && !props.canHandleAskAi) {
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
