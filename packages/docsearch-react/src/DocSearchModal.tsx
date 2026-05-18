import { createAutocomplete } from '@algolia/autocomplete-core';
import React, { type JSX } from 'react';

import type { KeywordSearchBoxTranslations } from './components/KeywordSearchBox';
import { KeywordSearchBox } from './components/KeywordSearchBox';
import type { DocSearchProps } from './DocSearch';
import type { FooterTranslations } from './Footer';
import { Footer } from './Footer';
import { Hit } from './Hit';
import { buildNoQuerySources, buildQuerySources, type BuildQuerySourcesState } from './modal/createDocSearchSources';
import { DocSearchModalShell } from './modal/DocSearchModalShell';
import { normalizeDocSearchIndexes } from './modal/normalizeDocSearchIndexes';
import { useSendItemClickEvent } from './modal/useDocSearchInsights';
import { useInitialModalQuery } from './modal/useInitialModalQuery';
import { useModalEnvironment } from './modal/useModalEnvironment';
import { useModalRefs } from './modal/useModalRefs';
import { useRefreshOnInitialQuery } from './modal/useRefreshOnInitialQuery';
import { useSaveRecentSearch } from './modal/useSaveRecentSearch';
import { useStoredDocSearches } from './modal/useStoredDocSearches';
import type { ScreenStateTranslations } from './ScreenState';
import { ScreenState } from './ScreenState';
import type { DocSearchState, InternalDocSearchHit } from './types';
import { useSearchClient } from './useSearchClient';
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

  const { containerRef, modalRef, formElementRef, dropdownRef, inputRef, snippetLength } = useModalRefs();
  const { initialQuery, initialQueryFromSelection } = useInitialModalQuery(initialQueryFromProp);

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
    if (dropdownRef.current) {
      scrollToUtils(dropdownRef.current);
    }
  }, [state.query, dropdownRef]);

  useRefreshOnInitialQuery({ initialQuery, inputRef, refresh });

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
