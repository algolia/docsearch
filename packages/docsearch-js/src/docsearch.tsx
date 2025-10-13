import type { DocSearchProps as DocSearchComponentProps } from '@docsearch/react';
import { DocSearch, version } from '@docsearch/react';
import React, { render } from 'preact/compat';

type DocSearchProps = DocSearchComponentProps & {
  container: HTMLElement | string;
  environment?: typeof window;
};

function getHTMLElement(value: HTMLElement | string, environment: DocSearchProps['environment'] = window): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}

function isValidElementLike(v: any): boolean {
  return (React as any).isValidElement?.(v) ?? false;
}

function isPlainLikeElement(obj: any): obj is { type: any; props?: any; key?: any } {
  return Boolean(obj) && typeof obj === 'object' && 'type' in obj && !isValidElementLike(obj);
}

function createJSXFromObject(obj: any): React.JSX.Element | null {
  if (!isPlainLikeElement(obj)) return null;

  const { type, props = {}, key } = obj;
  const children = props.children;

  let processedChildren = children;
  if (Array.isArray(children)) {
    processedChildren = children.map((child) => (isPlainLikeElement(child) ? createJSXFromObject(child) : child));
  } else if (isPlainLikeElement(children)) {
    processedChildren = createJSXFromObject(children);
  }

  const { children: _omit, ...rest } = props;
  const elementProps = key !== null ? { key, ...rest } : rest;

  return (React as any).createElement(type, elementProps, processedChildren);
}

export function docsearch(props: DocSearchProps): () => void {
  const containerElement = getHTMLElement(props.container, props.environment);

  const transformedProps: DocSearchComponentProps = {
    ...props,
    resultsFooterComponent: props.resultsFooterComponent
      ? (componentProps: any): React.JSX.Element | null => {
          const out = props.resultsFooterComponent!(componentProps);
          if (isValidElementLike(out)) return out;
          const maybe = createJSXFromObject(out);
          return maybe ?? out;
        }
      : undefined,
    transformSearchClient: (searchClient: any) => {
      if (searchClient?.addAlgoliaAgent) {
        searchClient.addAlgoliaAgent('docsearch.js', version);
      }
      return props.transformSearchClient ? props.transformSearchClient(searchClient) : searchClient;
    },
  };

  render(<DocSearch {...(transformedProps as any)} />, containerElement);

  return () => {
    render(null as any, containerElement);
  };
}

export type { DocSearchProps };
