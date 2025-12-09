import type { AlgoliaInsightsHit, createAutocomplete } from '@algolia/autocomplete-core';
import { useTheme } from '@docsearch/core';
import React from 'react';
import type { JSX } from 'react';

import { MAX_QUERY_SIZE } from './constants';
import type { DocSearchIndex, DocSearchProps } from './DocSearch';
import type { ModalTranslations } from './DocSearchModal';
import { Footer } from './Footer';
import { Hit } from './Hit';
import { useAutocomplete } from './hooks/useAutocomplete';
import { ScreenState } from './ScreenState';
import { SearchBox } from './SearchBox';
import { buildNoQuerySources } from './sources/noQuery';
import type { BuildQuerySourcesState } from './sources/search';
import { buildQuerySources } from './sources/search';
import { createStoredSearches } from './stored-searches';
import type { DocSearchState, InternalDocSearchHit, StoredDocSearchHit } from './types';
import { useSearchClient } from './useSearchClient';
import { useTouchEvents } from './useTouchEvents';
import { useTrapFocus } from './useTrapFocus';
import { identity, isModifierEvent, noop } from './utils';
import { scrollTo as scrollToUtils } from './utils/scrollTo';
import { manageLocalStorageQuota } from './utils/storage';

export type KeywordModalProps = DocSearchProps & {
  initialScrollY: number;
  onClose?: () => void;
  translations?: ModalTranslations;
};

export function KeywordModal({
  appId,
  apiKey,
  initialQuery: initialQueryFromProp = '',
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
  translations = {},
  getMissingResultsUrl,
  insights = false,
  recentSearchesLimit = 7,
  recentSearchesWithFavoritesLimit = 4,
  indices = [],
  indexName,
  searchParameters,
  ...props
}: KeywordModalProps): JSX.Element {
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

  const placeholder = translations?.searchBox?.placeholderText || props.placeholder || 'Search docs';

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

  autocompleteRef.current = useAutocomplete({
    initialQuery,
    insights,
    navigator,
    onStateChanged: setState,
    getSources({ query, state: sourcesState, setContext, setStatus }) {
      if (!query) {
        const noQuerySources = buildNoQuerySources({
          recentSearches,
          favoriteSearches,
          saveRecentSearch,
          onClose,
          disableUserPersonalization,
          canHandleAskAi: false,
        });

        return [...noQuerySources];
      }

      const querySourcesState: BuildQuerySourcesState = {
        context: sourcesState.context,
      };

      return buildQuerySources({
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
    },
  });

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
    if (dropdownRef.current) {
      scrollToUtils(dropdownRef.current);
    }
  }, [state.query]);

  React.useEffect(() => {
    if (initialQuery.length > 0) {
      refresh();

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [initialQuery, refresh]);

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

  let showDocsearchDropdown = true;
  const hasCollections = state.collections.some((collection) => collection.items.length > 0);
  if (state.status === 'idle' && hasCollections === false && state.query.length === 0) {
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
            isAskAiActive={false}
            onClose={onClose}
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
              inputRef={inputRef}
              translations={screenStateTranslations}
              getMissingResultsUrl={getMissingResultsUrl}
              canHandleAskAi={false}
              hasCollections={hasCollections}
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
        )}
        <footer className="DocSearch-Footer">
          <Footer translations={footerTranslations} isAskAiActive={false} />
        </footer>
      </div>
    </div>
  );
}
