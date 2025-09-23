/* eslint-disable react/react-in-jsx-scope */
import { DocSearch, useDocSearch } from '@docsearch/core';
import { DocSearchButton, DocSearchModal, useDocSearchKeyboardEvents } from '@docsearch/react';
import { useRef, type JSX } from 'react';
import { createPortal } from 'react-dom';

export default function Composable(): JSX.Element {
  return (
    <DocSearch appId="PMZUYBQDAK" apiKey="24b09689d5b4223813d9b8e48563c8f6">
      <Contents />
    </DocSearch>
  );
}

function Contents(): JSX.Element {
  const { setDocsearchState, docsearchState } = useDocSearch();
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const isOpen = docsearchState === 'modal-open';

  const onOpen = (): void => {
    setDocsearchState('modal-open');
  };

  const onClose = (): void => {
    setDocsearchState('ready');
  };

  const onAskAiToggle = (): void => {};

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    isAskAiActive: false,
    onAskAiToggle,
    searchButtonRef,
  });

  return (
    <>
      <DocSearchButton ref={searchButtonRef} translations={{ buttonText: 'Keyword search' }} onClick={onOpen} />
      {isOpen &&
        createPortal(
          <DocSearchModal
            indexName="docsearch"
            appId="PMZUYBQDAK"
            apiKey="24b09689d5b4223813d9b8e48563c8f6"
            initialScrollY={window.scrollY}
            onClose={onClose}
            onAskAiToggle={onAskAiToggle}
          />,
          document.body,
        )}
    </>
  );
}
