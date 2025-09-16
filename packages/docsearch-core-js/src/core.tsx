/* eslint-disable no-warning-comments */
import { DocSearch, DocSearchButton, DocSearchModal } from '@docsearch/core';
import React, { render, unmountComponentAtNode } from 'preact/compat';

function getHTMLElement(value: HTMLElement | string, environment: DocSearchProps['environment'] = window): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}

interface DocSearchProps {
  container: HTMLElement | string;
  environment?: typeof window;
}

export function docsearch({ container, environment = window }: DocSearchProps): () => void {
  const containerElement = getHTMLElement(container, environment);

  render(
    <DocSearch>
      <DocSearchButton />
      <DocSearchModal />
      {/* TODO: Need to render `addons` somehow, fighting with types between React <-> Preact */}
    </DocSearch>,
    containerElement,
  );

  return () => {
    unmountComponentAtNode(containerElement);
  };
}
