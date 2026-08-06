import { useDocSearch } from '@docsearch/core';
import {
  Sidepanel as SidepanelComp,
  type DocSearchSidepanelProps,
  type SidepanelSearchParameters,
} from '@docsearch/react/sidepanel';
import React from 'react';
import type { JSX } from 'react';
import { createPortal } from 'react-dom';

export type SidepanelProps = DocSearchSidepanelProps['panel'] &
  Omit<
    DocSearchSidepanelProps,
    'appId' | 'apiKey' | 'button' | 'panel' | 'theme'
  > &
  Partial<Pick<DocSearchSidepanelProps, 'appId' | 'apiKey'>> &
  SidepanelSearchParameters;

export function Sidepanel({
  portalContainer,
  ...props
}: SidepanelProps): JSX.Element {
  const {
    appId: providerAppId,
    apiKey: providerApiKey,
    docsearchState,
    setDocsearchState,
    keyboardShortcuts,
    registerView,
    initialAskAiMessage,
  } = useDocSearch();

  const appId = props.appId ?? providerAppId;
  const apiKey = props.apiKey ?? providerApiKey;

  if (!appId || !apiKey) {
    throw new Error(
      '`Sidepanel` requires `appId` and `apiKey` props or values configured on the `DocSearch` provider.'
    );
  }

  const handleOpen = React.useCallback((): void => {
    setDocsearchState('sidepanel');
  }, [setDocsearchState]);

  const handleClose = React.useCallback((): void => {
    setDocsearchState('ready');
  }, [setDocsearchState]);

  const containerElement = React.useMemo(
    () => portalContainer ?? document.body,
    [portalContainer]
  );

  React.useEffect(() => {
    registerView('sidepanel');
  }, [registerView]);

  const sidepanelProps = React.useMemo(
    () => ({
      isOpen: docsearchState === 'sidepanel',
      onOpen: handleOpen,
      onClose: handleClose,
      keyboardShortcuts,
      initialMessage: initialAskAiMessage,
      ...props,
      appId,
      apiKey,
    }),
    [
      docsearchState,
      handleOpen,
      handleClose,
      props,
      appId,
      apiKey,
      keyboardShortcuts,
      initialAskAiMessage,
    ]
  );

  return createPortal(<SidepanelComp {...sidepanelProps} />, containerElement);
}
