/* eslint-disable react/react-in-jsx-scope */
import { DocSearch, useDocSearch } from '@docsearch/core';
import { DocSearchButton } from '@docsearch/modal';
import { DocSearchModal } from '@docsearch/react';
import { type JSX } from 'react';
import { createPortal } from 'react-dom';

export default function Composable(): JSX.Element {
  return (
    <DocSearch appId="PMZUYBQDAK" apiKey="24b09689d5b4223813d9b8e48563c8f6">
      <DocSearchButton translations={{ buttonText: 'Composable API' }} />
      <Contents />
    </DocSearch>
  );
}

function Contents(): JSX.Element {
  const { setDocsearchState, docsearchState } = useDocSearch();

  const isOpen = docsearchState === 'modal-open';

  const onClose = (): void => {
    setDocsearchState('ready');
  };

  const onAskAiToggle = (): void => {};

  return (
    <>
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
