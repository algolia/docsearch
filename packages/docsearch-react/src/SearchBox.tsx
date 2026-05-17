import type { AutocompleteApi, AutocompleteState } from '@algolia/autocomplete-core';
import React, { type JSX, type RefObject } from 'react';

import { MAX_QUERY_SIZE } from './constants';
import { LoadingIcon, CloseIcon, SearchIcon } from './icons';
import type { InternalDocSearchHit } from './types';

export type SearchBoxTranslations = Partial<{
  clearButtonTitle: string;
  clearButtonAriaLabel: string;
  closeButtonText: string;
  closeButtonAriaLabel: string;
  placeholderText: string;
  enterKeyHint: string;
  searchInputLabel: string;
}>;

interface SearchBoxProps
  extends AutocompleteApi<InternalDocSearchHit, React.FormEvent, React.MouseEvent, React.KeyboardEvent> {
  state: AutocompleteState<InternalDocSearchHit>;
  autoFocus: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
  placeholder: string;
  isFromSelection: boolean;
  translations?: SearchBoxTranslations;
}

export function SearchBox({ translations = {}, ...props }: SearchBoxProps): JSX.Element {
  const {
    clearButtonTitle = 'Clear',
    clearButtonAriaLabel = 'Clear the query',
    closeButtonText = 'Close',
    closeButtonAriaLabel = 'Close',
    searchInputLabel = 'Search',
  } = translations;
  const { onReset } = props.getFormProps({
    inputElement: props.inputRef.current,
  });

  React.useEffect(() => {
    if (props.autoFocus && props.inputRef.current) {
      props.inputRef.current.focus();
    }
  }, [props.autoFocus, props.inputRef]);

  React.useEffect(() => {
    if (props.isFromSelection && props.inputRef.current) {
      props.inputRef.current.select();
    }
  }, [props.isFromSelection, props.inputRef]);

  const baseInputProps = props.getInputProps({
    inputElement: props.inputRef.current!,
    autoFocus: props.autoFocus,
    maxLength: MAX_QUERY_SIZE,
  });

  const isKeywordSearchLoading = props.state.status === 'stalled';

  const inputProps = {
    ...baseInputProps,
    enterKeyHint: 'search' as const,
  };

  return (
    <>
      <form
        className="DocSearch-Form"
        onSubmit={(event) => {
          event.preventDefault();
        }}
        onReset={onReset}
      >
        {isKeywordSearchLoading && (
          <div className="DocSearch-LoadingIndicator">
            <LoadingIcon />
          </div>
        )}
        {!isKeywordSearchLoading && (
          <label className="DocSearch-MagnifierLabel" {...props.getLabelProps()}>
            <SearchIcon />
            <span className="DocSearch-VisuallyHiddenForAccessibility">{searchInputLabel}</span>
          </label>
        )}

        <input className="DocSearch-Input" ref={props.inputRef} {...inputProps} placeholder={props.placeholder} />

        <div className="DocSearch-Actions">
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

          <button
            type="button"
            title={closeButtonText}
            className="DocSearch-Action DocSearch-Close"
            aria-label={closeButtonAriaLabel}
            onClick={props.onClose}
          >
            <CloseIcon />
          </button>
        </div>
      </form>
    </>
  );
}
