import { useDocSearch } from '@docsearch/core';
import { DocSearchAskAiModal as Modal } from '@docsearch/react/askai';
import type { DocSearchAskAiModalProps as ReactDocSearchAskAiModalProps } from '@docsearch/react/DocSearchAskAiModal';
import type { JSX } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

export type DocSearchAskAiModalProps = Omit<
  ReactDocSearchAskAiModalProps,
  | 'initialScrollY'
  | 'isAskAiActive'
  | 'isHybridModeSupported'
  | 'keyboardShortcuts'
  | 'onAskAiToggle'
  | 'onClose'
  | 'theme'
>;

export function DocSearchAskAiModal(props: DocSearchAskAiModalProps): JSX.Element | null {
  const { isModalActive, onAskAiToggle, closeModal, isAskAiActive, initialQuery, registerView, isHybridModeSupported } =
    useDocSearch();

  const containerElement = React.useMemo(() => props.portalContainer ?? document.body, [props.portalContainer]);

  const initialScroll = React.useMemo(() => window.scrollY, []);

  React.useEffect(() => {
    registerView('modal');
  }, [registerView]);

  const modalProps: ReactDocSearchAskAiModalProps = React.useMemo(
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
