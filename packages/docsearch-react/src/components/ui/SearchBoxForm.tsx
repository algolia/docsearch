import type { AutocompleteApi, AutocompleteState } from '@algolia/autocomplete-core';
import React, { type JSX, type RefObject } from 'react';

import { MAX_QUERY_SIZE } from '../../constants';
import { CloseIcon, LoadingIcon, SearchIcon } from '../../icons';
import type { InternalDocSearchHit } from '../../types';

interface SearchBoxFormProps
  extends AutocompleteApi<InternalDocSearchHit, React.FormEvent, React.MouseEvent, React.KeyboardEvent> {
  state: AutocompleteState<InternalDocSearchHit>;
  autoFocus: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  isFromSelection: boolean;
  placeholder: string;
  onClose: () => void;
  clearButtonTitle: string;
  clearButtonAriaLabel: string;
  closeButtonText: string;
  closeButtonAriaLabel: string;
  searchInputLabel: string;
  inputProps?: Partial<React.InputHTMLAttributes<HTMLInputElement>>;
  leadingElement?: React.ReactNode;
  inputOverlay?: React.ReactNode;
  actionsBeforeClose?: React.ReactNode;
  hideInput?: boolean;
}

export function SearchBoxForm({
  actionsBeforeClose,
  autoFocus,
  clearButtonAriaLabel,
  clearButtonTitle,
  closeButtonAriaLabel,
  closeButtonText,
  hideInput,
  inputOverlay,
  inputProps,
  inputRef,
  isFromSelection,
  leadingElement,
  onClose,
  placeholder,
  searchInputLabel,
  state,
  ...autocomplete
}: SearchBoxFormProps): JSX.Element {
  const { onReset } = autocomplete.getFormProps({
    inputElement: inputRef.current,
  });

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef]);

  React.useEffect(() => {
    if (isFromSelection && inputRef.current) {
      inputRef.current.select();
    }
  }, [isFromSelection, inputRef]);

  const baseInputProps = autocomplete.getInputProps({
    inputElement: inputRef.current!,
    autoFocus,
    maxLength: MAX_QUERY_SIZE,
  });

  const isKeywordSearchLoading = state.status === 'stalled';

  return (
    <form
      className="DocSearch-Form"
      onSubmit={(event) => {
        event.preventDefault();
      }}
      onReset={onReset}
    >
      {leadingElement ||
        (isKeywordSearchLoading ? (
          <div className="DocSearch-LoadingIndicator">
            <LoadingIcon />
          </div>
        ) : (
          <label className="DocSearch-MagnifierLabel" {...autocomplete.getLabelProps()}>
            <SearchIcon />
            <span className="DocSearch-VisuallyHiddenForAccessibility">{searchInputLabel}</span>
          </label>
        ))}

      {inputOverlay}

      <input
        className="DocSearch-Input"
        ref={inputRef}
        {...baseInputProps}
        {...inputProps}
        placeholder={placeholder}
        hidden={hideInput}
      />

      <div className="DocSearch-Actions">
        {actionsBeforeClose}

        <button
          type="button"
          title={closeButtonText}
          className="DocSearch-Action DocSearch-Close"
          aria-label={closeButtonAriaLabel}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>
    </form>
  );
}
