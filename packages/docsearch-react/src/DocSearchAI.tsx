import { DocSearch as DocSearchProvider, useDocSearch } from '@docsearch/core';
import type { DocSearchRef } from '@docsearch/core';
import React, { type JSX } from 'react';
import { createPortal } from 'react-dom';

import type { DocSearchAIProps } from './DocSearch';
import { DocSearchAskAiModal } from './DocSearchAskAiModal';
import { DocSearchButton } from './DocSearchButton';

function DocSearchAIComponent(props: DocSearchAIProps, ref: React.ForwardedRef<DocSearchRef>): JSX.Element {
  return (
    <DocSearchProvider {...props} ref={ref}>
      <DocSearchAIInner {...props} />
    </DocSearchProvider>
  );
}

export const DocSearchAI = React.forwardRef(DocSearchAIComponent);

export function DocSearchAIInner(props: DocSearchAIProps): JSX.Element {
  const {
    searchButtonRef,
    keyboardShortcuts,
    isModalActive,
    isAskAiActive,
    initialQuery,
    onAskAiToggle,
    openModal,
    closeModal,
    isHybridModeSupported,
  } = useDocSearch();

  return (
    <>
      <DocSearchButton
        keyboardShortcuts={keyboardShortcuts}
        ref={searchButtonRef}
        translations={props.translations?.button}
        onClick={openModal}
      />
      {isModalActive &&
        createPortal(
          <DocSearchAskAiModal
            {...props}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            translations={props?.translations?.modal}
            isAskAiActive={isAskAiActive}
            isHybridModeSupported={isHybridModeSupported}
            onAskAiToggle={onAskAiToggle}
            onClose={closeModal}
          />,
          props.portalContainer ?? document.body,
        )}
    </>
  );
}
