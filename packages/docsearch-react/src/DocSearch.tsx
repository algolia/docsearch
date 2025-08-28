import type { AutocompleteOptions, AutocompleteState } from '@algolia/autocomplete-core';
import type { LiteClient, SearchParamsObject } from 'algoliasearch/lite';
import React, { type JSX } from 'react';
import { createPortal } from 'react-dom';

import { DocSearchButton } from './DocSearchButton';
import { DocSearchModal } from './DocSearchModal';
import type {
  DocSearchHit,
  DocSearchTheme,
  InternalDocSearchHit,
  KeyboardShortcuts,
  StoredDocSearchHit,
} from './types';
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

export interface DocSearchProps {
  appId: string;
  apiKey: string;
  indexName: string;
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
  keyboardShortcuts?: KeyboardShortcuts;
}

export function DocSearch({ ...props }: DocSearchProps): JSX.Element {
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [initialQuery, setInitialQuery] = React.useState<string | undefined>(props?.initialQuery || undefined);

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
    searchButtonRef,
    keyboardShortcuts: props.keyboardShortcuts,
  });
  useTheme({ theme: props.theme });

  return (
    <>
      <DocSearchButton
        ref={searchButtonRef}
        translations={props?.translations?.button}
        keyboardShortcuts={props.keyboardShortcuts}
        onClick={onOpen}
      />

      {isOpen &&
        createPortal(
          <DocSearchModal
            {...props}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            translations={props?.translations?.modal}
            onClose={onClose}
          />,
          document.body,
        )}
    </>
  );
}
