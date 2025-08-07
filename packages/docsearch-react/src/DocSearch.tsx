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

export interface DocSearchProps {
  appId: string;
  apiKey: string;
  indexName: string;
  askAi?: DocSearchAskAi | string;
  theme?: DocSearchTheme;
  placeholder?: string;
  searchParameters?: SearchParamsObject;
  maxResultsPerGroup?: number;
  transformItems?: (items: DocSearchHit[]) => DocSearchHit[];
  hitComponent?: (props: { hit: InternalDocSearchHit | StoredDocSearchHit; children: React.ReactNode }) => JSX.Element;
  resultsFooterComponent?: (props: { state: AutocompleteState<InternalDocSearchHit> }) => JSX.Element | null;
  transformSearchClient?: (searchClient: DocSearchTransformClient) => DocSearchTransformClient;
  disableUserPersonalization?: boolean;
  initialQuery?: string;
  navigator?: AutocompleteOptions<InternalDocSearchHit>['navigator'];
  translations?: DocSearchTranslations;
  getMissingResultsUrl?: ({ query }: { query: string }) => string;
  insights?: AutocompleteOptions<InternalDocSearchHit>['insights'];
  /**
   * Limit of how many recent searches that should be saved/displayed.
   *
   * @default 7
   */
  recentSearchesLimit?: number;
  /**
   * Limit of how many recent searches that should be saved/displayed when there are favorited searches.
   *
   * @default 4
   */
  recentSearchesWithFavoritesLimit?: number;
}

export function DocSearch({ ...props }: DocSearchProps): JSX.Element {
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
            onAskAiToggle={onAskAiToggle}
            onClose={onClose}
          />,
          document.body,
        )}
    </>
  );
}
