import type {
  AutocompleteApi,
  AutocompleteState,
} from '@algolia/autocomplete-core';
import React, { type JSX, type RefObject } from 'react';

import type { InternalDocSearchHit } from '../types';

import { SearchBoxForm } from './ui/SearchBoxForm';

export type KeywordSearchBoxTranslations = Partial<{
  clearButtonTitle: string;
  clearButtonAriaLabel: string;
  closeButtonText: string;
  closeButtonAriaLabel: string;
  placeholderText: string;
  enterKeyHint: string;
  searchInputLabel: string;
}>;

interface KeywordSearchBoxProps extends AutocompleteApi<
  InternalDocSearchHit,
  React.FormEvent,
  React.MouseEvent,
  React.KeyboardEvent
> {
  state: AutocompleteState<InternalDocSearchHit>;
  autoFocus: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
  placeholder: string;
  isFromSelection: boolean;
  translations?: KeywordSearchBoxTranslations;
}

export function KeywordSearchBox({
  translations = {},
  ...props
}: KeywordSearchBoxProps): JSX.Element {
  const {
    clearButtonTitle = 'Clear',
    clearButtonAriaLabel = 'Clear the query',
    closeButtonText = 'Close',
    closeButtonAriaLabel = 'Close',
    searchInputLabel = 'Search',
  } = translations;

  const actionsBeforeClose = (
    <>
      <button
        className="DocSearch-Clear"
        type="reset"
        aria-label={clearButtonAriaLabel}
        hidden={!props.state.query}
        tabIndex={props.state.query ? 0 : -1}
        aria-hidden={!props.state.query ? 'true' : 'false'}
      >
        {clearButtonTitle}
      </button>

      {props.state.query && <div className="DocSearch-Divider" />}
    </>
  );

  return (
    <SearchBoxForm
      {...props}
      clearButtonTitle={clearButtonTitle}
      clearButtonAriaLabel={clearButtonAriaLabel}
      closeButtonText={closeButtonText}
      closeButtonAriaLabel={closeButtonAriaLabel}
      searchInputLabel={searchInputLabel}
      inputProps={{
        enterKeyHint: 'search',
      }}
      actionsBeforeClose={actionsBeforeClose}
    />
  );
}
