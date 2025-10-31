import { useDocSearch } from '@docsearch/core';
import { Sidepanel as SidepanelComp, type DocSearchSidepanelProps } from '@docsearch/react/sidepanel';
import React from 'react';
import type { JSX } from 'react';
import { createPortal } from 'react-dom';

export type SidepanelProps = DocSearchSidepanelProps['panel'] & Omit<DocSearchSidepanelProps, 'button' | 'panel'>;

export function Sidepanel({ portalContainer, ...props }: SidepanelProps): JSX.Element {
  const { docsearchState, setDocsearchState, keyboardShortcuts } = useDocSearch();

  const handleOpen = React.useCallback((): void => {
    setDocsearchState('sidepanel');
  }, [setDocsearchState]);

  const handleClose = React.useCallback((): void => {
    setDocsearchState('ready');
  }, [setDocsearchState]);

  const containerElement = React.useMemo(() => portalContainer ?? document.body, [portalContainer]);

  const sidepanelProps = React.useMemo(
    () => ({
      isOpen: docsearchState === 'sidepanel',
      onOpen: handleOpen,
      onClose: handleClose,
      keyboardShortcuts,
      ...props,
    }),
    [docsearchState, handleOpen, handleClose, props, keyboardShortcuts],
  );

  return createPortal(<SidepanelComp {...sidepanelProps} />, containerElement);
}
