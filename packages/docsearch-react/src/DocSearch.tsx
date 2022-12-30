import type {
  AutocompleteState,
  AutocompleteOptions,
} from '@algolia/autocomplete-core';
import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch/lite';
import React from 'react';
import { createPortal } from 'react-dom';

import { DocSearchButton } from './DocSearchButton';
import { DocSearchModal } from './DocSearchModal';
import type {
  DocSearchHit,
  InternalDocSearchHit,
  StoredDocSearchHit,
} from './types';
import { useDocSearchKeyboardEvents } from './useDocSearchKeyboardEvents';

import type { ButtonTranslations, ModalTranslations } from '.';

export type DocSearchTranslations = Partial<{
  button: ButtonTranslations;
  modal: ModalTranslations;
}>;

export interface DocSearchProps {
  appId: string;
  apiKey: string;
  indexName: string;
  placeholder?: string;
  searchParameters?: SearchOptions;
  transformItems?: (items: DocSearchHit[]) => DocSearchHit[];
  hitComponent?: (props: {
    hit: InternalDocSearchHit | StoredDocSearchHit;
    children: React.ReactNode;
  }) => JSX.Element;
  resultsFooterComponent?: (props: {
    state: AutocompleteState<InternalDocSearchHit>;
  }) => JSX.Element | null;
  transformSearchClient?: (searchClient: SearchClient) => SearchClient;
  disableUserPersonalization?: boolean;
  initialQuery?: string;
  navigator?: AutocompleteOptions<InternalDocSearchHit>['navigator'];
  translations?: DocSearchTranslations;
  getMissingResultsUrl?: ({ query }: { query: string }) => string;
}

export function DocSearch(props: DocSearchProps) {
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const activeElementRef = React.useRef<Element>(document.body);
  const [isOpen, setIsOpen] = React.useState(false);
  const [initialQuery, setInitialQuery] = React.useState<string | undefined>(
    props?.initialQuery || undefined
  );

  const onOpen = React.useCallback(() => {
    setIsOpen(true);
    activeElementRef.current = document.activeElement || document.body;
  }, [setIsOpen]);

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  React.useEffect(() => {
    if (
      !isOpen &&
      activeElementRef.current &&
      activeElementRef.current instanceof HTMLElement
    ) {
      activeElementRef.current.focus();
    }
  }, [isOpen]);

  const onInput = React.useCallback(
    (event: KeyboardEvent) => {
      setIsOpen(true);
      setInitialQuery(event.key);
    },
    [setIsOpen, setInitialQuery]
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  });

  return (
    <>
      <DocSearchButton
        ref={searchButtonRef}
        translations={props?.translations?.button}
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
          document.body
        )}
    </>
  );
}
