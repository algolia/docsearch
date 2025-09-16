import { DocSearch } from '@docsearch/core';
import { DocSearchSidePanel, DocSearchSidePanelButton } from '@docsearch/sidepanel';
import React, { render, unmountComponentAtNode } from 'preact/compat';

function getHTMLElement(
  value: HTMLElement | string,
  environment: DocSearchSidePanelProps['environment'] = window,
): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}

interface DocSearchSidePanelProps {
  container: HTMLElement | string;
  environment?: typeof window;
}

export function docsearchSidepanel(props: DocSearchSidePanelProps): () => void {
  const containerElement = getHTMLElement(props.container, props.environment);

  render(
    <DocSearch>
      <DocSearchSidePanelButton />
      <DocSearchSidePanel />
    </DocSearch>,
    containerElement,
  );

  return () => {
    unmountComponentAtNode(containerElement);
  };
}
