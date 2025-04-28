import type { AutocompleteState, AutocompleteOptions } from '@algolia/autocomplete-core';
import type { LiteClient, SearchParamsObject } from 'algoliasearch/lite';
import React, { type JSX } from 'react';
import { createPortal } from 'react-dom';

import { DocSearchButton } from './DocSearchButton';
import { DocSearchModal } from './DocSearchModal';
import type { DocSearchHit, InternalDocSearchHit, StoredDocSearchHit } from './types';
import { useDocSearchKeyboardEvents } from './useDocSearchKeyboardEvents';

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

export interface DocSearchProps {
  appId: string;
  apiKey: string;
  indexName: string;
  datasourceId?: string;
  promptId?: string;
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
}

export function DocSearch(props: DocSearchProps): JSX.Element {
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [initialQuery, setInitialQuery] = React.useState<string | undefined>(props?.initialQuery || undefined);
  const [isAskAiActive, setIsAskAiActive] = React.useState(false);

  // check if the instance is configured to handle ask ai
  const canHandleAskAi = Boolean(props?.datasourceId && props?.promptId);

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
  }, [setIsOpen, props.initialQuery]);

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

  return (
    <>
      <DocSearchButton ref={searchButtonRef} translations={props?.translations?.button} onClick={onOpen} />

      {isOpen &&
        createPortal(
          <DocSearchModal
            {...props}
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
