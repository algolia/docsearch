import type { DocSearchRef, InitialAskAiMessage } from '@docsearch/core';
import type {
  ResultsFooterComponentProps,
  HitComponentProps,
} from '@docsearch/react';
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

export type TemplateHelpers = { html: typeof html };

// Defines the public facing interface for each "template" function
type TemplateFnReturnType = JSX.Element | string | (() => JSX.Element) | null;

export type HitComponentFn = (
  props: HitComponentProps,
  helpers: TemplateHelpers
) => TemplateFnReturnType;

export type ResultsFooterComponentFn = (
  props: ResultsFooterComponentProps,
  helpers: TemplateHelpers
) => TemplateFnReturnType;

export type FooterActionFn = (
  props: never,
  helpers: TemplateHelpers
) => TemplateFnReturnType;

export type DocSearchProps<TProps> = DocSearchCallbacks &
  Omit<
    TProps,
    | 'onSidepanelClose'
    | 'onSidepanelOpen'
    | 'hitComponent'
    | 'resultsFooterComponent'
    | 'footerAction'
  > & {
    container: HTMLElement | string;
    environment?: typeof window;
    /**
     * Custom component to render an individual hit. Supports template patterns:
     *
     * - HTML strings with html helper: (props, { html }) => html`<div>...</div>`
     * - JSX templates: (props) => <div>...</div>
     * - Function-based templates: (props) => string | JSX.Element | Function.
     */
    hitComponent?: HitComponentFn;
    /**
     * Custom component rendered at the bottom of the results panel. Supports
     * template patterns:
     *
     * - HTML strings with html helper: (props, { html }) => html`<div>...</div>`
     * - JSX templates: (props) => <div>...</div>
     * - Function-based templates: (props) => string | JSX.Element | Function.
     */
    resultsFooterComponent?: ResultsFooterComponentFn;
    /**
     * A custom action that can be rendered in the Modal's footer before the
     * Algolia logo. The component will be rendered as a child of `<div
     * className="DocSearch-Footer-Action" />`. Supports template patterns:
     *
     * - HTML strings with html helper: (props, { html }) => html`<div>...</div>`
     * - JSX templates: (props) => <div>...</div>
     * - Function-based templates: (props) => string | JSX.Element | Function.
     */
    footerAction?: FooterActionFn;
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

function createTemplateFunction<
  P = Record<string, unknown>,
  R = TemplateFnReturnType,
>(
  original: ((props: P, helpers: TemplateHelpers) => R) | undefined
): ((props: P) => JSX.Element | null) | undefined {
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
  hitComponent?: HitComponentFn;
  resultsFooterComponent?: ResultsFooterComponentFn;
  transformSearchClient?: (searchClient: unknown) => unknown;
  footerAction?: FooterActionFn;
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
      footerAction,
      ...rest
    } = input;
    const containerElement = getHTMLElement(
      container,
      environment || (typeof window !== 'undefined' ? window : undefined)
    );
    const ref = createRef<DocSearchRef>();
    let isReady = false;

    const FooterAction = createTemplateFunction(footerAction);

    const props: TComponentProps = {
      ...rest,
      ref,
      hitComponent: createTemplateFunction<HitComponentProps>(hitComponent),
      resultsFooterComponent:
        createTemplateFunction<ResultsFooterComponentProps>(
          resultsFooterComponent
        ),
      footerAction: FooterAction
        ? createElement(FooterAction, null)
        : undefined,
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
