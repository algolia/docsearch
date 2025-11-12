import type { AutocompleteOptions, AutocompleteState } from '@algolia/autocomplete-core';
import { DocSearch as DocSearchProvider, useDocSearch } from '@docsearch/core';
import type { DocSearchModalShortcuts } from '@docsearch/core';
import type { LiteClient, SearchParamsObject } from 'algoliasearch/lite';
import React, { type JSX } from 'react';
import { createPortal } from 'react-dom';

import { DocSearchButton } from './DocSearchButton';
import { DocSearchModal } from './DocSearchModal';
import type { DocSearchHit, DocSearchTheme, InternalDocSearchHit, StoredDocSearchHit } from './types';

import type { ButtonTranslations, ModalTranslations } from '.';

export type DocSearchTranslations = Partial<{
  button: ButtonTranslations;
  modal: ModalTranslations;
}>;

// The interface that describes the minimal implementation required for the algoliasearch client, when using the [`transformSearchClient`](https://docsearch.algolia.com/docs/api/#transformsearchclient) option.
export type DocSearchTransformClient = {
  search: LiteClient['search'];
  addAlgoliaAgent: LiteClient['addAlgoliaAgent'];
  transporter: Pick<LiteClient['transporter'], 'algoliaAgent'>;
};

// Define the specific search parameters allowed for Ask AI
export type AskAiSearchParameters = {
  facetFilters?: string[];
  filters?: string;
  attributesToRetrieve?: string[];
  restrictSearchableAttributes?: string[];
  distinct?: boolean;
};

export type DocSearchAskAi = {
  /**
   * The index name to use for the ask AI feature. Your assistant will search this index for relevant documents.
   * If not provided, the index name will be used.
   */
  indexName?: string;
  /**
   * The API key to use for the ask AI feature. Your assistant will use this API key to search the index.
   * If not provided, the API key will be used.
   */
  apiKey?: string;
  /**
   * The app ID to use for the ask AI feature. Your assistant will use this app ID to search the index.
   * If not provided, the app ID will be used.
   */
  appId?: string;
  /**
   * The assistant ID to use for the ask AI feature.
   */
  assistantId: string | null;
  /**
   * The search parameters to use for the ask AI feature.
   */
  searchParameters?: AskAiSearchParameters;
  /**
   * Enables displaying suggested questions on Ask AI's new conversation screen.
   *
   * @default false
   */
  suggestedQuestions?: boolean;
};

export interface DocSearchIndex {
  name: string;
  searchParameters?: SearchParamsObject;
}

export interface DocSearchProps {
  /**
   * Algolia application id used by the search client.
   */
  appId: string;
  /**
   * Public api key with search permissions for the index.
   */
  apiKey: string;
  /**
   * Name of the algolia index to query.
   *
   * @deprecated `indexName` will be removed in a future version. Please use `indices` property going forward.
   */
  indexName?: string;
  /**
   * List of indices and _optional_ searchParameters to be used for search.
   *
   * @see {@link https://docsearch.algolia.com/docs/api#indices}
   */
  indices?: Array<DocSearchIndex | string>;
  /**
   * Configuration or assistant id to enable ask ai mode. Pass a string assistant id or a full config object.
   */
  askAi?: DocSearchAskAi | string;
  /**
   * Theme overrides applied to the modal and related components.
   */
  theme?: DocSearchTheme;
  /**
   * Placeholder text for the search input.
   */
  placeholder?: string;
  /**
   * Additional algolia search parameters to merge into each query.
   *
   * @deprecated `searchParameters` will be removed in a future version. Please use `indices` property going forward.
   */
  searchParameters?: SearchParamsObject;
  /**
   * Maximum number of hits to display per source/group.
   */
  maxResultsPerGroup?: number;
  /**
   * Hook to post-process hits before rendering.
   */
  transformItems?: (items: DocSearchHit[]) => DocSearchHit[];
  /**
   * Custom component to render an individual hit.
   * Supports template patterns:
   * - HTML strings with html helper: (props, { html }) => html`<div>...</div>`
   * - JSX templates: (props) => <div>...</div>
   * - Function-based templates: (props) => string | JSX.Element | Function.
   */
  hitComponent?: (
    props: {
      hit: InternalDocSearchHit | StoredDocSearchHit;
      children: React.ReactNode;
    },
    helpers?: {
      html: (template: TemplateStringsArray, ...values: any[]) => any;
    },
  ) => JSX.Element;
  /**
   * Custom component rendered at the bottom of the results panel.
   * Supports template patterns:
   * - HTML strings with html helper: (props, { html }) => html`<div>...</div>`
   * - JSX templates: (props) => <div>...</div>
   * - Function-based templates: (props) => string | JSX.Element | Function.
   */
  resultsFooterComponent?: (
    props: {
      state: AutocompleteState<InternalDocSearchHit>;
    },
    helpers?: {
      html: (template: TemplateStringsArray, ...values: any[]) => any;
    },
  ) => JSX.Element | null;
  /**
   * Hook to wrap or modify the algolia search client.
   */
  transformSearchClient?: (searchClient: DocSearchTransformClient) => DocSearchTransformClient;
  /**
   * Disable storage and usage of recent and favorite searches.
   */
  disableUserPersonalization?: boolean;
  /**
   * Query string to prefill when opening the modal.
   */
  initialQuery?: string;
  /**
   * Custom navigator for controlling link navigation.
   */
  navigator?: AutocompleteOptions<InternalDocSearchHit>['navigator'];
  /**
   * Localized strings for the button and modal ui.
   */
  translations?: DocSearchTranslations;
  /**
   * Builds a url to report missing results for a given query.
   */
  getMissingResultsUrl?: ({ query }: { query: string }) => string;
  /**
   * Insights client integration options to send analytics events.
   */
  insights?: AutocompleteOptions<InternalDocSearchHit>['insights'];
  /**
   * The container element where the modal should be portaled to. Defaults to document.body.
   */
  portalContainer?: DocumentFragment | Element;
  /**
   * Limit of how many recent searches should be saved/displayed..
   *
   * @default 7
   */
  recentSearchesLimit?: number;
  /**
   * Limit of how many recent searches should be saved/displayed when there are favorited searches..
   *
   * @default 4
   */
  recentSearchesWithFavoritesLimit?: number;
  /**
   * Configuration for keyboard shortcuts. Allows enabling/disabling specific shortcuts.
   *
   * @default `{ 'Ctrl/Cmd+K': true, '/': true }`
   */
  keyboardShortcuts?: DocSearchModalShortcuts;
}

export function DocSearch(props: DocSearchProps): JSX.Element {
  return (
    <DocSearchProvider {...props}>
      <DocSearchInner {...props} />
    </DocSearchProvider>
  );
}

export function DocSearchInner(props: DocSearchProps): JSX.Element {
  const {
    searchButtonRef,
    keyboardShortcuts,
    isModalActive,
    isAskAiActive,
    initialQuery,
    onAskAiToggle,
    openModal,
    closeModal,
    registerView,
  } = useDocSearch();

  React.useEffect(() => {
    registerView('modal');
  }, [registerView]);

  return (
    <>
      <DocSearchButton
        keyboardShortcuts={keyboardShortcuts}
        ref={searchButtonRef}
        translations={props.translations?.button}
        onClick={openModal}
      />
      {isModalActive &&
        createPortal(
          <DocSearchModal
            {...props}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            translations={props?.translations?.modal}
            isAskAiActive={isAskAiActive}
            onAskAiToggle={onAskAiToggle}
            onClose={closeModal}
          />,
          props.portalContainer ?? document.body,
        )}
    </>
  );
}
