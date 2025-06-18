import type { Message } from '@ai-sdk/react';
import { useChat } from '@ai-sdk/react';
import {
  type AutocompleteSource,
  type AlgoliaInsightsHit,
  createAutocomplete,
  type AutocompleteState,
} from '@algolia/autocomplete-core';
import type { SearchResponse } from 'algoliasearch/lite';
import React, { type JSX } from 'react';

import { ASK_AI_API_URL, MAX_QUERY_SIZE } from './constants';
import type { DocSearchProps } from './DocSearch';
import type { FooterTranslations } from './Footer';
import { Footer } from './Footer';
import { Hit } from './Hit';
import type { ScreenStateTranslations } from './ScreenState';
import { ScreenState } from './ScreenState';
import type { SearchBoxTranslations } from './SearchBox';
import { SearchBox } from './SearchBox';
import { createStoredConversations, createStoredSearches } from './stored-searches';
import type { DocSearchHit, DocSearchState, InternalDocSearchHit, StoredAskAiState, StoredDocSearchHit } from './types';
import { useSearchClient } from './useSearchClient';
import { useTouchEvents } from './useTouchEvents';
import { useTrapFocus } from './useTrapFocus';
import { groupBy, identity, noop, removeHighlightTags, isModifierEvent } from './utils';
import { buildDummyAskAiHit } from './utils/ai';

export type ModalTranslations = Partial<{
  searchBox: SearchBoxTranslations;
  footer: FooterTranslations;
}> &
  ScreenStateTranslations;

export type DocSearchModalProps = DocSearchProps & {
  initialScrollY: number;
  onAskAiToggle: (toggle: boolean) => void;
  onClose?: () => void;
  isAskAiActive?: boolean;
  canHandleAskAi?: boolean;
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
  indexName,
  searchParameters,
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
  indexName: string;
  searchParameters: DocSearchProps['searchParameters'];
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
      requests: [
        {
          query,
          indexName,
          attributesToRetrieve: [
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
          attributesToSnippet: [
            `hierarchy.lvl1:${snippetLength.current}`,
            `hierarchy.lvl2:${snippetLength.current}`,
            `hierarchy.lvl3:${snippetLength.current}`,
            `hierarchy.lvl4:${snippetLength.current}`,
            `hierarchy.lvl5:${snippetLength.current}`,
            `hierarchy.lvl6:${snippetLength.current}`,
            `content:${snippetLength.current}`,
          ],
          snippetEllipsisText: '…',
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
          hitsPerPage: 20,
          clickAnalytics: insightsActive,
          ...searchParameters,
        },
      ],
    });

    const firstResult = results[0] as SearchResponse<DocSearchHit>;
    const { hits, nbHits } = firstResult;
    const sources = groupBy<DocSearchHit>(hits, (hit) => removeHighlightTags(hit), maxResultsPerGroup);

    // We store the `lvl0`s to display them as search suggestions
    // in the "no results" screen.
    if ((sourcesState.context.searchSuggestions as any[]).length < Object.keys(sources).length) {
      setContext({
        searchSuggestions: Object.keys(sources),
      });
    }

    setContext({ nbHits });

    let insightsParams = {};

    if (insightsActive) {
      insightsParams = {
        __autocomplete_indexName: indexName,
        __autocomplete_queryID: firstResult.queryID,
        __autocomplete_algoliaCredentials: {
          appId,
          apiKey,
        },
      };
    }

    return Object.values<DocSearchHit[]>(sources).map((items, index) => {
      return {
        sourceId: `hits${index}`,
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
            .map(transformItems)
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
  indexName,
  placeholder,
  askAi,
  searchParameters,
  maxResultsPerGroup,
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
  canHandleAskAi = false,
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
  // storage
  const conversations = React.useRef(
    createStoredConversations<StoredAskAiState>({
      key: `__DOCSEARCH_ASKAI_CONVERSATIONS__${indexName}`,
      limit: 10,
    }),
  ).current;
  const favoriteSearches = React.useRef(
    createStoredSearches<StoredDocSearchHit>({
      key: `__DOCSEARCH_FAVORITE_SEARCHES__${indexName}`,
      limit: 10,
    }),
  ).current;
  const recentSearches = React.useRef(
    createStoredSearches<StoredDocSearchHit>({
      key: `__DOCSEARCH_RECENT_SEARCHES__${indexName}`,
      // We display 7 recent searches and there's no favorites, but only
      // 4 when there are favorites.
      limit: favoriteSearches.getAll().length === 0 ? 7 : 4,
    }),
  ).current;

  const searchClient = useSearchClient(appId, apiKey, transformSearchClient);

  const askAiConfig = typeof askAi === 'object' ? askAi : null;

  const { messages, append, status, setMessages } = useChat({
    api: ASK_AI_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Algolia-API-Key': askAiConfig?.apiKey || apiKey,
      'X-Algolia-Application-Id': askAiConfig?.appId || appId,
      'X-Algolia-Index-Name': askAiConfig?.indexName || indexName,
      'X-Documentation-Name': 'Documentation',
    },
  });

  const prevStatus = React.useRef(status);
  React.useEffect(() => {
    // if we just transitioned from "streaming" → "ready", persist
    if (prevStatus.current === 'streaming' && status === 'ready') {
      conversations.add(buildDummyAskAiHit(messages[0].content, messages));
    }
    prevStatus.current = status;
  }, [status, messages, conversations]);

  const saveRecentSearch = React.useCallback(
    function saveRecentSearch(item: InternalDocSearchHit) {
      if (disableUserPersonalization) {
        return;
      }

      // We don't store `content` record, but their parent if available.
      const search = item.type === 'content' ? item.__docsearch_parent : item;

      // We save the recent search only if it's not favorited.
      if (search && favoriteSearches.getAll().findIndex((x) => x.objectID === search.objectID) === -1) {
        recentSearches.add(search);
      }
    },
    [favoriteSearches, recentSearches, disableUserPersonalization],
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

  const handleAskAiToggle = React.useCallback(
    async (toggle: boolean, query: string) => {
      onAskAiToggle(toggle);
      await append({
        role: 'user',
        content: query,
      });

      // clear the query
      if (autocompleteRef.current) {
        autocompleteRef.current.setQuery('');
      }
    },
    [onAskAiToggle, append],
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
      onStateChange(props) {
        setState(props.state);
      },
      getSources({ query, state: sourcesState, setContext, setStatus }) {
        if (isAskAiActive) {
          // when Ask AI screen is active, don't render any autocomplete sources
          return [];
        }
        if (!query) {
          const noQuerySources = buildNoQuerySources({
            recentSearches,
            favoriteSearches,
            saveRecentSearch,
            onClose,
            disableUserPersonalization,
            canHandleAskAi,
          });

          const recentConversationSource: Array<AutocompleteSource<InternalDocSearchHit & { messages?: Message[] }>> =
            canHandleAskAi
              ? [
                  {
                    sourceId: 'recentConversations',
                    getItems(): InternalDocSearchHit[] {
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

        const querySourcesState: BuildQuerySourcesState = { context: sourcesState.context };

        // Algolia sources
        const algoliaSourcesPromise = buildQuerySources({
          query,
          state: querySourcesState,
          setContext,
          setStatus,
          searchClient,
          indexName,
          searchParameters,
          snippetLength,
          insights: Boolean(insights),
          appId,
          apiKey,
          maxResultsPerGroup,
          transformItems,
          saveRecentSearch,
          onClose,
        });

        // AskAI source
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
                    handleAskAiToggle(true, item.query);
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

  React.useLayoutEffect(() => {
    // Calculate the scrollbar width to compensate for removed scrollbar
    const scrollBarWidth = window.innerWidth - document.body.clientWidth;
    // Prevent layout shift by adding appropriate margin to the body
    document.body.style.marginRight = `${scrollBarWidth}px`;

    return (): void => {
      document.body.style.marginRight = '0px';
    };
  }, []);

  React.useEffect(() => {
    const isMobileMediaQuery = window.matchMedia('(max-width: 768px)');

    if (isMobileMediaQuery.matches) {
      snippetLength.current = 5;
    }
  }, []);

  React.useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollTop = 0;
    }
  }, [state.query]);

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
            onClose={onClose}
            onAskAiToggle={onAskAiToggle}
            onAskAgain={(query) => {
              handleAskAiToggle(true, query);
            }}
          />
        </header>

        <div className="DocSearch-Dropdown" ref={dropdownRef}>
          <ScreenState
            {...autocomplete}
            indexName={indexName}
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
            status={status}
            onAskAiToggle={onAskAiToggle}
            onItemClick={(item, event) => {
              // if the item is askAI toggle the screen
              if (item.type === 'askAI' && item.query) {
                // if the item is askAI and the anchor is stored
                if (item.anchor === 'stored' && 'messages' in item) {
                  setMessages(item.messages as any);
                  onAskAiToggle(true);
                } else {
                  handleAskAiToggle(true, item.query);
                }
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
          />
        </div>

        <footer className="DocSearch-Footer">
          <Footer translations={footerTranslations} isAskAiActive={isAskAiActive} />
        </footer>
      </div>
    </div>
  );
}
