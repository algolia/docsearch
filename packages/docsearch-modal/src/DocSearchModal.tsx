import { useDocSearch } from '@docsearch/core';
import type { DocSearchModalProps as ReactDocSearchModalProps } from '@docsearch/react';
import { DocSearchModal as Modal } from '@docsearch/react/modal';
import type { JSX } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

export type DocSearchModalProps = Omit<
  ReactDocSearchModalProps,
  'initialScrollY' | 'keyboardShortcuts' | 'onClose' | 'theme'
>;

export function DocSearchModal(props: DocSearchModalProps): JSX.Element | null {
  const { isModalActive, closeModal, initialQuery, registerView } = useDocSearch();

  const containerElement = React.useMemo(() => props.portalContainer ?? document.body, [props.portalContainer]);

  const initialScroll = React.useMemo(() => window.scrollY, []);

  React.useEffect(() => {
    registerView('modal');
  }, [registerView]);

  const modalProps: ReactDocSearchModalProps = React.useMemo(
    () => ({
      ...props,
      initialQuery: props.initialQuery ?? initialQuery,
      initialScrollY: initialScroll,
      onClose: closeModal,
    }),
    [props, initialQuery, initialScroll, closeModal],
  );

  return isModalActive ? createPortal(<Modal {...modalProps} />, containerElement) : null;
}
