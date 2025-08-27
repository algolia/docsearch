import type { AutocompleteOptions, AutocompleteState } from '@algolia/autocomplete-core';
import type { LiteClient, SearchParamsObject } from 'algoliasearch/lite';
import React, { type JSX } from 'react';
import { createPortal } from 'react-dom';

import { DocSearchButton } from './DocSearchButton';
import { DocSearchModal } from './DocSearchModal';
import type { DocSearchHit, DocSearchTheme, InternalDocSearchHit, StoredDocSearchHit } from './types';
import { useDocSearchKeyboardEvents } from './useDocSearchKeyboardEvents';
import { useTheme } from './useTheme';

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
  searchParameters?: {
    facetFilters?: SearchParamsObject['facetFilters'];
  };
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
   * List of indices to be used for search.
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
   */
  hitComponent?: (props: { hit: InternalDocSearchHit | StoredDocSearchHit; children: React.ReactNode }) => JSX.Element;
  /**
   * Custom component rendered at the bottom of the results panel.
   */
  resultsFooterComponent?: (props: { state: AutocompleteState<InternalDocSearchHit> }) => JSX.Element | null;
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
}

export function DocSearch({ indexName, searchParameters, indices = [], ...props }: DocSearchProps): JSX.Element {
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [initialQuery, setInitialQuery] = React.useState<string | undefined>(props?.initialQuery || undefined);
  const [isAskAiActive, setIsAskAiActive] = React.useState(false);

  let currentPlaceholder =
    props?.translations?.modal?.searchBox?.placeholderText || props?.placeholder || 'Search docs';

  // check if the instance is configured to handle ask ai
  const canHandleAskAi = Boolean(props?.askAi);

  if (canHandleAskAi) {
    currentPlaceholder = props?.translations?.modal?.searchBox?.placeholderText || 'Search docs or ask AI a question';
  }

  if (isAskAiActive) {
    currentPlaceholder = props?.translations?.modal?.searchBox?.placeholderTextAskAi || 'Ask another question...';
  }

  const onAskAiToggle = React.useCallback(
    (askAitoggle: boolean) => {
      setIsAskAiActive(askAitoggle);
    },
    [setIsAskAiActive],
  );

  const onOpen = React.useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = React.useCallback(() => {
    setIsOpen(false);
    setInitialQuery(props?.initialQuery);
    if (isAskAiActive) {
      setIsAskAiActive(false);
    }
  }, [setIsOpen, props.initialQuery, isAskAiActive, setIsAskAiActive]);

  const onInput = React.useCallback(
    (event: KeyboardEvent) => {
      setIsOpen(true);
      setInitialQuery(event.key);
    },
    [setIsOpen, setInitialQuery],
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    isAskAiActive,
    onAskAiToggle,
    searchButtonRef,
  });
  useTheme({ theme: props.theme });

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

  return (
    <>
      <DocSearchButton ref={searchButtonRef} translations={props?.translations?.button} onClick={onOpen} />

      {isOpen &&
        createPortal(
          <DocSearchModal
            {...props}
            placeholder={currentPlaceholder}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            translations={props?.translations?.modal}
            isAskAiActive={isAskAiActive}
            canHandleAskAi={canHandleAskAi}
            indexes={indexes}
            onAskAiToggle={onAskAiToggle}
            onClose={onClose}
          />,
          props.portalContainer ?? document.body,
        )}
    </>
  );
}
