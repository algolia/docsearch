import type {
  AutocompleteOptions,
  AutocompleteState,
} from '@algolia/autocomplete-core';
import { DocSearch as DocSearchProvider, useDocSearch } from '@docsearch/core';
import type { DocSearchModalShortcuts, DocSearchRef } from '@docsearch/core';
import type { LiteClient, SearchParamsObject } from 'algoliasearch/lite';
import React, { type JSX } from 'react';
import { createPortal } from 'react-dom';

import { DocSearchButton } from './DocSearchButton';
import type { ButtonTranslations } from './DocSearchButton';
import { DocSearchModal } from './DocSearchModal';
import type { ModalTranslations } from './DocSearchModal';
import type {
  DocSearchHit,
  DocSearchTheme,
  InternalDocSearchHit,
  StoredDocSearchHit,
} from './types';

export type { DocSearchRef } from '@docsearch/core';

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

export interface DocSearchIndex {
  name: string;
  searchParameters?: SearchParamsObject;
}

export interface DocSearchFacet {
  key: string;
  label?: string;
}

export interface DocSearchProps {
  /** Algolia application id used by the search client. */
  appId: string;
  /** Public api key with search permissions for the index. */
  apiKey: string;
  /**
   * Name of the algolia index to query.
   *
   * @deprecated `indexName` will be removed in a future version. Please use
   *   `indices` property going forward.
   */
  indexName?: string;
  /**
   * List of indices and _optional_ searchParameters to be used for search.
   *
   * @see {@link https://docsearch.algolia.com/docs/api#indices}
   */
  indices?: Array<DocSearchIndex | string>;
  /**
   * Facets to display as keyword-search filter controls. Values are read
   * dynamically from the configured Algolia indices.
   *
   * @default [ ]
   */
  facets?: DocSearchFacet[];
  /** Theme overrides applied to the modal and related components. */
  theme?: DocSearchTheme;
  /** Placeholder text for the search input. */
  placeholder?: string;
  /**
   * Additional algolia search parameters to merge into each query.
   *
   * @deprecated `searchParameters` will be removed in a future version. Please
   *   use `indices` property going forward.
   */
  searchParameters?: SearchParamsObject;
  /** Maximum number of hits to display per source/group. */
  maxResultsPerGroup?: number;
  /** Hook to post-process hits before rendering. */
  transformItems?: (items: DocSearchHit[]) => DocSearchHit[];
  /**
   * Custom component to render an individual hit. Supports template patterns:
   *
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
    }
  ) => JSX.Element;
  /**
   * Custom component rendered at the bottom of the results panel. Supports
   * template patterns:
   *
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
    }
  ) => JSX.Element | null;
  /** Hook to wrap or modify the algolia search client. */
  transformSearchClient?: (
    searchClient: DocSearchTransformClient
  ) => DocSearchTransformClient;
  /** Disable storage and usage of recent and favorite searches. */
  disableUserPersonalization?: boolean;
  /** Query string to prefill when opening the modal. */
  initialQuery?: string;
  /** Custom navigator for controlling link navigation. */
  navigator?: AutocompleteOptions<InternalDocSearchHit>['navigator'];
  /** Localized strings for the button and modal ui. */
  translations?: DocSearchTranslations;
  /** Builds a url to report missing results for a given query. */
  getMissingResultsUrl?: ({ query }: { query: string }) => string;
  /** Insights client integration options to send analytics events. */
  insights?: AutocompleteOptions<InternalDocSearchHit>['insights'];
  /**
   * The container element where the modal should be portaled to. Defaults to
   * document.body.
   */
  portalContainer?: DocumentFragment | Element;
  /**
   * Limit of how many recent searches should be saved/displayed..
   *
   * @default 7
   */
  recentSearchesLimit?: number;
  /**
   * Limit of how many recent searches should be saved/displayed when there are
   * favorited searches..
   *
   * @default 4
   */
  recentSearchesWithFavoritesLimit?: number;
  /**
   * Configuration for keyboard shortcuts. Allows enabling/disabling specific
   * shortcuts.
   *
   * @default `{ 'Ctrl/Cmd+K': true, '/': true }`
   */
  keyboardShortcuts?: DocSearchModalShortcuts;
  /**
   * The key used to render a custom badge for each hit. Key must match a
   * property returned in `searchParameters.attributesToRetrieve`.
   *
   * @example
   *   'version';
   *   'hierarchy.lvl1';
   *   'tags[2]';
   *
   * @default undefined
   */
  resultBadgeKey?: string;
}

function DocSearchComponent(
  props: DocSearchProps,
  ref: React.ForwardedRef<DocSearchRef>
): JSX.Element {
  return (
    <DocSearchProvider {...props} ref={ref}>
      <DocSearchInner {...props} />
    </DocSearchProvider>
  );
}

export const DocSearch = React.forwardRef(DocSearchComponent);

export function DocSearchInner(props: DocSearchProps): JSX.Element {
  const {
    searchButtonRef,
    keyboardShortcuts,
    isModalActive,
    initialQuery,
    openModal,
    closeModal,
  } = useDocSearch();

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
            onClose={closeModal}
          />,
          props.portalContainer ?? document.body
        )}
    </>
  );
}
