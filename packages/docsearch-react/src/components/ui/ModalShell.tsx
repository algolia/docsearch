import type { AutocompleteApi } from '@algolia/autocomplete-core';
import React, { type JSX } from 'react';

import type { DocSearchState, InternalDocSearchHit } from '../../types';

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
}: ModalShellProps): JSX.Element {
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
          <div className="DocSearch-Dropdown" ref={dropdownRef}>
            {screenState}
          </div>
        )}

        <footer className="DocSearch-Footer">{footer}</footer>
      </div>
    </div>
  );
}
