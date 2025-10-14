import type { DocSearchProps as DocSearchComponentProps } from '@docsearch/react';
import { DocSearch, version } from '@docsearch/react';
import htm from 'htm';
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

// Create htm function bound to React.createElement
const html = htm.bind((React as any).createElement) as any;

// Template function support
function createTemplateFunction(originalFunction: any): (props: any, helpers?: any) => any {
  return (props: any, helpers: any = {}) => {
    // Pass html helper to the function
    const result = originalFunction(props, { html, ...helpers });

    // If it's already a React element, return as-is
    if ((React as any).isValidElement?.(result)) {
      return result;
    }

    // If it's a string (HTML), create a React element with dangerouslySetInnerHTML
    if (typeof result === 'string') {
      return (React as any).createElement('div', {
        dangerouslySetInnerHTML: { __html: result },
      });
    }

    // If it's a function, call it (for JSX components)
    if (typeof result === 'function') {
      return result(props);
    }

    // Fallback: return as-is
    return result;
  };
}

export function docsearch(props: DocSearchProps): () => void {
  const containerElement = getHTMLElement(props.container, props.environment);

  const transformedProps: DocSearchComponentProps = {
    ...props,
    // Apply template function support to component props
    hitComponent: props.hitComponent ? createTemplateFunction(props.hitComponent) : undefined,
    resultsFooterComponent: props.resultsFooterComponent
      ? createTemplateFunction(props.resultsFooterComponent)
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
