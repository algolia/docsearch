import { useDocSearch } from '@docsearch/core';
import type { DocSearchModalProps as ModalProps } from '@docsearch/react/modal';
import { DocSearchModal as Modal } from '@docsearch/react/modal';
import type { JSX } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

export type DocSearchModalProps = Omit<
  ModalProps,
  | 'initialScrollY'
  | 'isAskAiActive'
  | 'isHybridModeSupported'
  | 'keyboardShortcuts'
  | 'onAskAiToggle'
  | 'onClose'
  | 'theme'
>;

export function DocSearchModal(props: DocSearchModalProps): JSX.Element | null {
  const { isModalActive, onAskAiToggle, closeModal, isAskAiActive, initialQuery, registerView, isHybridModeSupported } =
    useDocSearch();

  const containerElement = React.useMemo(() => props.portalContainer ?? document.body, [props.portalContainer]);

  const initialScroll = React.useMemo(() => window.scrollY, []);

  React.useEffect(() => {
    registerView('modal');
  }, [registerView]);

  const modalProps: ModalProps = React.useMemo(
    () => ({
      ...props,
      isAskAiActive,
      initialQuery: props.initialQuery ?? initialQuery,
      initialScrollY: initialScroll,
      onAskAiToggle,
      onClose: closeModal,
      isHybridModeSupported,
    }),
    [props, isAskAiActive, initialQuery, initialScroll, onAskAiToggle, closeModal, isHybridModeSupported],
  );

  return isModalActive ? createPortal(<Modal {...modalProps} />, containerElement) : null;
}
