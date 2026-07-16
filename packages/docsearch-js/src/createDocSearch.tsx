import type { DocSearchRef, InitialAskAiMessage } from '@docsearch/core';
import htm from 'htm';
import type { ComponentType, JSX, Attributes } from 'preact';
import {
  createElement,
  createRef,
  isValidElement,
  render,
  unmountComponentAtNode,
} from 'preact/compat';

export interface DocSearchInstance {
  readonly isReady: boolean;
  readonly isOpen: boolean;
  open(): void;
  close(): void;
  openAskAi(initialMessage?: InitialAskAiMessage): void;
  destroy(): void;
}

export interface DocSearchCallbacks {
  onReady?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  interceptAskAiEvent?: (initialMessage: InitialAskAiMessage) => boolean | void;
}

export type DocSearchProps<TProps> = DocSearchCallbacks &
  Omit<TProps, 'onSidepanelClose' | 'onSidepanelOpen'> & {
    container: HTMLElement | string;
    environment?: typeof window;
  };

function getHTMLElement(
  value: HTMLElement | string,
  env: typeof window | undefined
): HTMLElement {
  if (typeof value !== 'string') return value;
  if (!env)
    throw new Error('Cannot resolve a selector without a browser environment.');

  const element = env.document.querySelector<HTMLElement>(value);
  if (!element)
    throw new Error(`Container selector did not match any element: "${value}"`);

  return element;
}

const html = htm.bind(createElement) as unknown as (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => JSX.Element;

export type TemplateHelpers = Record<string, unknown> & { html: typeof html };

function createTemplateFunction<
  P extends Record<string, unknown>,
  R = JSX.Element | string | (() => JSX.Element),
>(
  original: ((props: P, helpers?: TemplateHelpers) => R) | undefined
): ((props: P) => JSX.Element) | undefined {
  if (!original) return undefined;

  return (props: P) => {
    const output = original(props, { html });

    if (isValidElement(output)) return output;
    if (typeof output === 'function') return output(props);
    if (typeof output === 'string') return createElement('span', null, output);

    return output as JSX.Element;
  };
}

interface ComponentProps {
  hitComponent?: (
    props: Record<string, unknown>,
    helpers?: TemplateHelpers
  ) => JSX.Element;
  resultsFooterComponent?: (
    props: Record<string, unknown>,
    helpers?: TemplateHelpers
  ) => JSX.Element | null;
  transformSearchClient?: (searchClient: unknown) => unknown;
}

export function createDocSearch<TComponentProps, TInputProps = TComponentProps>(
  Component: ComponentType<TComponentProps>,
  version: string
): (allProps: DocSearchProps<TInputProps>) => DocSearchInstance {
  return (allProps) => {
    const input = allProps as unknown as DocSearchProps<ComponentProps>;
    const {
      container,
      environment,
      transformSearchClient,
      hitComponent,
      resultsFooterComponent,
      ...rest
    } = input;
    const containerElement = getHTMLElement(
      container,
      environment || (typeof window !== 'undefined' ? window : undefined)
    );
    const ref = createRef<DocSearchRef>();
    let isReady = false;

    const props: TComponentProps = {
      ...rest,
      ref,
      hitComponent: createTemplateFunction(hitComponent),
      resultsFooterComponent: createTemplateFunction(resultsFooterComponent),
      transformSearchClient: (searchClient: unknown): unknown => {
        if (
          typeof searchClient === 'object' &&
          searchClient !== null &&
          'addAlgoliaAgent' in searchClient &&
          typeof searchClient.addAlgoliaAgent === 'function'
        ) {
          searchClient.addAlgoliaAgent('docsearch.js', version);
        }

        return typeof transformSearchClient === 'function'
          ? transformSearchClient(searchClient)
          : searchClient;
      },
    } as unknown as TComponentProps;

    render(
      createElement(Component, props as Attributes & TComponentProps),
      containerElement
    );
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
        unmountComponentAtNode(containerElement);
        isReady = false;
      },
    };
  };
}
