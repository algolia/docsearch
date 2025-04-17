import type { AutocompleteApi, AutocompleteState } from '@algolia/autocomplete-core';
import React, { type JSX, type RefObject } from 'react';

import { MAX_QUERY_SIZE } from './constants';
import { LoadingIcon, CloseIcon, SearchIcon } from './icons';
import { BackIcon } from './icons/BackIcon';
import type { InternalDocSearchHit } from './types';

export type SearchBoxTranslations = Partial<{
  clearButtonTitle: string;
  clearButtonAriaLabel: string;
  closeButtonText: string;
  closeButtonAriaLabel: string;
  searchInputLabel: string;
  backToKeywordSearchButtonText: string;
  backToKeywordSearchButtonAriaLabel: string;
}>;

interface SearchBoxProps
  extends AutocompleteApi<InternalDocSearchHit, React.FormEvent, React.MouseEvent, React.KeyboardEvent> {
  state: AutocompleteState<InternalDocSearchHit>;
  autoFocus: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onAskAiToggle: (toggle: boolean) => void;
  isAskAiActive: boolean;
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
    backToKeywordSearchButtonText = 'Back to keyword search',
    backToKeywordSearchButtonAriaLabel = 'Back to keyword search',
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

  return (
    <>
      <form
        className="DocSearch-Form"
        onSubmit={(event) => {
          event.preventDefault();
        }}
        onReset={onReset}
      >
        {props.isAskAiActive ? (
          <button
            type="button"
            tabIndex={0}
            className="DocSearch-AskAi-Return"
            title={backToKeywordSearchButtonText}
            aria-label={backToKeywordSearchButtonAriaLabel}
            onClick={() => props.onAskAiToggle(false)}
          >
            <BackIcon />
          </button>
        ) : (
          <label className="DocSearch-MagnifierLabel" {...props.getLabelProps()}>
            <SearchIcon />
            <span className="DocSearch-VisuallyHiddenForAccessibility">{searchInputLabel}</span>
          </label>
        )}

        <div className="DocSearch-LoadingIndicator">
          <LoadingIcon />
        </div>

        <input
          className="DocSearch-Input"
          ref={props.inputRef}
          {...props.getInputProps({
            inputElement: props.inputRef.current!,
            autoFocus: props.autoFocus,
            maxLength: MAX_QUERY_SIZE,
          })}
        />

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

          <div className="DocSearch-Divider" />

          <button
            type="button"
            title={closeButtonText}
            className="DocSearch-Close"
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
