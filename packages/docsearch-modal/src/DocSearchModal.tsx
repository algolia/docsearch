import { useDocSearch } from '@docsearch/core';
import type { DocSearchModalProps as ModalProps } from '@docsearch/react/modal';
import { DocSearchModal as Modal } from '@docsearch/react/modal';
import type { JSX } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

export type DocSearchModalProps = Omit<ModalProps, 'initialScrollY' | 'isAskAiActive' | 'onAskAiToggle'>;

export function DocSearchModal(props: DocSearchModalProps): JSX.Element | null {
  const { isModalActive, onAskAiToggle, closeModal, isAskAiActive, initialQuery } = useDocSearch();

  return isModalActive
    ? createPortal(
        <Modal
          {...props}
          initialScrollY={window.scrollY}
          isAskAiActive={isAskAiActive}
          initialQuery={props.initialQuery ?? initialQuery}
          onAskAiToggle={onAskAiToggle}
          onClose={closeModal}
        />,
        props.portalContainer ?? document.body,
      )
    : null;
}
