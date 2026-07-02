/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { AutocompleteState } from '@algolia/autocomplete-core';
import type { ThemeConfigAlgolia } from '@docsearch/docusaurus-adapter';
import type {
  InternalDocSearchHit,
  DocSearchModal as DocSearchModalType,
  DocSearchModalProps,
  StoredDocSearchHit,
  DocSearchTransformClient,
  DocSearchHit,
  DocSearchTranslations,
} from '@docsearch/react';
import { DocSearchButton } from '@docsearch/react/button';
import { SidepanelButton } from '@docsearch/react/sidepanel';
import type { Sidepanel as SidepanelType } from '@docsearch/react/sidepanel';
import { useDocSearchKeyboardEvents } from '@docsearch/react/useDocSearchKeyboardEvents';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { isRegexpStringMatch } from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import translations from '@theme/SearchTranslations';
import type { FacetFilters } from 'algoliasearch/lite';
import React, { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import {
  useAlgoliaContextualFacetFilters,
  useAlgoliaThemeConfig,
  useSearchResultUrlProcessor,
  useAlgoliaAskAi,
  useAlgoliaAskAiSidepanel,
  mergeFacetFilters,
} from '../../client';

type DocSearchProps = Omit<DocSearchModalProps, 'initialScrollY' | 'onClose'> & {
  contextualSearch?: string;
  externalUrlRegex?: string;
  searchPagePath: boolean | string;
  askAi?: Exclude<(DocSearchModalProps & { askAi: unknown })['askAi'], string | undefined>;
};

type AskAiTogglePayload = {
  query: string;
  messageId?: string;
  suggestedQuestionId?: string;
};

type OnAskAiToggle = (toggle: boolean, payload?: AskAiTogglePayload) => void;
type NavigatorNavigateParams = Parameters<NonNullable<NonNullable<DocSearchModalProps['navigator']>['navigate']>>[0];

interface AlgoliaSearchBarProps extends Omit<DocSearchProps, 'askAi'> {
  indexName: string;
  askAi?: ThemeConfigAlgolia['askAi'];
  translations?: DocSearchTranslations;
}

let DocSearchModal: typeof DocSearchModalType | null = null;
let DocSearchSidepanel: typeof SidepanelType | null = null;

function importDocSearchModalIfNeeded(): Promise<void> {
  if (DocSearchModal) {
    return Promise.resolve();
  }

  // eslint-disable-next-line import/dynamic-import-chunkname
  return Promise.all([import('@docsearch/react/modal'), import('@docsearch/react/style'), import('./styles.css')]).then(
    ([{ DocSearchModal: Modal }]) => {
      DocSearchModal = Modal;
    },
  );
}

async function importDocSearchSidepanelIfNeeded(): Promise<void> {
  await importDocSearchModalIfNeeded();
  if (DocSearchSidepanel) {
    return Promise.resolve();
  }

  // eslint-disable-next-line import/dynamic-import-chunkname
  return Promise.all([import('@docsearch/react/sidepanel'), import('@docsearch/react/style/sidepanel')]).then(
    ([{ Sidepanel }]) => {
      DocSearchSidepanel = Sidepanel;
    },
  );
}

function useNavigator({
  externalUrlRegex,
}: Pick<DocSearchProps, 'externalUrlRegex'>): DocSearchModalProps['navigator'] {
  const history = useHistory();
  const [navigator] = useState<DocSearchModalProps['navigator']>(() => {
    return {
      navigate(params: NavigatorNavigateParams) {
        // Algolia results could contain URL's from other domains which cannot
        // be served through history and should navigate with window.location
        if (isRegexpStringMatch(externalUrlRegex, params.itemUrl)) {
          window.location.href = params.itemUrl;
        } else {
          history.push(params.itemUrl);
        }
      },
    };
  });
  return navigator;
}

function useTransformSearchClient(): DocSearchModalProps['transformSearchClient'] {
  const {
    siteMetadata: { docusaurusVersion },
  } = useDocusaurusContext();
  return useCallback(
    (searchClient: DocSearchTransformClient) => {
      searchClient.addAlgoliaAgent('docusaurus', docusaurusVersion);
      return searchClient;
    },
    [docusaurusVersion],
  );
}

function useTransformItems(props: Pick<DocSearchProps, 'transformItems'>) {
  const processSearchResultUrl = useSearchResultUrlProcessor();
  const [transformItems] = useState<DocSearchModalProps['transformItems']>(() => {
    return (items: DocSearchHit[]) =>
      props.transformItems
        ? // Custom transformItems
          props.transformItems(items)
        : // Default transformItems
          items.map((item) => ({
            ...item,
            url: processSearchResultUrl(item.url),
          }));
  });
  return transformItems;
}

function useResultsFooterComponent({
  closeModal,
  searchPagePath,
}: {
  closeModal: () => void;
  searchPagePath?: string;
}): DocSearchProps['resultsFooterComponent'] {
  return useMemo(
    () =>
      searchPagePath
        ? ({ state }) => <ResultsFooter state={state} searchPagePath={searchPagePath} onClose={closeModal} />
        : undefined,
    [closeModal, searchPagePath],
  );
}

function Hit({ hit, children }: { hit: InternalDocSearchHit | StoredDocSearchHit; children: ReactNode }) {
  return <Link to={hit.url}>{children}</Link>;
}

type ResultsFooterProps = {
  state: AutocompleteState<InternalDocSearchHit>;
  onClose: () => void;
  searchPagePath: string;
};

function ResultsFooter({ state, onClose, searchPagePath }: ResultsFooterProps) {
  const searchPageLink = useBaseUrl(searchPagePath);
  const nbHits = (state.context as { nbHits?: number }).nbHits ?? 0;
  const searchLink = state.query
    ? `${searchPageLink}${searchPageLink.includes('?') ? '&' : '?'}q=${encodeURIComponent(state.query)}`
    : searchPageLink;

  return (
    <Link to={searchLink} onClick={onClose}>
      <Translate id="theme.SearchBar.seeAll" values={{ count: nbHits }}>
        {'See all {count} results'}
      </Translate>
    </Link>
  );
}

function useSearchParameters({ contextualSearch, ...props }: DocSearchProps): DocSearchProps['searchParameters'] {
  const contextualSearchFacetFilters = useAlgoliaContextualFacetFilters();

  const configFacetFilters: FacetFilters = props.searchParameters?.facetFilters ?? [];

  const facetFilters: FacetFilters = contextualSearch
    ? // Merge contextual search filters with config filters
      mergeFacetFilters(contextualSearchFacetFilters, configFacetFilters)
    : // ... or use config facetFilters
      configFacetFilters;

  // We let users override default searchParameters if they want to
  return {
    ...props.searchParameters,
    facetFilters,
  };
}

function DocSearch({ externalUrlRegex, ...props }: AlgoliaSearchBarProps) {
  const navigator = useNavigator({ externalUrlRegex });
  const searchParameters = useSearchParameters({ ...props } as DocSearchProps);
  const transformItems = useTransformItems(props);
  const transformSearchClient = useTransformSearchClient();

  const searchContainer = useRef<HTMLDivElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined);

  const { isAskAiActive, currentPlaceholder, onAskAiToggle, extraAskAiProps, askAi } = useAlgoliaAskAi(props);
  const {
    sidePanelEnabled,
    showSidepanelButton,
    sidePanelOptions,
    sidePanelAgentStudio,
    sidepanelPortalContainer,
    isSidepanelOpen,
    sidepanelInitialMessage,
    openSidepanel,
    closeSidepanel,
    toggleSidepanel,
    handleSidepanelOpen,
    loadSidepanel,
  } = useAlgoliaAskAiSidepanel({
    askAiConfig: askAi,
    importSidepanel: importDocSearchSidepanelIfNeeded,
  });

  const prepareSearchContainer = useCallback(() => {
    if (!searchContainer.current) {
      const divElement = document.createElement('div');
      searchContainer.current = divElement;
      document.body.insertBefore(divElement, document.body.firstChild);
    }
  }, []);

  const openModal = useCallback(() => {
    prepareSearchContainer();
    importDocSearchModalIfNeeded().then(() => setIsOpen(true));
  }, [prepareSearchContainer]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    searchButtonRef.current?.focus();
    setInitialQuery(undefined);
    onAskAiToggle(false);
  }, [onAskAiToggle]);

  const handleAskAiToggle = useCallback<OnAskAiToggle>(
    (active, payload) => {
      if (active && sidePanelEnabled) {
        closeModal();
        openSidepanel(payload);
        return;
      }
      onAskAiToggle(active);
    },
    [closeModal, onAskAiToggle, openSidepanel, sidePanelEnabled],
  );

  // cleanup search container
  useEffect(() => {
    return () => {
      if (searchContainer.current) {
        searchContainer.current.remove();
        searchContainer.current = null;
      }
    };
  }, []);

  const handleInput = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'f' && (event.metaKey || event.ctrlKey)) {
        // ignore browser's ctrl+f
        return;
      }
      // prevents duplicate key insertion in the modal input
      event.preventDefault();
      setInitialQuery(event.key);
      openModal();
    },
    [openModal],
  );

  const resultsFooterSearchPagePath = typeof props.searchPagePath === 'string' ? props.searchPagePath : undefined;
  const resultsFooterComponent = useResultsFooterComponent({
    closeModal,
    searchPagePath: resultsFooterSearchPagePath,
  });

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen: openModal,
    onClose: closeModal,
    onInput: handleInput,
    searchButtonRef,
    isAskAiActive: isAskAiActive ?? false,
    onAskAiToggle: onAskAiToggle ?? (() => {}),
  });

  return (
    <>
      <Head>
        {/* This hints the browser that the website will load data from Algolia,
        and allows it to preconnect to the DocSearch cluster. It makes the first
        query faster, especially on mobile. */}
        <link rel="preconnect" href={`https://${props.appId}-dsn.algolia.net`} crossOrigin="anonymous" />
      </Head>

      <div className="DocSearch-SearchBar">
        <DocSearchButton
          ref={searchButtonRef}
          translations={props.translations?.button ?? translations.button}
          onTouchStart={importDocSearchModalIfNeeded}
          onFocus={importDocSearchModalIfNeeded}
          onMouseOver={importDocSearchModalIfNeeded}
          onClick={openModal}
        />
        {showSidepanelButton && (
          <SidepanelButton
            translations={{
              buttonText: '',
              buttonAriaLabel: 'Ask AI',
            }}
            variant={sidePanelOptions?.variant ?? 'inline'}
            keyboardShortcuts={sidePanelOptions?.keyboardShortcuts}
            onTouchStart={loadSidepanel}
            onFocus={loadSidepanel}
            onMouseOver={loadSidepanel}
            onClick={toggleSidepanel}
          />
        )}
      </div>

      {isOpen &&
        DocSearchModal &&
        searchContainer.current &&
        createPortal(
          <DocSearchModal
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            navigator={navigator}
            transformItems={transformItems}
            hitComponent={Hit}
            transformSearchClient={transformSearchClient}
            interceptAskAiEvent={(payload) => {
              if (!sidePanelEnabled) {
                return false;
              }
              closeModal();
              openSidepanel(payload);
              return true;
            }}
            onClose={closeModal}
            {...(resultsFooterSearchPagePath && {
              resultsFooterComponent,
            })}
            placeholder={currentPlaceholder}
            {...(props as DocSearchProps)}
            translations={props.translations?.modal ?? translations.modal}
            searchParameters={searchParameters}
            {...extraAskAiProps}
            isHybridModeSupported={sidePanelEnabled}
            onAskAiToggle={handleAskAiToggle as DocSearchModalProps['onAskAiToggle']}
          />,
          searchContainer.current,
        )}

      {sidePanelEnabled &&
        DocSearchSidepanel &&
        askAi &&
        sidepanelPortalContainer &&
        createPortal(
          <DocSearchSidepanel
            {...sidePanelOptions}
            variant={sidePanelOptions?.variant ?? 'inline'}
            pushSelector={sidePanelOptions?.pushSelector ?? '#__docusaurus'}
            assistantId={askAi.assistantId}
            apiKey={askAi.apiKey}
            appId={askAi.appId}
            indexName={askAi.indexName}
            agentStudio={sidePanelAgentStudio}
            suggestedQuestions={sidePanelOptions?.suggestedQuestions ?? askAi.suggestedQuestions}
            isOpen={isSidepanelOpen}
            initialMessage={sidepanelInitialMessage}
            onOpen={handleSidepanelOpen}
            onClose={closeSidepanel}
          />,
          sidepanelPortalContainer,
        )}
    </>
  );
}

export default function SearchBar(props: Partial<AlgoliaSearchBarProps>): ReactNode {
  const themeConfig = useAlgoliaThemeConfig();

  const docSearchProps: AlgoliaSearchBarProps = {
    ...(themeConfig as unknown as AlgoliaSearchBarProps),
    // Let props override theme config
    // See https://github.com/facebook/docusaurus/pull/11581
    ...props,
  };

  return <DocSearch {...docSearchProps} />;
}
