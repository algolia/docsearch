import type { AutocompleteApi } from '@algolia/autocomplete-core';
import React, { type JSX } from 'react';

import type { DocSearchState, InternalDocSearchHit } from '../../types';

const EDITABLE_ELEMENTS_SELECTOR = 'input, select, textarea, [contenteditable]';

// Pressing a part of the results panel or the footer that can't take focus
// (the panel's scrollbar, a group title, the footer text) moves focus to the
// container, and the arrow keys only work while the search input is focused.
// This mirrors autocomplete's `getPanelProps().onMouseDown`, without the
// `onMouseLeave` handler that resets the active item.
const KEEP_INPUT_FOCUS_PROPS = {
  onMouseDown(event: React.MouseEvent<HTMLElement>): void {
    if (
      event.button !== 0 ||
      (event.target as HTMLElement).closest(EDITABLE_ELEMENTS_SELECTOR)
    ) {
      return;
    }

    event.preventDefault();
  },
};

export type ModalShellProps = {
  state: DocSearchState<InternalDocSearchHit>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  modalRef: React.RefObject<HTMLDivElement | null>;
  formElementRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  getRootProps: AutocompleteApi<
    InternalDocSearchHit,
    React.FormEvent<HTMLFormElement>,
    React.MouseEvent,
    React.KeyboardEvent
  >['getRootProps'];
  onClose: () => void;
  showDropdown: boolean;
  searchBox: React.ReactNode;
  filterBar?: React.ReactNode;
  screenState: React.ReactNode;
  footer: React.ReactNode;
  keepInputFocus?: boolean;
};

export function ModalShell({
  state,
  containerRef,
  modalRef,
  formElementRef,
  dropdownRef,
  getRootProps,
  onClose,
  showDropdown,
  searchBox,
  filterBar,
  screenState,
  footer,
  keepInputFocus = false,
}: ModalShellProps): JSX.Element {
  const keepInputFocusProps = keepInputFocus
    ? KEEP_INPUT_FOCUS_PROPS
    : undefined;

  return (
    <div
      ref={containerRef}
      {...getRootProps({ 'aria-expanded': true })}
      className={[
        'DocSearch',
        'DocSearch-Container',
        state.status === 'stalled' && 'DocSearch-Container--Stalled',
        state.status === 'error' && 'DocSearch-Container--Errored',
      ]
        .filter(Boolean)
        .join(' ')}
      role="button"
      tabIndex={0}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="DocSearch-Modal" ref={modalRef}>
        <header className="DocSearch-SearchBar" ref={formElementRef}>
          {searchBox}
        </header>

        {filterBar}

        {showDropdown && (
          <div
            className="DocSearch-Dropdown"
            ref={dropdownRef}
            {...keepInputFocusProps}
          >
            {screenState}
          </div>
        )}

        <footer className="DocSearch-Footer" {...keepInputFocusProps}>
          {footer}
        </footer>
      </div>
    </div>
  );
}
