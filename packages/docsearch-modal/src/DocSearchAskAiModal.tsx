import { useDocSearch } from '@docsearch/core';
import type { DocSearchAskAiModalProps as ReactDocSearchAskAiModalProps } from '@docsearch/react/askaiModal';
import { DocSearchAskAiModal as Modal } from '@docsearch/react/askaiModal';
import type { JSX } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

export type DocSearchAskAiModalProps = Omit<
  ReactDocSearchAskAiModalProps,
  | 'appId'
  | 'apiKey'
  | 'initialScrollY'
  | 'isAskAiActive'
  | 'isHybridModeSupported'
  | 'keyboardShortcuts'
  | 'onAskAiToggle'
  | 'onClose'
  | 'theme'
> &
  Partial<Pick<ReactDocSearchAskAiModalProps, 'appId' | 'apiKey'>>;

export function DocSearchAskAiModal(
  props: DocSearchAskAiModalProps
): JSX.Element | null {
  const {
    appId: providerAppId,
    apiKey: providerApiKey,
    isModalActive,
    onAskAiToggle,
    closeModal,
    isAskAiActive,
    initialQuery,
    registerView,
    isHybridModeSupported,
  } = useDocSearch();

  const appId = props.appId ?? providerAppId;
  const apiKey = props.apiKey ?? providerApiKey;

  if (!appId || !apiKey) {
    throw new Error(
      '`DocSearchAskAiModal` requires `appId` and `apiKey` props or values configured on the `DocSearch` provider.'
    );
  }

  const containerElement = React.useMemo(
    () => props.portalContainer ?? document.body,
    [props.portalContainer]
  );

  const initialScroll = React.useMemo(() => window.scrollY, []);

  React.useEffect(() => {
    registerView('modal');
  }, [registerView]);

  const modalProps: ReactDocSearchAskAiModalProps = React.useMemo(
    () => ({
      ...props,
      appId,
      apiKey,
      isAskAiActive,
      initialQuery: props.initialQuery ?? initialQuery,
      initialScrollY: initialScroll,
      onAskAiToggle,
      onClose: closeModal,
      isHybridModeSupported,
    }),
    [
      props,
      appId,
      apiKey,
      isAskAiActive,
      initialQuery,
      initialScroll,
      onAskAiToggle,
      closeModal,
      isHybridModeSupported,
    ]
  );

  return isModalActive
    ? createPortal(<Modal {...modalProps} />, containerElement)
    : null;
}
