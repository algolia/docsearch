import type { DocSearchProps as DocSearchComponentProps } from '@docsearch/react';
import { DocSearch, version as docSearchVersion } from '@docsearch/react';
import htm from 'htm';
import type { JSX } from 'preact';
import { createElement, render, isValidElement, unmountComponentAtNode } from 'preact/compat';

export type DocSearchProps = DocSearchComponentProps & {
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

// Tiny `html` helper bound to Preact createElement
const html = htm.bind(createElement) as unknown as (strings: TemplateStringsArray, ...values: unknown[]) => JSX.Element;

export type TemplateHelpers = Record<string, unknown> & { html: typeof html };

function createTemplateFunction<P extends Record<string, unknown>, R = JSX.Element | string | (() => JSX.Element)>(
  original: ((props: P, helpers?: TemplateHelpers) => R) | undefined,
): ((props: P) => JSX.Element) | undefined {
  if (!original) return undefined;
  return (props: P) => {
    const out = original(props, { html });

    // Element, return as is
    if (isValidElement(out)) return out;

    // Component function, call with same props
    if (typeof out === 'function') return out(props);

    // String, render as plain text to avoid XSS
    if (typeof out === 'string') return createElement('span', null, out);

    // Fallback
    return out as JSX.Element;
  };
}

export function docsearch(allProps: DocSearchProps): () => void {
  const { container, environment, transformSearchClient, hitComponent, resultsFooterComponent, ...rest } = allProps;
  const containerEl = getHTMLElement(container, environment || (typeof window !== 'undefined' ? window : undefined));

  const props = {
    ...rest,
    hitComponent: createTemplateFunction(hitComponent),
    resultsFooterComponent: createTemplateFunction(resultsFooterComponent),
    transformSearchClient: (searchClient: any): any => {
      if (searchClient?.addAlgoliaAgent) {
        searchClient.addAlgoliaAgent('docsearch.js', docSearchVersion);
      }
      return typeof transformSearchClient === 'function' ? transformSearchClient(searchClient) : searchClient;
    },
  } satisfies DocSearchComponentProps;

  render(createElement(DocSearch, props), containerEl);

  return () => {
    unmountComponentAtNode(containerEl);
  };
}
