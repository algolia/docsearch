import type { DocSearchProps as DocSearchComponentProps } from '@docsearch/react';
import { DocSearch, version as docSearchVersion } from '@docsearch/react';
import htm from 'htm';
import { createElement, render, isValidElement } from 'preact/compat';

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
const html = htm.bind(createElement) as unknown as (strings: TemplateStringsArray, ...values: unknown[]) => any;

export type TemplateHelpers = Record<string, unknown> & { html: typeof html };

function createTemplateFunction<P extends Record<string, unknown>, R = any>(
  original: ((props: P, helpers?: TemplateHelpers) => R) | undefined,
): ((props: P) => any) | undefined {
  if (!original) return undefined;
  return (props: P) => {
    const out = (original as any)(props, { html });

    // Element, return as is
    if (isValidElement(out)) return out;

    // Component function, call with same props
    if (typeof out === 'function') return (out as any)(props);

    // String, render as plain text to avoid XSS
    if (typeof out === 'string') return createElement('span', null, out);

    // Fallback
    return out;
  };
}

export function docsearch(allProps: DocSearchProps): () => void {
  const { container, environment, transformSearchClient, hitComponent, resultsFooterComponent, ...rest } = allProps;
  const containerEl = getHTMLElement(container, environment || (typeof window !== 'undefined' ? window : undefined));

  const props = {
    ...rest,
    hitComponent: createTemplateFunction(hitComponent as any),
    resultsFooterComponent: createTemplateFunction(resultsFooterComponent as any),
    transformSearchClient: (searchClient: any): any => {
      if (searchClient?.addAlgoliaAgent) {
        searchClient.addAlgoliaAgent('docsearch.js', docSearchVersion);
      }
      return typeof transformSearchClient === 'function' ? transformSearchClient(searchClient) : searchClient;
    },
  } satisfies DocSearchComponentProps;

  render(createElement(DocSearch as any, props as any), containerEl);

  return () => {
    render(null as any, containerEl);
  };
}
