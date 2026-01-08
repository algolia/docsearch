import type { DocSearchRef, InitialAskAiMessage } from '@docsearch/core';
import type { DocSearchProps as DocSearchComponentProps } from '@docsearch/react';
import { DocSearch, version as docSearchVersion } from '@docsearch/react';
import htm from 'htm';
import type { JSX } from 'preact';
import { createElement, render, isValidElement, unmountComponentAtNode, createRef } from 'preact/compat';

/**
 * Instance returned by docsearch() for programmatic control.
 */
export interface DocSearchInstance {
  /** Returns true once the component is mounted and ready. */
  readonly isReady: boolean;
  /** Returns true if the modal is currently open. */
  readonly isOpen: boolean;
  /** Opens the search modal. */
  open(): void;
  /** Closes the search modal. */
  close(): void;
  /** Opens Ask AI mode (modal). */
  openAskAi(initialMessage?: InitialAskAiMessage): void;
  /** Unmounts the DocSearch component and cleans up. */
  destroy(): void;
}

/**
 * Lifecycle callbacks for the DocSearch instance.
 */
export interface DocSearchCallbacks {
  /** Called once DocSearch is mounted and ready for interaction. */
  onReady?: () => void;
  /** Called when the modal opens. */
  onOpen?: () => void;
  /** Called when the modal closes. */
  onClose?: () => void;
  interceptAskAiEvent?: (initialMessage: InitialAskAiMessage) => boolean | void;
}

export type DocSearchProps = DocSearchCallbacks &
  Omit<DocSearchComponentProps, 'onSidepanelClose' | 'onSidepanelOpen'> & {
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

export function docsearch(allProps: DocSearchProps): DocSearchInstance {
  const { container, environment, transformSearchClient, hitComponent, resultsFooterComponent, ...rest } = allProps;
  const containerEl = getHTMLElement(container, environment || (typeof window !== 'undefined' ? window : undefined));
  const ref = createRef<DocSearchRef>();
  let isReady = false;

  const props = {
    ...rest,
    ref,
    hitComponent: createTemplateFunction(hitComponent),
    resultsFooterComponent: createTemplateFunction(resultsFooterComponent),
    transformSearchClient: (searchClient: any): any => {
      if (searchClient?.addAlgoliaAgent) {
        searchClient.addAlgoliaAgent('docsearch.js', docSearchVersion);
      }
      return typeof transformSearchClient === 'function' ? transformSearchClient(searchClient) : searchClient;
    },
  } satisfies DocSearchComponentProps & { ref: typeof ref };

  render(createElement(DocSearch, props), containerEl);

  // Mark as ready after render completes
  isReady = true;

  return {
    open(): void {
      ref.current?.open();
    },
    close(): void {
      ref.current?.close();
    },
    openAskAi(initialMessage?: InitialAskAiMessage): void {
      ref.current?.openAskAi(initialMessage);
    },
    get isReady(): boolean {
      return isReady;
    },
    get isOpen(): boolean {
      return ref.current?.isOpen ?? false;
    },
    destroy(): void {
      unmountComponentAtNode(containerEl);
      isReady = false;
    },
  };
}
