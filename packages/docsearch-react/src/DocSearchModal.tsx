import { createAutocomplete } from '@algolia/autocomplete-core';
import React, { type JSX } from 'react';

import type { KeywordSearchBoxTranslations } from './components/KeywordSearchBox';
import { KeywordSearchBox } from './components/KeywordSearchBox';
import { MAX_QUERY_SIZE } from './constants';
import type { DocSearchProps } from './DocSearch';
import type { FooterTranslations } from './Footer';
import { Footer } from './Footer';
import { Hit } from './Hit';
import { buildNoQuerySources, buildQuerySources, type BuildQuerySourcesState } from './modal/createDocSearchSources';
import { DocSearchModalShell } from './modal/DocSearchModalShell';
import { normalizeDocSearchIndexes } from './modal/normalizeDocSearchIndexes';
import { useSendItemClickEvent } from './modal/useDocSearchInsights';
import { useDocSearchModalEffects } from './modal/useDocSearchModalEffects';
import { useSaveRecentSearch } from './modal/useSaveRecentSearch';
import { useStoredDocSearches } from './modal/useStoredDocSearches';
import type { ScreenStateTranslations } from './ScreenState';
import { ScreenState } from './ScreenState';
import type { DocSearchState, InternalDocSearchHit } from './types';
import { useSearchClient } from './useSearchClient';
import { useTouchEvents } from './useTouchEvents';
import { useTrapFocus } from './useTrapFocus';
import { identity, isModifierEvent, noop, scrollTo as scrollToUtils } from './utils';

export type ModalTranslations = Partial<{
  searchBox: KeywordSearchBoxTranslations;
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
          return noQuerySources;
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

        return algoliaSourcesPromise;
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
  useDocSearchModalEffects({ initialScrollY, modalRef, snippetLength, theme });

  React.useEffect(() => {
    if (dropdownRef.current) {
      scrollToUtils(dropdownRef.current);
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

  // hide the dropdown on idle and no collections
  let showDocsearchDropdown = true;
  const hasCollections = state.collections.some((collection) => collection.items.length > 0);
  if (state.status === 'idle' && hasCollections === false && state.query.length === 0) {
    showDocsearchDropdown = false;
  }

  return (
    <DocSearchModalShell
      state={state}
      containerRef={containerRef}
      modalRef={modalRef}
      formElementRef={formElementRef}
      dropdownRef={dropdownRef}
      getRootProps={getRootProps}
      showDropdown={showDocsearchDropdown}
      searchBox={
        <KeywordSearchBox
          {...autocomplete}
          state={state}
          placeholder={placeholder || 'Search docs'}
          autoFocus={initialQuery.length === 0}
          inputRef={inputRef}
          isFromSelection={Boolean(initialQuery) && initialQuery === initialQueryFromSelection}
          translations={searchBoxTranslations}
          onClose={onClose}
        />
      }
      screenState={
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
          hasCollections={hasCollections}
          onItemClick={(item, event) => {
            sendItemClickEvent(item);
            saveRecentSearch(item);
            if (!isModifierEvent(event)) {
              onClose();
            }
          }}
        />
      }
      footer={<Footer translations={footerTranslations} />}
      onClose={onClose}
    />
  );
}
