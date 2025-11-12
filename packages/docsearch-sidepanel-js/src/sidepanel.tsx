import type { DocSearchSidepanelProps } from '@docsearch/react/sidepanel';
import { DocSearchSidepanel } from '@docsearch/react/sidepanel';
import { render, createElement, unmountComponentAtNode } from 'preact/compat';

export type SidepanelProps = DocSearchSidepanelProps & {
  container: HTMLElement | string;
  environment?: typeof window;
};

function getHTMLElement(value: HTMLElement | string, env: typeof window | undefined): HTMLElement {
  if (typeof value !== 'string') return value;
  if (!env) throw new Error('Cannot resolve a selector without a browser environment.');
  const el = env.document.querySelector<HTMLElement>(value);
  if (!el) throw new Error(`Container selector did not match any element: "${value}"`);
  return el;
}

export function sidepanel(props: SidepanelProps): () => void {
  const { container, environment, ...sidepanelProps } = props;
  const containerEl = getHTMLElement(container, environment || (typeof window !== 'undefined' ? window : undefined));

  render(createElement(DocSearchSidepanel, sidepanelProps), containerEl);

  return () => {
    unmountComponentAtNode(containerEl);
  };
}
