import type {
  AutocompleteApi,
  AutocompleteState,
} from '@algolia/autocomplete-core';
import type { MutableRefObject } from 'react';
import React from 'react';

import { MAX_QUERY_SIZE } from './constants';
import { LoadingIcon } from './icons/LoadingIcon';
import { ResetIcon } from './icons/ResetIcon';
import { SearchIcon } from './icons/SearchIcon';
import type { InternalDocSearchHit } from './types';

export type SearchBoxTranslations = Partial<{
  resetButtonTitle: string;
  resetButtonAriaLabel: string;
  cancelButtonText: string;
  cancelButtonAriaLabel: string;
}>;

interface SearchBoxProps
  extends AutocompleteApi<
    InternalDocSearchHit,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<InternalDocSearchHit>;
  autoFocus: boolean;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  onClose: () => void;
  isFromSelection: boolean;
  translations?: SearchBoxTranslations;
}

export function SearchBox({ translations = {}, ...props }: SearchBoxProps) {
  const {
    resetButtonTitle = 'Clear the query',
    resetButtonAriaLabel = 'Clear the query',
    cancelButtonText = 'Cancel',
    cancelButtonAriaLabel = 'Cancel',
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
        <label className="DocSearch-MagnifierLabel" {...props.getLabelProps()}>
          <SearchIcon />
        </label>

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

        <button
          type="reset"
          title={resetButtonTitle}
          className="DocSearch-Reset"
          aria-label={resetButtonAriaLabel}
          hidden={!props.state.query}
        >
          <ResetIcon />
        </button>
      </form>

      <button
        className="DocSearch-Cancel"
        type="reset"
        aria-label={cancelButtonAriaLabel}
        onClick={props.onClose}
      >
        {cancelButtonText}
      </button>
    </>
  );
}
