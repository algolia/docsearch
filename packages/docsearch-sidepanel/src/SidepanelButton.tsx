import { useDocSearch } from '@docsearch/core';
import type { SidepanelButtonProps as ButtonProps } from '@docsearch/react/sidepanel';
import { SidepanelButton as Button } from '@docsearch/react/sidepanel';
import React from 'react';
import type { JSX } from 'react';
import { createPortal } from 'react-dom';

export type SidepanelButtonProps = ButtonProps & {
  portalcontainer?: DocumentFragment | Element | null;
};

export function SidepanelButton({ portalcontainer, ...props }: SidepanelButtonProps): JSX.Element {
  const { setDocsearchState, keyboardShortcuts, docsearchState } = useDocSearch();

  const toggleSidepanelState = React.useCallback(() => {
    const nextState = docsearchState === 'sidepanel' ? 'ready' : 'sidepanel';
    setDocsearchState(nextState);
  }, [docsearchState, setDocsearchState]);

  const containerElement = React.useMemo(() => portalcontainer ?? document.body, [portalcontainer]);

  const ButtonComp = React.useMemo(
    () => <Button keyboardShortcuts={keyboardShortcuts} onClick={toggleSidepanelState} {...props} />,
    [keyboardShortcuts, props, toggleSidepanelState],
  );

  if (props.variant === 'inline') {
    return ButtonComp;
  }

  return createPortal(ButtonComp, containerElement);
}
