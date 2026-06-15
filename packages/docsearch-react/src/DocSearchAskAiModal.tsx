import { createAutocomplete } from '@algolia/autocomplete-core';
import type { InitialAskAiMessage, OnAskAiToggle } from '@docsearch/core';
import type { ChatRequestOptions } from 'ai';
import React, { type JSX } from 'react';

import type { AskAiScreenStateTranslations } from './AskAiScreenState';
import { AskAiScreenState } from './AskAiScreenState';
import type { AskAiSearchBoxTranslations } from './components/AskAiSearchBox';
import { AskAiSearchBox } from './components/AskAiSearchBox';
import { ModalShell } from './components/ui/ModalShell';
import type { DocSearchAIProps } from './DocSearchAI';
import type { FooterTranslations } from './Footer';
import { Footer } from './Footer';
import { Hit } from './Hit';
import { useSendItemClickEvent } from './hooks/useDocSearchInsights';
import { useInitialModalQuery } from './hooks/useInitialModalQuery';
import { useModalEnvironment } from './hooks/useModalEnvironment';
import { useModalRefs } from './hooks/useModalRefs';
import { useRefreshOnInitialQuery } from './hooks/useRefreshOnInitialQuery';
import { useSaveRecentSearch } from './hooks/useSaveRecentSearch';
import { useStoredDocSearches } from './hooks/useStoredDocSearches';
import type { NewConversationTranslations } from './NewConversationScreen';
import type {
  DocSearchState,
  InternalDocSearchHit,
  OnAskAiFeedback,
  StoredAskAiMessage,
  StoredAskAiState,
  SuggestedQuestionHit,
} from './types';
import { type AskAiState } from './types/AskiAi';
import { useAskAi } from './useAskAi';
import { useSearchClient } from './useSearchClient';
import { useSuggestedQuestions } from './useSuggestedQuestions';
import { identity, isModifierEvent, noop, scrollTo as scrollToUtils } from './utils';
import { buildDummyAskAiHit, isThreadDepthError, EMPTY_TOOLS } from './utils/ai';
import { buildAskAiActionSources, buildRecentConversationSources } from './utils/createAskAiSources';
import { buildNoQuerySources, buildQuerySources, type BuildQuerySourcesState } from './utils/createDocSearchSources';
import { normalizeDocSearchIndexes } from './utils/normalizeDocSearchIndexes';

export type DocSearchAskAiModalTranslations = AskAiScreenStateTranslations &
  Partial<{
    searchBox: AskAiSearchBoxTranslations;
    newConversation: NewConversationTranslations;
    footer: FooterTranslations;
  }>;

export type DocSearchAskAiModalProps = DocSearchAIProps & {
  initialScrollY: number;
  onAskAiToggle: OnAskAiToggle;
  onClose?: () => void;
  isAskAiActive?: boolean;
  translations?: DocSearchAskAiModalTranslations;
  isHybridModeSupported?: boolean;
};

export function DocSearchAskAiModal({
  appId,
  apiKey,
  askAi,
  maxResultsPerGroup,
  theme,
  onClose = noop,
  transformItems = identity,
  hitComponent = Hit,
  resultsFooterComponent = (): JSX.Element | null => null,
  navigator,
  initialScrollY = 0,
  transformSearchClient = identity,
  disableUserPersonalization = false,
  initialQuery: initialQueryFromProp = '',
  translations = {},
  getMissingResultsUrl,
  insights = false,
  onAskAiToggle,
  interceptAskAiEvent,
  isAskAiActive = false,
  recentSearchesLimit = 7,
  recentSearchesWithFavoritesLimit = 4,
  indices = [],
  indexName,
  searchParameters,
  isHybridModeSupported = false,
  tools = EMPTY_TOOLS,
  ...props
}: DocSearchAskAiModalProps): JSX.Element {
  const { footer: footerTranslations, searchBox: searchBoxTranslations, ...screenStateTranslations } = translations;
  const [state, setState] = React.useState<DocSearchState<InternalDocSearchHit>>({
    query: '',
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    activeItemId: null,
    status: 'idle',
  });

  // check if the instance is configured to handle ask ai
  const canHandleAskAi = Boolean(askAi);

  let placeholder = translations?.searchBox?.placeholderText || props.placeholder || 'Search docs';

  if (canHandleAskAi) {
    placeholder = translations?.searchBox?.placeholderText || 'Search docs or ask AI a question';
  }

  if (isAskAiActive) {
    placeholder = translations?.searchBox?.placeholderTextAskAi || 'Ask another question...';
  }

  const { containerRef, modalRef, formElementRef, dropdownRef, inputRef, snippetLength } = useModalRefs();
  const { initialQuery, initialQueryFromSelection } = useInitialModalQuery(initialQueryFromProp);

  const searchClient = useSearchClient(appId, apiKey, transformSearchClient);

  const askAiConfig = typeof askAi === 'object' ? askAi : null;
  const askAiConfigurationId = askAiConfig ? askAiConfig.assistantId : (askAi as string);
  const askAiSearchParameters = askAiConfig?.searchParameters;
  const [askAiState, setAskAiState] = React.useState<AskAiState>('initial');
  const suggestedQuestions = useSuggestedQuestions({
    assistantId: askAiConfigurationId,
    searchClient,
    suggestedQuestionsEnabled: askAiConfig?.suggestedQuestions,
  });
  const memoryEnabled = props.memory?.enabled ?? false;

  const indexes = normalizeDocSearchIndexes({
    indexName,
    indices,
    searchParameters,
  });
  const defaultIndexName = indexes[0].name;

  const { favoriteSearches, recentSearches } = useStoredDocSearches({
    defaultIndexName,
    recentSearchesLimit,
    recentSearchesWithFavoritesLimit,
  });

  const [stoppedStream, setStoppedStream] = React.useState(false);

  const {
    chatId,
    messages,
    status,
    setMessages,
    sendMessage,
    stopAskAiStreaming,
    askAiError,
    sendFeedback,
    conversations,
    startNewConversation,
    restoreConversation,
  } = useAskAi({
    assistantId: askAiConfigurationId,
    apiKey: askAiConfig?.apiKey || apiKey,
    appId: askAiConfig?.appId || appId,
    indexName: askAiConfig?.indexName || defaultIndexName,
    searchParameters: askAiSearchParameters,
    tools,
    memory: props.memory,
    indices: askAiConfig?.indices,
  });

  const prevStatus = React.useRef(status);
  React.useEffect(() => {
    if (disableUserPersonalization) {
      return;
    }
    // if we just transitioned from "streaming" → "ready", persist
    if (prevStatus.current === 'streaming' && status === 'ready') {
      // if we stopped the stream, store it on the most recent message
      if (stoppedStream && messages.at(-1)) {
        messages.at(-1)!.metadata = {
          stopped: true,
        };
      }

      for (const part of messages[0].parts) {
        if (part.type === 'text') {
          conversations.add(buildDummyAskAiHit(part.text, messages, chatId));
        }
      }
    }
    prevStatus.current = status;
  }, [status, messages, conversations, disableUserPersonalization, stoppedStream, chatId]);

  // Check if there's a thread depth error (AI-217)
  const hasThreadDepthError = React.useMemo(() => {
    return status === 'error' && isThreadDepthError(askAiError as Error | undefined);
  }, [status, askAiError]);

  const saveRecentSearch = useSaveRecentSearch({
    favoriteSearches,
    recentSearches,
    disableUserPersonalization,
  });
  const sendItemClickEvent = useSendItemClickEvent(state);

  const autocompleteRef =
    React.useRef<
      ReturnType<
        typeof createAutocomplete<
          InternalDocSearchHit,
          React.FormEvent<HTMLFormElement>,
          React.MouseEvent,
          React.KeyboardEvent
        >
      >
    >(undefined);

  const handleSelectAskAiQuestion = React.useCallback(
    (toggle: boolean, query: string, suggestedQuestion: SuggestedQuestionHit | undefined = undefined) => {
      if (toggle) {
        const initialMessage: InitialAskAiMessage = {
          query,
          suggestedQuestionId: suggestedQuestion?.objectID,
        };

        if (interceptAskAiEvent?.(initialMessage)) {
          // Consumer handled it. Avoid *all* default Ask AI behavior.
          if (autocompleteRef.current) {
            autocompleteRef.current.setQuery('');
          }
          return;
        }
      }

      if (toggle && askAiState === 'new-conversation') {
        setAskAiState('initial');
      }

      onAskAiToggle(toggle, {
        query,
        suggestedQuestionId: suggestedQuestion?.objectID,
      });

      // If we're in hybrid mode, we don't need to send the message,
      // it will be handled by the Sidepanel.
      if (isHybridModeSupported) return;

      setStoppedStream(false);

      const messageOptions: ChatRequestOptions = {};

      if (suggestedQuestion) {
        messageOptions.body = {
          suggestedQuestionId: suggestedQuestion.objectID,
        };
      }

      sendMessage(
        {
          role: 'user',
          parts: [
            {
              type: 'text',
              text: query,
            },
          ],
        },
        messageOptions,
      );

      if (dropdownRef.current) {
        // some test environments (like jsdom) don't implement element.scrollTo
        const el = dropdownRef.current;
        if (typeof (el as any).scrollTo === 'function') {
          el.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // fallback for environments without scrollTo support
          el.scrollTop = 0;
        }
      }

      // clear the query
      if (autocompleteRef.current) {
        autocompleteRef.current.setQuery('');
      }
    },
    [askAiState, onAskAiToggle, isHybridModeSupported, sendMessage, dropdownRef, interceptAskAiEvent],
  );

  // feedback handler
  const handleFeedbackSubmit = React.useCallback<OnAskAiFeedback>(
    async (messageId, feedback): Promise<void> => {
      if (!askAiConfigurationId || !appId) return;
      await sendFeedback(messageId, feedback);
    },
    [askAiConfigurationId, appId, sendFeedback],
  );

  if (!autocompleteRef.current) {
    autocompleteRef.current = createAutocomplete({
      id: 'docsearch',
      defaultActiveItemId: 0,
      openOnFocus: true,
      initialState: {
        query: initialQuery,
        context: {
          searchSuggestions: [],
        },
      },
      insights: Boolean(insights),
      navigator,
      onStateChange(changes) {
        setState(changes.state);
      },
      getSources({ query, state: sourcesState, setContext, setStatus }) {
        if (!query) {
          const noQuerySources = buildNoQuerySources({
            recentSearches,
            favoriteSearches,
            saveRecentSearch,
            onClose,
            disableUserPersonalization,
          });

          const recentConversationSource = canHandleAskAi
            ? buildRecentConversationSources({
                conversations,
                disableUserPersonalization,
                setMessages,
                onAskAiToggle,
              })
            : [];
          return [...recentConversationSource, ...noQuerySources];
        }

        const querySourcesState: BuildQuerySourcesState = {
          context: sourcesState.context,
        };

        const algoliaSourcesPromise = buildQuerySources({
          query,
          state: querySourcesState,
          setContext,
          setStatus,
          searchClient,
          indexes,
          snippetLength,
          insights: Boolean(insights),
          appId,
          apiKey,
          maxResultsPerGroup,
          transformItems,
          saveRecentSearch,
          onClose,
        });

        const askAiSource = canHandleAskAi ? buildAskAiActionSources({ query, handleSelectAskAiQuestion }) : [];
        // Combine Algolia results (once resolved) with the Ask AI source
        return algoliaSourcesPromise.then((algoliaSources) => {
          return [...askAiSource, ...algoliaSources];
        });
      },
    });
  }

  const autocomplete = autocompleteRef.current;

  const { getEnvironmentProps, getRootProps, refresh } = autocomplete;

  useModalEnvironment({
    getEnvironmentProps,
    containerRef,
    dropdownRef,
    formElementRef,
    inputRef,
    initialScrollY,
    modalRef,
    snippetLength,
    theme,
  });

  React.useEffect(() => {
    if (dropdownRef.current && !isAskAiActive) {
      scrollToUtils(dropdownRef.current);
    }
  }, [state.query, isAskAiActive, dropdownRef]);

  useRefreshOnInitialQuery({ initialQuery, inputRef, refresh });

  const hasCurrentMessages = messages.length > 0;

  // Refresh the autocomplete results when ask ai is toggled off
  // helps return to the previous ac state and start screen
  React.useEffect(() => {
    if (!isAskAiActive) {
      autocomplete.refresh();

      if (hasCurrentMessages) {
        startNewConversation();
      }
    }
  }, [isAskAiActive, autocomplete, startNewConversation, hasCurrentMessages]);

  // Track external state in order to manage internal askAiState
  React.useEffect(() => {
    setAskAiState('initial');
  }, [isAskAiActive, setAskAiState]);

  const onStopAskAiStreaming = async (): Promise<void> => {
    setStoppedStream(true);

    await stopAskAiStreaming();
  };

  const handleNewConversation = (): void => {
    startNewConversation();
    setAskAiState('new-conversation');
  };

  const handleViewConversationHistory = (): void => {
    setAskAiState('conversation-history');
  };

  const selectSuggestedQuestion = (suggestedQuestion: SuggestedQuestionHit): void => {
    handleSelectAskAiQuestion(true, suggestedQuestion.question, suggestedQuestion);
  };

  // hide the dropdown on idle and no collections
  let showDocsearchDropdown = true;
  const hasCollections = state.collections.some((collection) => collection.items.length > 0);
  if (state.status === 'idle' && hasCollections === false && state.query.length === 0 && !isAskAiActive) {
    showDocsearchDropdown = false;
  }

  return (
    <ModalShell
      state={state}
      containerRef={containerRef}
      modalRef={modalRef}
      formElementRef={formElementRef}
      dropdownRef={dropdownRef}
      getRootProps={getRootProps}
      showDropdown={showDocsearchDropdown}
      searchBox={
        <AskAiSearchBox
          {...autocomplete}
          state={state}
          placeholder={placeholder || 'Search docs'}
          autoFocus={initialQuery.length === 0}
          inputRef={inputRef}
          isFromSelection={Boolean(initialQuery) && initialQuery === initialQueryFromSelection}
          translations={searchBoxTranslations}
          isAskAiActive={isAskAiActive}
          askAiStatus={status}
          askAiError={askAiError}
          askAiState={askAiState}
          setAskAiState={setAskAiState}
          isThreadDepthError={hasThreadDepthError && askAiState !== 'new-conversation'}
          onClose={onClose}
          onAskAiToggle={onAskAiToggle}
          onAskAgain={(query) => {
            handleSelectAskAiQuestion(true, query);
          }}
          onStopAskAiStreaming={onStopAskAiStreaming}
          onNewConversation={handleNewConversation}
          onViewConversationHistory={handleViewConversationHistory}
        />
      }
      screenState={
        <AskAiScreenState
          {...autocomplete}
          indexName={defaultIndexName}
          state={state}
          hitComponent={hitComponent}
          resultsFooterComponent={resultsFooterComponent}
          disableUserPersonalization={disableUserPersonalization}
          recentSearches={recentSearches}
          favoriteSearches={favoriteSearches}
          conversations={conversations}
          inputRef={inputRef}
          translations={screenStateTranslations}
          getMissingResultsUrl={getMissingResultsUrl}
          isAskAiActive={isAskAiActive}
          canHandleAskAi={canHandleAskAi}
          messages={messages}
          tools={tools}
          askAiError={askAiError}
          status={status}
          hasCollections={hasCollections}
          askAiState={askAiState}
          selectAskAiQuestion={handleSelectAskAiQuestion}
          suggestedQuestions={suggestedQuestions}
          selectSuggestedQuestion={selectSuggestedQuestion}
          memoryEnabled={memoryEnabled}
          onAskAiToggle={onAskAiToggle}
          onNewConversation={handleNewConversation}
          onItemClick={(item, event) => {
            if (item.type === 'askAI' && item.query) {
              if (item.anchor === 'stored' && 'messages' in item) {
                const hitMessages = item.messages as StoredAskAiMessage[];
                restoreConversation(hitMessages, (item as StoredAskAiState).chatId);
                const initialMessage: InitialAskAiMessage = {
                  query: item.query,
                  messageId: hitMessages[0].id,
                };

                if (interceptAskAiEvent?.(initialMessage)) {
                  if (autocompleteRef.current) {
                    autocompleteRef.current.setQuery('');
                  }
                  event.preventDefault();
                  return;
                }

                onAskAiToggle(true, initialMessage);
              } else {
                handleSelectAskAiQuestion(true, item.query);
              }
              setAskAiState('initial');
              event.preventDefault();
              return;
            }

            sendItemClickEvent(item);
            saveRecentSearch(item);
            if (!isModifierEvent(event)) {
              onClose();
            }
          }}
          onFeedback={handleFeedbackSubmit}
        />
      }
      footer={<Footer translations={footerTranslations} isAskAiActive={isAskAiActive} />}
      onClose={onClose}
    />
  );
}
