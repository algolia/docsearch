import { DocSearch as DocSearchProvider, useDocSearch } from '@docsearch/core';
import React from 'react';
import type { JSX } from 'react';
import { createPortal } from 'react-dom';

import type { DocSearchProps } from './DocSearch';
import { DocSearchButton } from './DocSearchButton';
import { KeywordModal } from './KeywordModal';

export function DocSearchKeyword(props: DocSearchProps): JSX.Element {
  return (
    <DocSearchProvider {...props}>
      <KeywordOnly {...props} />
    </DocSearchProvider>
  );
}

function KeywordOnly(props: DocSearchProps): JSX.Element {
  const { searchButtonRef, keyboardShortcuts, openModal, isModalActive, closeModal, initialQuery } = useDocSearch();

  return (
    <>
      <DocSearchButton keyboardShortcuts={keyboardShortcuts} ref={searchButtonRef} onClick={openModal} />
      {isModalActive &&
        createPortal(
          <KeywordModal
            {...props}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            translations={props?.translations?.modal}
            onClose={closeModal}
          />,
          props.portalContainer ?? document.body,
        )}
    </>
  );
}
