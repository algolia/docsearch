import { useDocSearch } from '@docsearch/core';
import type { DocSearchModalProps as ReactDocSearchModalProps } from '@docsearch/react';
import { DocSearchModal as Modal } from '@docsearch/react/modal';
import type { JSX } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

export type DocSearchModalProps = Omit<
  ReactDocSearchModalProps,
  | 'appId'
  | 'apiKey'
  | 'initialScrollY'
  | 'keyboardShortcuts'
  | 'onClose'
  | 'theme'
> &
  Partial<Pick<ReactDocSearchModalProps, 'appId' | 'apiKey'>>;

export function DocSearchModal(props: DocSearchModalProps): JSX.Element | null {
  const {
    appId: providerAppId,
    apiKey: providerApiKey,
    isModalActive,
    closeModal,
    initialQuery,
    registerView,
  } = useDocSearch();

  const appId = props.appId ?? providerAppId;
  const apiKey = props.apiKey ?? providerApiKey;

  if (!appId || !apiKey) {
    throw new Error(
      '`DocSearchModal` requires `appId` and `apiKey` props or values configured on the `DocSearch` provider.'
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

  const modalProps: ReactDocSearchModalProps = React.useMemo(
    () => ({
      ...props,
      appId,
      apiKey,
      initialQuery: props.initialQuery ?? initialQuery,
      initialScrollY: initialScroll,
      onClose: closeModal,
    }),
    [props, appId, apiKey, initialQuery, initialScroll, closeModal]
  );

  return isModalActive
    ? createPortal(<Modal {...modalProps} />, containerElement)
    : null;
}
