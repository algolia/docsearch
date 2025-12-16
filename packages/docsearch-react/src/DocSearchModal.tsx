import { useChat } from '@ai-sdk/react';
import {
  type AutocompleteSource,
  type AlgoliaInsightsHit,
  createAutocomplete,
  type AutocompleteState,
} from '@algolia/autocomplete-core';
import { useTheme } from '@docsearch/core/useTheme';
import type { ChatRequestOptions } from 'ai';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import type { SearchResponse } from 'algoliasearch/lite';
import React, { type JSX } from 'react';

import { getValidToken, postFeedback } from './askai';
import { ASK_AI_API_URL, MAX_QUERY_SIZE, USE_ASK_AI_TOKEN } from './constants';
import type { DocSearchIndex, DocSearchProps } from './DocSearch';
import type { FooterTranslations } from './Footer';
import { Footer } from './Footer';
import { Hit } from './Hit';
import type { NewConversationTranslations } from './NewConversationScreen';
import type { ScreenStateTranslations } from './ScreenState';
import { ScreenState } from './ScreenState';
import type { SearchBoxTranslations } from './SearchBox';
import { SearchBox } from './SearchBox';
import { createStoredConversations, createStoredSearches } from './stored-searches';
import type {
  DocSearchHit,
  DocSearchState,
  InternalDocSearchHit,
  StoredAskAiState,
  StoredDocSearchHit,
  SuggestedQuestionHit,
} from './types';
import type { AIMessage, AskAiState } from './types/AskiAi';
import { useSearchClient } from './useSearchClient';
import { useSuggestedQuestions } from './useSuggestedQuestions';
import { useTouchEvents } from './useTouchEvents';
import { useTrapFocus } from './useTrapFocus';
import { groupBy, identity, noop, removeHighlightTags, isModifierEvent, scrollTo as scrollToUtils } from './utils';
import { buildDummyAskAiHit, isThreadDepthError } from './utils/ai';
import { manageLocalStorageQuota } from './utils/storage';

export type ModalTranslations = Partial<{
  searchBox: SearchBoxTranslations;
  newConversation: NewConversationTranslations;
  footer: FooterTranslations;
}> &
  ScreenStateTranslations;

export type DocSearchModalProps = DocSearchProps & {
  initialScrollY: number;
  onAskAiToggle: (toggle: boolean) => void;
  onClose?: () => void;
  isAskAiActive?: boolean;
  translations?: ModalTranslations;
};

/**
 * Helper function to build sources when there is no query
 * useful for recent searches and favorite searches.
 */
type BuildNoQuerySourcesOptions = {
  recentSearches: ReturnType<typeof createStoredSearches>;
  favoriteSearches: ReturnType<typeof createStoredSearches>;
  saveRecentSearch: (item: InternalDocSearchHit) => void;
  onClose: () => void;
  disableUserPersonalization: boolean;
  canHandleAskAi: boolean;
};

const buildNoQuerySources = ({
  recentSearches,
  favoriteSearches,
  saveRecentSearch,
  onClose,
  disableUserPersonalization,
}: BuildNoQuerySourcesOptions): Array<AutocompleteSource<InternalDocSearchHit>> => {
  if (disableUserPersonalization) {
    return [];
  }

  const sources: Array<AutocompleteSource<InternalDocSearchHit>> = [
    {
      sourceId: 'recentSearches',
      onSelect({ item, event }): void {
        saveRecentSearch(item);
        if (!isModifierEvent(event)) {
          onClose();
        }
      },
      getItemUrl({ item }): string {
        return item.url;
      },
      getItems(): InternalDocSearchHit[] {
        return recentSearches.getAll() as InternalDocSearchHit[];
      },
    },
    {
      sourceId: 'favoriteSearches',
      onSelect({ item, event }): void {
        saveRecentSearch(item);
        if (!isModifierEvent(event)) {
          onClose();
        }
      },
      getItemUrl({ item }): string {
        return item.url;
      },
      getItems(): InternalDocSearchHit[] {
        return favoriteSearches.getAll() as InternalDocSearchHit[];
      },
    },
  ];

  return sources;
};

type BuildQuerySourcesState = Pick<AutocompleteState<InternalDocSearchHit>, 'context'>;

/**
 * Helper function to build sources when there is a query
 * note: we only need specific parts of the state, not the full DocSearchState.
 */
const buildQuerySources = async ({
  query,
  state: sourcesState,
  setContext,
  setStatus,
  searchClient,
  indexes: indices,
  snippetLength,
  insights,
  appId,
  apiKey,
  maxResultsPerGroup,
  transformItems = identity,
  saveRecentSearch,
  onClose,
}: {
  query: string;
  state: BuildQuerySourcesState;
  setContext: (context: Partial<DocSearchState<InternalDocSearchHit>['context']>) => void;
  setStatus: (status: DocSearchState<InternalDocSearchHit>['status']) => void;
  searchClient: ReturnType<typeof useSearchClient>;
  indexes: DocSearchIndex[];
  snippetLength: React.MutableRefObject<number>;
  insights: boolean;
  appId?: string;
  apiKey?: string;
  maxResultsPerGroup?: number;
  transformItems?: DocSearchProps['transformItems'];
  saveRecentSearch: (item: InternalDocSearchHit) => void;
  onClose: () => void;
}): Promise<Array<AutocompleteSource<InternalDocSearchHit>>> => {
  const insightsActive = insights;

  try {
    const { results } = await searchClient.search<DocSearchHit>({
      requests: indices.map((index) => {
        const indexName = typeof index === 'string' ? index : index.name;
        const searchParams = typeof index === 'string' ? {} : index.searchParameters;

        return {
          query,
          indexName,
          attributesToRetrieve: searchParams?.attributesToRetrieve ?? [
            'hierarchy.lvl0',
            'hierarchy.lvl1',
            'hierarchy.lvl2',
            'hierarchy.lvl3',
            'hierarchy.lvl4',
            'hierarchy.lvl5',
            'hierarchy.lvl6',
            'content',
            'type',
            'url',
          ],
          attributesToSnippet: searchParams?.attributesToSnippet ?? [
            `hierarchy.lvl1:${snippetLength.current}`,
            `hierarchy.lvl2:${snippetLength.current}`,
            `hierarchy.lvl3:${snippetLength.current}`,
            `hierarchy.lvl4:${snippetLength.current}`,
            `hierarchy.lvl5:${snippetLength.current}`,
            `hierarchy.lvl6:${snippetLength.current}`,
            `content:${snippetLength.current}`,
          ],
          snippetEllipsisText: searchParams?.snippetEllipsisText ?? '…',
          highlightPreTag: searchParams?.highlightPreTag ?? '<mark>',
          highlightPostTag: searchParams?.highlightPostTag ?? '</mark>',
          hitsPerPage: searchParams?.hitsPerPage ?? 20,
          clickAnalytics: searchParams?.clickAnalytics ?? insightsActive,
          ...(searchParams ?? {}),
        };
      }),
    });

    return results.flatMap((res) => {
      const result = res as SearchResponse<DocSearchHit>;
      const { hits, nbHits } = result;
      const transformedHits = transformItems(hits);
      const sources = groupBy<DocSearchHit>(transformedHits, (hit) => removeHighlightTags(hit), maxResultsPerGroup);

      // We store the `lvl0`s to display them as search suggestions
      // in the "no results" screen.
      if ((sourcesState.context.searchSuggestions as any[]).length < Object.keys(sources).length) {
        setContext({
          searchSuggestions: {
            ...(sourcesState.context.searchSuggestions ?? []),
            ...Object.keys(sources),
          },
        });
      }

      if (nbHits) {
        const currentNbHits = sourcesState.context.nbHits as number | undefined;
        setContext({
          nbHits: (currentNbHits ?? 0) + nbHits,
        });
      }

      let insightsParams = {};

      if (insightsActive) {
        insightsParams = {
          __autocomplete_indexName: result.index,
          __autocomplete_queryID: result.queryID,
          __autocomplete_algoliaCredentials: {
            appId,
            apiKey,
          },
        };
      }

      return Object.values<DocSearchHit[]>(sources).map((items, index) => {
        return {
          sourceId: `hits_${result.index}_${index}`,
          onSelect({ item, event }): void {
            saveRecentSearch(item);
            if (!isModifierEvent(event)) {
              onClose();
            }
          },
          getItemUrl({ item }): string {
            return item.url;
          },
          getItems(): InternalDocSearchHit[] {
            return Object.values(groupBy(items, (item) => item.hierarchy.lvl1, maxResultsPerGroup))
              .map((groupedHits) =>
                groupedHits.map((item) => {
                  let parent: InternalDocSearchHit | null = null;

                  const potentialParent = groupedHits.find(
                    (siblingItem) => siblingItem.type === 'lvl1' && siblingItem.hierarchy.lvl1 === item.hierarchy.lvl1,
                  ) as InternalDocSearchHit | undefined;

                  if (item.type !== 'lvl1' && potentialParent) {
                    parent = potentialParent;
                  }

                  return {
                    ...item,
                    __docsearch_parent: parent,
                    ...insightsParams,
                  };
                }),
              )
              .flat();
          },
        };
      });
    });
  } catch (error) {
    // The Algolia `RetryError` happens when all the servers have
    // failed, meaning that there's no chance the response comes
    // back. This is the right time to display an error.
    // See https://github.com/algolia/algoliasearch-client-javascript/blob/2ffddf59bc765cd1b664ee0346b28f00229d6e12/packages/transporter/src/errors/createRetryError.ts#L5
    if ((error as Error).name === 'RetryError') {
      setStatus('error');
    }
    throw error;
  }
};

export function DocSearchModal({
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
  isAskAiActive = false,
  recentSearchesLimit = 7,
  recentSearchesWithFavoritesLimit = 4,
  indices = [],
  indexName,
  searchParameters,
  ...props
}: DocSearchModalProps): JSX.Element {
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

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  const formElementRef = React.useRef<HTMLDivElement | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const snippetLength = React.useRef<number>(15);
  const initialQueryFromSelection = React.useRef(
    typeof window !== 'undefined' ? window.getSelection()!.toString().slice(0, MAX_QUERY_SIZE) : '',
  ).current;
  const initialQuery = React.useRef(initialQueryFromProp || initialQueryFromSelection).current;

  const searchClient = useSearchClient(appId, apiKey, transformSearchClient);

  const askAiConfig = typeof askAi === 'object' ? askAi : null;
  const askAiConfigurationId = typeof askAi === 'string' ? askAi : askAiConfig?.assistantId || null;
  const askAiSearchParameters = askAiConfig?.searchParameters;
  const [askAiState, setAskAiState] = React.useState<AskAiState>('initial');
  const suggestedQuestions = useSuggestedQuestions({
    assistantId: askAiConfigurationId,
    searchClient,
    suggestedQuestionsEnabled: askAiConfig?.suggestedQuestions,
  });

  // Format the `indexes` to be used until `indexName` and `searchParameters` props are fully removed.
  const indexes: DocSearchIndex[] = [];

  if (indexName && indexName !== '') {
    indexes.push({
      name: indexName,
      searchParameters,
    });
  }

  if (indices.length > 0) {
    indices.forEach((index) => {
      indexes.push(typeof index === 'string' ? { name: index } : index);
    });
  }

  if (indexes.length < 1) {
    throw new Error('Must supply either `indexName` or `indices` for DocSearch to work');
  }

  const defaultIndexName = indexes[0].name;

  // storage
  const conversations = React.useRef(
    createStoredConversations<StoredAskAiState>({
      key: `__DOCSEARCH_ASKAI_CONVERSATIONS__${askAiConfig?.indexName || defaultIndexName}`,
      limit: 10,
    }),
  ).current;
  const favoriteSearches = React.useRef(
    createStoredSearches<StoredDocSearchHit>({
      key: `__DOCSEARCH_FAVORITE_SEARCHES__${defaultIndexName}`,
      limit: 10,
    }),
  ).current;
  const recentSearches = React.useRef(
    createStoredSearches<StoredDocSearchHit>({
      key: `__DOCSEARCH_RECENT_SEARCHES__${defaultIndexName}`,
      limit: favoriteSearches.getAll().length === 0 ? recentSearchesLimit : recentSearchesWithFavoritesLimit,
    }),
  ).current;

  const [stoppedStream, setStoppedStream] = React.useState(false);

  const {
    messages,
    sendMessage,
    status,
    setMessages,
    error: askAiError,
    stop: stopAskAiStreaming,
  } = useChat<AIMessage>({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: new DefaultChatTransport({
      api: ASK_AI_API_URL,
      headers: async (): Promise<Record<string, string>> => {
        if (!askAiConfigurationId) {
          throw new Error('Ask AI assistant ID is required');
        }

        let token: string | null = null;

        if (USE_ASK_AI_TOKEN) {
          token = await getValidToken({
            assistantId: askAiConfigurationId,
          });
        }

        return {
          ...(token ? { authorization: `TOKEN ${token}` } : {}),
          'X-Algolia-API-Key': askAiConfig?.apiKey || apiKey,
          'X-Algolia-Application-Id': askAiConfig?.appId || appId,
          'X-Algolia-Index-Name': askAiConfig?.indexName || defaultIndexName,
          'X-Algolia-Assistant-Id': askAiConfigurationId || '',
          'X-AI-SDK-Version': 'v5',
        };
      },
      body: askAiSearchParameters ? { searchParameters: askAiSearchParameters } : {},
    }),
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
          conversations.add(buildDummyAskAiHit(part.text, messages));
        }
      }
    }
    prevStatus.current = status;
  }, [status, messages, conversations, disableUserPersonalization, stoppedStream]);

  // Check if there's a thread depth error (AI-217)
  const hasThreadDepthError = React.useMemo(() => {
    return status === 'error' && isThreadDepthError(askAiError as Error | undefined);
  }, [status, askAiError]);

  const createSyntheticParent = React.useCallback(function createSyntheticParent(
    item: InternalDocSearchHit,
  ): InternalDocSearchHit {
    // Find the deepest non-null hierarchy level
    const hierarchy = item.hierarchy;
    const levels = ['lvl6', 'lvl5', 'lvl4', 'lvl3', 'lvl2', 'lvl1', 'lvl0'] as const;

    const deepestLevel = levels.find((level) => hierarchy[level]);

    return {
      ...item,
      type: deepestLevel || 'lvl0', // Use the deepest available level as type
      content: null, // Clear content since this represents a section, not specific content
    };
  }, []);

  const saveRecentSearch = React.useCallback(
    function saveRecentSearch(item: InternalDocSearchHit) {
      if (disableUserPersonalization) {
        return;
      }

      // We don't store `content` record, but their parent if available.
      // If no parent exists, create a synthetic parent from the hierarchy.
      const search = item.type === 'content' ? item.__docsearch_parent || createSyntheticParent(item) : item;

      // We save the recent search only if it's not favorited.
      if (search && favoriteSearches.getAll().findIndex((x) => x.objectID === search.objectID) === -1) {
        recentSearches.add(search);
      }
    },
    [favoriteSearches, recentSearches, disableUserPersonalization, createSyntheticParent],
  );

  const sendItemClickEvent = React.useCallback(
    (item: InternalDocSearchHit) => {
      if (!state.context.algoliaInsightsPlugin || !item.__autocomplete_id) return;

      const insightsItem = item as AlgoliaInsightsHit;

      const insightsClickParams = {
        eventName: 'Item Selected',
        index: insightsItem.__autocomplete_indexName,
        items: [insightsItem],
        positions: [item.__autocomplete_id],
        queryID: insightsItem.__autocomplete_queryID,
      };

      state.context.algoliaInsightsPlugin.insights.clickedObjectIDsAfterSearch(insightsClickParams);
    },
    [state.context.algoliaInsightsPlugin],
  );

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
      if (toggle && askAiState === 'new-conversation') {
        setAskAiState('initial');
      }

      const messageOptions: ChatRequestOptions = {};

      if (suggestedQuestion) {
        messageOptions.body = {
          suggestedQuestionId: suggestedQuestion.objectID,
        };
      }

      onAskAiToggle(toggle);
      setStoppedStream(false);
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
    [onAskAiToggle, sendMessage, askAiState, setAskAiState],
  );

  // feedback handler
  const handleFeedbackSubmit = React.useCallback(
    async (messageId: string, thumbs: 0 | 1): Promise<void> => {
      if (!askAiConfigurationId || !appId) return;
      const res = await postFeedback({
        assistantId: askAiConfigurationId,
        thumbs,
        messageId,
        appId,
      });
      if (res.status >= 300) throw new Error('Failed, try again later');
      conversations.addFeedback?.(messageId, thumbs === 1 ? 'like' : 'dislike');
    },
    [askAiConfigurationId, appId, conversations],
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
            canHandleAskAi,
          });

          const recentConversationSource: Array<AutocompleteSource<InternalDocSearchHit & { messages?: AIMessage[] }>> =
            canHandleAskAi
              ? [
                  {
                    sourceId: 'recentConversations',
                    getItems(): InternalDocSearchHit[] {
                      if (disableUserPersonalization) {
                        return [];
                      }
                      return conversations.getAll() as unknown as InternalDocSearchHit[];
                    },
                    onSelect({ item }): void {
                      if (item.messages) {
                        setMessages(item.messages as any);
                        onAskAiToggle(true);
                      }
                    },
                  },
                ]
              : [];
          return [...noQuerySources, ...recentConversationSource];
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

        // Ask AI source
        const askAiSource: Array<AutocompleteSource<InternalDocSearchHit>> = canHandleAskAi
          ? [
              {
                sourceId: 'askAI',
                getItems(): InternalDocSearchHit[] {
                  // return a single item representing the Ask AI action
                  // placeholder data matching the InternalDocSearchHit structure
                  const askItem: InternalDocSearchHit = {
                    type: 'askAI',
                    query,
                    url_without_anchor: '',
                    objectID: `ask-ai-button`,
                    content: null,
                    url: '',
                    anchor: null,
                    hierarchy: {
                      lvl0: 'Ask AI', // Or contextually relevant
                      lvl1: query,
                      lvl2: null,
                      lvl3: null,
                      lvl4: null,
                      lvl5: null,
                      lvl6: null,
                    },
                    _highlightResult: {} as any,
                    _snippetResult: {} as any,
                    __docsearch_parent: null,
                  };
                  return [askItem];
                },
                onSelect({ item }): void {
                  if (item.type === 'askAI' && item.query) {
                    handleSelectAskAiQuestion(true, item.query);
                  }
                },
              },
            ]
          : [];
        // Combine Algolia results (once resolved) with the Ask AI source
        return algoliaSourcesPromise.then((algoliaSources) => {
          return [...askAiSource, ...algoliaSources];
        });
      },
    });
  }

  const autocomplete = autocompleteRef.current;

  const { getEnvironmentProps, getRootProps, refresh } = autocomplete;

  useTouchEvents({
    getEnvironmentProps,
    panelElement: dropdownRef.current,
    formElement: formElementRef.current,
    inputElement: inputRef.current,
  });
  useTrapFocus({ container: containerRef.current });
  useTheme({ theme });

  React.useEffect(() => {
    document.body.classList.add('DocSearch--active');

    return (): void => {
      document.body.classList.remove('DocSearch--active');

      // IE11 doesn't support `scrollTo` so we check that the method exists
      // first.
      window.scrollTo?.(0, initialScrollY);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Proactively manage localStorage quota to prevent crashes
  React.useEffect(() => {
    manageLocalStorageQuota();
  }, []);

  React.useLayoutEffect(() => {
    // Calculate the scrollbar width to compensate for removed scrollbar
    const scrollBarWidth = window.innerWidth - document.body.clientWidth;
    // Prevent layout shift by adding appropriate margin to the body
    document.body.style.marginInlineEnd = `${scrollBarWidth}px`;

    return (): void => {
      document.body.style.marginInlineEnd = '0px';
    };
  }, []);

  React.useEffect(() => {
    const isMobileMediaQuery = window.matchMedia('(max-width: 768px)');

    if (isMobileMediaQuery.matches) {
      snippetLength.current = 5;
    }
  }, []);

  React.useEffect(() => {
    if (dropdownRef.current && !isAskAiActive) {
      scrollToUtils(dropdownRef.current);
    }
  }, [state.query, isAskAiActive]);

  // We don't focus the input when there's an initial query (i.e. Selection
  // Search) because users rather want to see the results directly, without the
  // keyboard appearing.
  // We therefore need to refresh the autocomplete instance to load all the
  // results, which is usually triggered on focus.
  React.useEffect(() => {
    if (initialQuery.length > 0) {
      refresh();

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [initialQuery, refresh]);

  // We rely on a CSS property to set the modal height to the full viewport height
  // because all mobile browsers don't compute their height the same way.
  // See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  React.useEffect(() => {
    function setFullViewportHeight(): void {
      if (modalRef.current) {
        const vh = window.innerHeight * 0.01;
        modalRef.current.style.setProperty('--docsearch-vh', `${vh}px`);
      }
    }

    setFullViewportHeight();

    window.addEventListener('resize', setFullViewportHeight);

    return (): void => {
      window.removeEventListener('resize', setFullViewportHeight);
    };
  }, []);

  // Refresh the autocomplete results when ask ai is toggled off
  // helps return to the previous ac state and start screen
  React.useEffect(() => {
    if (!isAskAiActive) {
      autocomplete.refresh();
      setMessages([]);
    }
  }, [isAskAiActive, autocomplete, setMessages]);

  // Track external state in order to manage internal askAiState
  React.useEffect(() => {
    setAskAiState('initial');
  }, [isAskAiActive, setAskAiState]);

  const onStopAskAiStreaming = async (): Promise<void> => {
    setStoppedStream(true);

    await stopAskAiStreaming();
  };

  const handleNewConversation = (): void => {
    setMessages([]);
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
    <div
      ref={containerRef}
      {...getRootProps({ 'aria-expanded': true })}
      className={[
        'DocSearch',
        'DocSearch-Container',
        state.status === 'stalled' && 'DocSearch-Container--Stalled',
        state.status === 'error' && 'DocSearch-Container--Errored',
      ]
        .filter(Boolean)
        .join(' ')}
      role="button"
      tabIndex={0}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="DocSearch-Modal" ref={modalRef}>
        <header className="DocSearch-SearchBar" ref={formElementRef}>
          <SearchBox
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
        </header>

        {showDocsearchDropdown && (
          <div className="DocSearch-Dropdown" ref={dropdownRef}>
            <ScreenState
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
              askAiError={askAiError}
              status={status}
              hasCollections={hasCollections}
              askAiState={askAiState}
              selectAskAiQuestion={handleSelectAskAiQuestion}
              suggestedQuestions={suggestedQuestions}
              selectSuggestedQuestion={selectSuggestedQuestion}
              onAskAiToggle={onAskAiToggle}
              onNewConversation={handleNewConversation}
              onItemClick={(item, event) => {
                // if the item is askAI toggle the screen
                if (item.type === 'askAI' && item.query) {
                  // if the item is askAI and the anchor is stored
                  if (item.anchor === 'stored' && 'messages' in item) {
                    setMessages(item.messages as any);
                    onAskAiToggle(true);
                  } else {
                    handleSelectAskAiQuestion(true, item.query);
                  }
                  setAskAiState('initial');
                  event.preventDefault();
                  return;
                }

                // If insights is active, send insights click event
                sendItemClickEvent(item);

                saveRecentSearch(item);
                if (!isModifierEvent(event)) {
                  onClose();
                }
              }}
              onFeedback={handleFeedbackSubmit}
            />
          </div>
        )}
        <footer className="DocSearch-Footer">
          <Footer translations={footerTranslations} isAskAiActive={isAskAiActive} />
        </footer>
      </div>
    </div>
  );
}
