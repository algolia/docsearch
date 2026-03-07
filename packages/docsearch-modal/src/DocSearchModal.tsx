import { useDocSearch } from '@docsearch/core';
import type { DocSearchModalProps as ReactDocSearchModalProps } from '@docsearch/react';
import { DocSearchModal as Modal } from '@docsearch/react/modal';
import type { JSX } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

export type DocSearchModalProps = Omit<
  ReactDocSearchModalProps,
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

  const modalProps: ReactDocSearchModalProps = React.useMemo(
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
