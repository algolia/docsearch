/* eslint-disable import/dynamic-import-chunkname */
/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { AutocompleteState } from '@algolia/autocomplete-core';
import { DocSearch as DocSearchProvider, useDocSearch } from '@docsearch/core';
import type { DocSearchAskAiModal as DocSearchAskAiModalType } from '@docsearch/modal/askai';
import { DocSearchButton } from '@docsearch/modal/button';
import type { DocSearchModal as DocSearchModalType } from '@docsearch/modal/modal';
import type {
  DocSearchAskAiModalProps,
  DocSearchHit,
  DocSearchModalProps,
  DocSearchProps,
  DocSearchTransformClient,
  DocSearchTranslations,
  InternalDocSearchHit,
  StoredDocSearchHit,
} from '@docsearch/react';
import { SidepanelButton } from '@docsearch/sidepanel/button';
import type { Sidepanel as SidepanelType } from '@docsearch/sidepanel/sidepanel';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { isRegexpStringMatch } from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import translations from '@theme/SearchTranslations';
import React, { useCallback, useEffect, useMemo, useState, type JSX, type ReactNode } from 'react';

import {
  mergeFacetFilters,
  useAlgoliaAskAi,
  useAlgoliaAskAiSidepanel,
  useAlgoliaContextualFacetFilters,
  useAlgoliaThemeConfig,
  useSearchResultUrlProcessor,
} from '../../client';

import type { ThemeConfigDocSearch } from '@docsearch/docusaurus-adapter';

type NavigatorNavigateParams = Parameters<NonNullable<NonNullable<DocSearchModalProps['navigator']>['navigate']>>[0];

type SidePanelOptions = Exclude<NonNullable<ThemeConfigDocSearch['sidePanel']>, boolean>;
type SidePanelPanelOptions = Omit<SidePanelOptions, 'hideButton' | 'keyboardShortcuts'>;

type AdapterDocSearchProps = Omit<
  DocSearchAskAiModalProps,
  | 'askAi'
  | 'indexName'
  | 'initialScrollY'
  | 'isAskAiActive'
  | 'isHybridModeSupported'
  | 'onAskAiToggle'
  | 'onClose'
  | 'searchParameters'
> & {
  askAi?: ThemeConfigDocSearch['askAi'];
  contextualSearch?: boolean;
  externalUrlRegex?: string;
  indices: NonNullable<DocSearchProps['indices']>;
  searchPage: ThemeConfigDocSearch['searchPage'];
  sidePanel?: ThemeConfigDocSearch['sidePanel'];
  translations?: DocSearchTranslations;
};

let DocSearchModal: typeof DocSearchModalType | null = null;
let DocSearchAskAiModal: typeof DocSearchAskAiModalType | null = null;
let DocSearchSidepanel: typeof SidepanelType | null = null;

function importDocSearchModalIfNeeded(): Promise<void> {
  if (DocSearchModal && DocSearchAskAiModal) {
    return Promise.resolve();
  }

  return Promise.all([
    import('@docsearch/modal/modal'),
    import('@docsearch/modal/askai'),
    import('@docsearch/react/style'),
    import('./styles.css'),
  ]).then(([{ DocSearchModal: Modal }, { DocSearchAskAiModal: AskAiModal }]) => {
    DocSearchModal = Modal;
    DocSearchAskAiModal = AskAiModal;
  });
}

function importDocSearchSidepanelIfNeeded(): Promise<void> {
  if (DocSearchSidepanel) {
    return Promise.resolve();
  }

  return Promise.all([import('@docsearch/sidepanel/sidepanel'), import('@docsearch/react/style/sidepanel')]).then(
    ([{ Sidepanel }]) => {
      DocSearchSidepanel = Sidepanel;
    },
  );
}

function useNavigator({
  externalUrlRegex,
}: Pick<AdapterDocSearchProps, 'externalUrlRegex'>): DocSearchModalProps['navigator'] {
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

function useTransformItems(
  props: Pick<AdapterDocSearchProps, 'transformItems'>,
): DocSearchModalProps['transformItems'] {
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
}): DocSearchModalProps['resultsFooterComponent'] {
  return useMemo(
    () =>
      searchPagePath
        ? ({ state }) => <ResultsFooter state={state} searchPagePath={searchPagePath} onClose={closeModal} />
        : undefined,
    [closeModal, searchPagePath],
  );
}

function Hit({ hit, children }: { hit: InternalDocSearchHit | StoredDocSearchHit; children: ReactNode }): JSX.Element {
  return <Link to={hit.url}>{children}</Link>;
}

type ResultsFooterProps = {
  state: AutocompleteState<InternalDocSearchHit>;
  onClose: () => void;
  searchPagePath: string;
};

function ResultsFooter({ state, onClose, searchPagePath }: ResultsFooterProps): JSX.Element {
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

function useSearchIndices({
  contextualSearch,
  indices,
}: Pick<AdapterDocSearchProps, 'contextualSearch' | 'indices'>): AdapterDocSearchProps['indices'] {
  const contextualSearchFacetFilters = useAlgoliaContextualFacetFilters();

  return useMemo(() => {
    if (!contextualSearch) {
      return indices;
    }

    return indices.map((index) => {
      if (typeof index === 'string') {
        return {
          name: index,
          searchParameters: {
            facetFilters: contextualSearchFacetFilters,
          },
        };
      }

      return {
        ...index,
        searchParameters: {
          ...index.searchParameters,
          facetFilters: mergeFacetFilters(index.searchParameters?.facetFilters, contextualSearchFacetFilters),
        },
      };
    });
  }, [contextualSearch, contextualSearchFacetFilters, indices]);
}

function getSearchPagePath(searchPage: ThemeConfigDocSearch['searchPage']): string | undefined {
  return searchPage === false ? undefined : searchPage.path;
}

function getSidePanelPanelOptions(sidePanelOptions?: SidePanelOptions): SidePanelPanelOptions {
  if (!sidePanelOptions) {
    return {};
  }

  const { hideButton: _hideButton, keyboardShortcuts: _keyboardShortcuts, ...panelOptions } = sidePanelOptions;
  return panelOptions;
}

function DocSearch({
  askAi,
  contextualSearch,
  externalUrlRegex,
  searchPage,
  sidePanel,
  ...props
}: AdapterDocSearchProps) {
  const navigator = useNavigator({ externalUrlRegex });
  const indices = useSearchIndices({
    contextualSearch,
    indices: props.indices,
  });
  const transformItems = useTransformItems(props);
  const transformSearchClient = useTransformSearchClient();
  const { closeModal, isModalActive } = useDocSearch();
  const [modalLoaded, setModalLoaded] = useState(Boolean(DocSearchModal && DocSearchAskAiModal));
  const [sidepanelLoaded, setSidepanelLoaded] = useState(Boolean(DocSearchSidepanel));
  const { modalAskAi, sidePanelAskAi } = useAlgoliaAskAi({
    appId: props.appId,
    apiKey: props.apiKey,
    indices: props.indices,
    askAi,
  });
  const { sidePanelEnabled, showSidepanelButton, sidePanelOptions } = useAlgoliaAskAiSidepanel({
    sidePanel,
  });
  const searchPagePath = getSearchPagePath(searchPage);
  const resultsFooterComponent = useResultsFooterComponent({
    closeModal,
    searchPagePath,
  });

  const loadModal = useCallback(() => {
    return importDocSearchModalIfNeeded().then(() => setModalLoaded(true));
  }, []);

  const loadSidepanel = useCallback(() => {
    return importDocSearchSidepanelIfNeeded().then(() => setSidepanelLoaded(true));
  }, []);

  useEffect(() => {
    if (isModalActive) {
      loadModal();
    }
  }, [isModalActive, loadModal]);

  useEffect(() => {
    if (sidePanelEnabled && sidePanelAskAi) {
      loadSidepanel();
    }
  }, [loadSidepanel, sidePanelAskAi, sidePanelEnabled]);

  const modalProps = {
    ...props,
    navigator,
    transformItems,
    hitComponent: Hit,
    transformSearchClient,
    ...(searchPagePath && {
      resultsFooterComponent,
    }),
    translations: props.translations?.modal ?? translations.modal,
    indices,
  };
  const panelOptions = getSidePanelPanelOptions(sidePanelOptions);

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
          translations={props.translations?.button ?? translations.button}
          onTouchStart={loadModal}
          onFocus={loadModal}
          onMouseOver={loadModal}
        />
        {ExecutionEnvironment.canUseDOM && showSidepanelButton && sidePanelAskAi && (
          <SidepanelButton
            translations={{
              buttonText: '',
              buttonAriaLabel: 'Ask AI',
            }}
            variant={sidePanelOptions?.variant ?? 'inline'}
            keyboardShortcuts={sidePanelOptions?.keyboardShortcuts}
          />
        )}
      </div>

      {modalLoaded &&
        (modalAskAi && DocSearchAskAiModal ? (
          <DocSearchAskAiModal {...modalProps} askAi={modalAskAi} />
        ) : (
          DocSearchModal && <DocSearchModal {...modalProps} />
        ))}

      {ExecutionEnvironment.canUseDOM &&
        sidePanelEnabled &&
        sidepanelLoaded &&
        sidePanelAskAi &&
        DocSearchSidepanel && (
          <DocSearchSidepanel
            {...panelOptions}
            variant={panelOptions.variant ?? 'inline'}
            pushSelector={panelOptions.pushSelector ?? '#__docusaurus'}
            assistantId={sidePanelAskAi.assistantId}
            apiKey={sidePanelAskAi.apiKey}
            appId={sidePanelAskAi.appId}
            indexName={sidePanelAskAi.indexName}
            searchParameters={sidePanelAskAi.searchParameters}
            indices={panelOptions.indices ?? sidePanelAskAi.indices}
            suggestedQuestions={panelOptions.suggestedQuestions ?? sidePanelAskAi.suggestedQuestions}
            tools={panelOptions.tools ?? sidePanelAskAi.tools}
            memory={panelOptions.memory ?? sidePanelAskAi.memory}
          />
        )}
    </>
  );
}

export default function SearchBar(props: Partial<AdapterDocSearchProps>): ReactNode {
  const themeConfig = useAlgoliaThemeConfig();

  const docSearchProps: AdapterDocSearchProps = {
    ...(themeConfig as AdapterDocSearchProps),
    // Let props override theme config
    // See https://github.com/facebook/docusaurus/pull/11581
    ...props,
  };

  return (
    <DocSearchProvider initialQuery={docSearchProps.initialQuery} keyboardShortcuts={docSearchProps.keyboardShortcuts}>
      <DocSearch {...docSearchProps} />
    </DocSearchProvider>
  );
}
