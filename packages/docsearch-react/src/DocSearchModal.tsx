import {
  type AlgoliaInsightsHit,
  createAutocomplete,
} from '@algolia/autocomplete-core';
import type { SearchResponse } from 'algoliasearch/lite';
import React from 'react';

import { MAX_QUERY_SIZE } from './constants';
import type { DocSearchProps } from './DocSearch';
import type { FooterTranslations } from './Footer';
import { Footer } from './Footer';
import { Hit } from './Hit';
import type { ScreenStateTranslations } from './ScreenState';
import { ScreenState } from './ScreenState';
import type { SearchBoxTranslations } from './SearchBox';
import { SearchBox } from './SearchBox';
import { createStoredSearches } from './stored-searches';
import type {
  DocSearchHit,
  DocSearchState,
  InternalDocSearchHit,
  StoredDocSearchHit,
} from './types';
import { useSearchClient } from './useSearchClient';
import { useTouchEvents } from './useTouchEvents';
import { useTrapFocus } from './useTrapFocus';
import {
  groupBy,
  identity,
  noop,
  removeHighlightTags,
  isModifierEvent,
} from './utils';

export type ModalTranslations = Partial<{
  searchBox: SearchBoxTranslations;
  footer: FooterTranslations;
}> &
  ScreenStateTranslations;

export type DocSearchModalProps = DocSearchProps & {
  initialScrollY: number;
  onClose?: () => void;
  translations?: ModalTranslations;
};

export function DocSearchModal({
  appId,
  apiKey,
  indexName,
  placeholder = 'Search docs',
  searchParameters,
  maxResultsPerGroup,
  onClose = noop,
  transformItems = identity,
  hitComponent = Hit,
  resultsFooterComponent = () => null,
  navigator,
  initialScrollY = 0,
  transformSearchClient = identity,
  disableUserPersonalization = false,
  initialQuery: initialQueryFromProp = '',
  translations = {},
  getMissingResultsUrl,
  insights = false,
}: DocSearchModalProps) {
  const {
    footer: footerTranslations,
    searchBox: searchBoxTranslations,
    ...screenStateTranslations
  } = translations;
  const [state, setState] = React.useState<
    DocSearchState<InternalDocSearchHit>
  >({
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
  const snippetLength = React.useRef<number>(10);
  const initialQueryFromSelection = React.useRef(
    typeof window !== 'undefined'
      ? window.getSelection()!.toString().slice(0, MAX_QUERY_SIZE)
      : ''
  ).current;
  const initialQuery = React.useRef(
    initialQueryFromProp || initialQueryFromSelection
  ).current;

  const searchClient = useSearchClient(appId, apiKey, transformSearchClient);
  const favoriteSearches = React.useRef(
    createStoredSearches<StoredDocSearchHit>({
      key: `__DOCSEARCH_FAVORITE_SEARCHES__${indexName}`,
      limit: 10,
    })
  ).current;
  const recentSearches = React.useRef(
    createStoredSearches<StoredDocSearchHit>({
      key: `__DOCSEARCH_RECENT_SEARCHES__${indexName}`,
      // We display 7 recent searches and there's no favorites, but only
      // 4 when there are favorites.
      limit: favoriteSearches.getAll().length === 0 ? 7 : 4,
    })
  ).current;

  const saveRecentSearch = React.useCallback(
    function saveRecentSearch(item: InternalDocSearchHit) {
      if (disableUserPersonalization) {
        return;
      }

      // We don't store `content` record, but their parent if available.
      const search = item.type === 'content' ? item.__docsearch_parent : item;

      // We save the recent search only if it's not favorited.
      if (
        search &&
        favoriteSearches
          .getAll()
          .findIndex((x) => x.objectID === search.objectID) === -1
      ) {
        recentSearches.add(search);
      }
    },
    [favoriteSearches, recentSearches, disableUserPersonalization]
  );

  const sendItemClickEvent = React.useCallback(
    (item: InternalDocSearchHit) => {
      if (!state.context.algoliaInsightsPlugin || !item.__autocomplete_id)
        return;

      const insightsItem = item as AlgoliaInsightsHit;

      const insightsClickParams = {
        eventName: 'Item Selected',
        index: insightsItem.__autocomplete_indexName,
        items: [insightsItem],
        positions: [item.__autocomplete_id],
        queryID: insightsItem.__autocomplete_queryID,
      };

      state.context.algoliaInsightsPlugin.insights.clickedObjectIDsAfterSearch(
        insightsClickParams
      );
    },
    [state.context.algoliaInsightsPlugin]
  );

  const autocomplete = React.useMemo(
    () =>
      createAutocomplete<
        InternalDocSearchHit,
        React.FormEvent<HTMLFormElement>,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        id: 'docsearch',
        defaultActiveItemId: 0,
        placeholder,
        openOnFocus: true,
        initialState: {
          query: initialQuery,
          context: {
            searchSuggestions: [],
          },
        },
        insights,
        navigator,
        onStateChange(props) {
          setState(props.state);
        },
        getSources({ query, state: sourcesState, setContext, setStatus }) {
          if (!query) {
            if (disableUserPersonalization) {
              return [];
            }

            return [
              {
                sourceId: 'recentSearches',
                onSelect({ item, event }) {
                  saveRecentSearch(item);

                  if (!isModifierEvent(event)) {
                    onClose();
                  }
                },
                getItemUrl({ item }) {
                  return item.url;
                },
                getItems() {
                  return recentSearches.getAll() as InternalDocSearchHit[];
                },
              },
              {
                sourceId: 'favoriteSearches',
                onSelect({ item, event }) {
                  saveRecentSearch(item);

                  if (!isModifierEvent(event)) {
                    onClose();
                  }
                },
                getItemUrl({ item }) {
                  return item.url;
                },
                getItems() {
                  return favoriteSearches.getAll() as InternalDocSearchHit[];
                },
              },
            ];
          }

          const insightsActive = Boolean(insights);

          return searchClient
            .search<DocSearchHit>({
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
            })
            .catch((error) => {
              // The Algolia `RetryError` happens when all the servers have
              // failed, meaning that there's no chance the response comes
              // back. This is the right time to display an error.
              // See https://github.com/algolia/algoliasearch-client-javascript/blob/2ffddf59bc765cd1b664ee0346b28f00229d6e12/packages/transporter/src/errors/createRetryError.ts#L5
              if (error.name === 'RetryError') {
                setStatus('error');
              }

              throw error;
            })
            .then(({ results }) => {
              const firstResult = results[0] as SearchResponse<DocSearchHit>;
              const { hits, nbHits } = firstResult;
              const sources = groupBy<DocSearchHit>(
                hits,
                (hit) => removeHighlightTags(hit),
                maxResultsPerGroup
              );

              // We store the `lvl0`s to display them as search suggestions
              // in the "no results" screen.
              if (
                (sourcesState.context.searchSuggestions as any[]).length <
                Object.keys(sources).length
              ) {
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

              return Object.values<DocSearchHit[]>(sources).map(
                (items, index) => {
                  return {
                    sourceId: `hits${index}`,
                    onSelect({ item, event }) {
                      saveRecentSearch(item);

                      if (!isModifierEvent(event)) {
                        onClose();
                      }
                    },
                    getItemUrl({ item }) {
                      return item.url;
                    },
                    getItems() {
                      return Object.values(
                        groupBy(
                          items,
                          (item) => item.hierarchy.lvl1,
                          maxResultsPerGroup
                        )
                      )
                        .map(transformItems)
                        .map((groupedHits) =>
                          groupedHits.map((item) => {
                            let parent: InternalDocSearchHit | null = null;

                            const potentialParent = groupedHits.find(
                              (siblingItem) =>
                                siblingItem.type === 'lvl1' &&
                                siblingItem.hierarchy.lvl1 ===
                                  item.hierarchy.lvl1
                            ) as InternalDocSearchHit | undefined;

                            if (item.type !== 'lvl1' && potentialParent) {
                              parent = potentialParent;
                            }

                            return {
                              ...item,
                              __docsearch_parent: parent,
                              ...insightsParams,
                            };
                          })
                        )
                        .flat();
                    },
                  };
                }
              );
            });
        },
      }),
    [
      indexName,
      searchParameters,
      maxResultsPerGroup,
      searchClient,
      onClose,
      recentSearches,
      favoriteSearches,
      saveRecentSearch,
      initialQuery,
      placeholder,
      navigator,
      transformItems,
      disableUserPersonalization,
      insights,
      appId,
      apiKey,
    ]
  );

  const { getEnvironmentProps, getRootProps, refresh } = autocomplete;

  useTouchEvents({
    getEnvironmentProps,
    panelElement: dropdownRef.current,
    formElement: formElementRef.current,
    inputElement: inputRef.current,
  });
  useTrapFocus({ container: containerRef.current });

  React.useEffect(() => {
    const hasVerticalScrollbar =
      window.innerWidth > document.documentElement.clientWidth;
    if (hasVerticalScrollbar) {
      document.body.classList.add('DocSearch-fix-scrollbar');
      document.body.style.top = `-${initialScrollY}px`;
    }
    document.body.classList.add('DocSearch--active');

    return () => {
      if (hasVerticalScrollbar) {
        document.body.classList.remove('DocSearch-fix-scrollbar');
        document.body.style.top = '';
      }
      document.body.classList.remove('DocSearch--active');

      // IE11 doesn't support `scrollTo` so we check that the method exists
      // first.
      window.scrollTo?.(0, initialScrollY);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    function setFullViewportHeight() {
      if (modalRef.current) {
        const vh = window.innerHeight * 0.01;
        modalRef.current.style.setProperty('--docsearch-vh', `${vh}px`);
      }
    }

    setFullViewportHeight();

    window.addEventListener('resize', setFullViewportHeight);

    return () => {
      window.removeEventListener('resize', setFullViewportHeight);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      {...getRootProps({
        'aria-expanded': true,
      })}
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
            autoFocus={initialQuery.length === 0}
            inputRef={inputRef}
            isFromSelection={
              Boolean(initialQuery) &&
              initialQuery === initialQueryFromSelection
            }
            translations={searchBoxTranslations}
            onClose={onClose}
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
            inputRef={inputRef}
            translations={screenStateTranslations}
            getMissingResultsUrl={getMissingResultsUrl}
            onItemClick={(item, event) => {
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
          <Footer translations={footerTranslations} />
        </footer>
      </div>
    </div>
  );
}
