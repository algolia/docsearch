import { DocSearch, useDocSearch } from '@docsearch/core';
import type { DocSearchTheme, SidepanelShortcuts } from '@docsearch/core';
import type { JSX } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

import type { AskAiSearchParameters } from './DocSearch';
import type { SidepanelButtonProps, SidepanelProps } from './Sidepanel/index';
import { SidepanelButton, Sidepanel } from './Sidepanel/index';

export type DocSearchSidepanelProps = {
  /**
   * The assistant ID to use for the ask AI feature.
   */
  assistantId: string;
  /**
   * Public api key with search permissions for the index.
   */
  apiKey: string;
  /**
   * Algolia application id used by the search client.
   */
  appId: string;
  /**
   * The index name to use for the ask AI feature. Your assistant will search this index for relevant documents.
   */
  indexName: string;
  /**
   * The search parameters to use for the ask AI feature.
   */
  searchParameters?: AskAiSearchParameters;
  /**
   * Configuration for keyboard shortcuts. Allows enabling/disabling specific shortcuts.
   *
   * @default `{ 'Ctrl/Cmd+I': true }`
   */
  keyboardShortcuts?: SidepanelShortcuts;
  /**
   * Theme overrides applied to the Sidepanel button and panel.
   *
   * @default 'light'
   */
  theme?: DocSearchTheme;
  /**
   * Props specific to the Sidepanel button.
   */
  button?: Omit<SidepanelButtonProps, 'keyboardShortcuts'>;
  /**
   * Props specific to the Sidepanel panel.
   */
  panel?: Omit<SidepanelProps, 'keyboardShortcuts'>;
};

export function DocSearchSidepanel({ keyboardShortcuts, theme, ...props }: DocSearchSidepanelProps): JSX.Element {
  return (
    <DocSearch keyboardShortcuts={keyboardShortcuts} theme={theme}>
      <DocSearchSidepanelComp {...props} />
    </DocSearch>
  );
}

function DocSearchSidepanelComp({
  button: buttonProps = {},
  panel: { portalContainer, ...panelProps } = {},
  ...rootProps
}: DocSearchSidepanelProps): JSX.Element {
  const { docsearchState, setDocsearchState, keyboardShortcuts, registerView } = useDocSearch();

  const toggleSidepanelState = React.useCallback(() => {
    setDocsearchState(docsearchState === 'sidepanel' ? 'ready' : 'sidepanel');
  }, [docsearchState, setDocsearchState]);

  const handleClose = (): void => {
    setDocsearchState('ready');
  };

  const handleOpen = (): void => {
    setDocsearchState('sidepanel');
  };

  const containerElement = React.useMemo(() => portalContainer ?? document.body, [portalContainer]);

  React.useEffect(() => {
    registerView('sidepanel');
  }, [registerView]);

  const ButtonComp = React.useMemo(
    () => <SidepanelButton keyboardShortcuts={keyboardShortcuts} onClick={toggleSidepanelState} {...buttonProps} />,
    [keyboardShortcuts, toggleSidepanelState, buttonProps],
  );

  return (
    <>
      {buttonProps.variant === 'inline' ? ButtonComp : createPortal(ButtonComp, containerElement)}
      {createPortal(
        <Sidepanel
          isOpen={docsearchState === 'sidepanel'}
          onClose={handleClose}
          onOpen={handleOpen}
          {...rootProps}
          {...panelProps}
          keyboardShortcuts={keyboardShortcuts}
        />,
        containerElement,
      )}
    </>
  );
}

export * from './Sidepanel/index';
