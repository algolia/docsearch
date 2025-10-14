import type { DocSearchProps as DocSearchComponentProps } from '@docsearch/react';
import { DocSearch, version as docSearchVersion } from '@docsearch/react';
import htm from 'htm';
import { createElement, render, isValidElement } from 'preact/compat';

/**
 * Public props for the tiny wrapper.
 * - `container` can be a selector or an element.
 * - `environment` can be provided for testing or non window environments.
 */
export type DocSearchProps = DocSearchComponentProps & {
  container: HTMLElement | string;
  environment?: typeof window;
};

/** Utility, find the active environment or fall back to globalThis. */
function getEnv(env?: typeof window): typeof window | undefined {
  // In SSR there is no window, so guard the access.
  if (env) return env;
  if (typeof window !== 'undefined') return window;
  return undefined;
}

/** Resolve an HTMLElement from either a selector or a direct reference. */
function getHTMLElement(
  value: HTMLElement | string,
  environment?: DocSearchProps['environment']
): HTMLElement {
  const env = getEnv(environment);

  if (typeof value === 'string') {
    if (!env) {
      throw new Error(
        'Cannot resolve a selector without a browser environment.'
      );
    }
    const el = env.document.querySelector<HTMLElement>(value);
    if (!el) {
      throw new Error(
        `Container selector did not match any element: "${value}"`
      );
    }
    return el;
  }

  return value;
}

// Create `html` function bound to Preact's createElement.
const html = htm.bind(createElement) as any;

/**
 * Lightweight HTML sanitizer for template strings that return raw markup.
 * This uses DOM parsing and an allow list instead of regex replacements.
 * Note, for mission critical security you should use a proven sanitizer like DOMPurify.
 */
function sanitizeHtml(htmlString: string, environment?: typeof window): string {
  const env = getEnv(environment);
  if (!env) {
    // No DOM, return the original string. Caller should avoid dangerouslySetInnerHTML on the server.
    return '';
  }

  const parser = new env.DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const ALLOWED_TAGS = new Set([
    'a',
    'abbr',
    'b',
    'blockquote',
    'br',
    'code',
    'div',
    'em',
    'i',
    'kbd',
    'li',
    'ol',
    'p',
    'pre',
    's',
    'span',
    'strong',
    'sub',
    'sup',
    'u',
    'ul',
  ]);
  const ALLOWED_ATTRS = new Set(['href', 'title', 'target', 'rel']);

  // Remove disallowed elements and attributes.
  const treeWalker = doc.createTreeWalker(
    doc.body,
    env.NodeFilter.SHOW_ELEMENT
  );
  const toRemove: Element[] = [];

  // First pass, collect and clean.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const node = treeWalker.nextNode() as Element | null;
    if (!node) break;

    if (!ALLOWED_TAGS.has(node.tagName.toLowerCase())) {
      toRemove.push(node);
    } else {
      // Remove dangerous attributes.
      for (const attr of Array.from(node.attributes)) {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        if (!ALLOWED_ATTRS.has(name)) {
          node.removeAttribute(attr.name);
        } else if (
          name === 'href' &&
          /^(javascript|vbscript|data):/i.test(value)
        ) {
          // Disallow javascript like protocols in href.
          node.removeAttribute(attr.name);
        }
      }
    }
  }

  // Second pass, remove nodes that were flagged.
  for (const el of toRemove) {
    el.remove();
  }

  return doc.body.innerHTML;
}

/** Types for template helpers injected into DocSearch templates. */
export type TemplateHelpers = {
  html: typeof html;
  [key: string]: unknown;
};

/**
 * Wrap a user provided template which can return:
 *  - a Preact element, used as is
 *  - a string, treated as HTML and sanitized, then injected
 *  - a component function, which is invoked with the same props.
 */
function createTemplateFunction<P extends Record<string, unknown>, R = any>(
  original: ((props: P, helpers?: TemplateHelpers) => R) | undefined,
  environment?: typeof window
): ((props: P) => any) | undefined {
  if (!original) return undefined;

  return (props: P) => {
    const result = (original as any)(props, { html });

    if (isValidElement(result)) {
      return result;
    }

    if (typeof result === 'string') {
      const safe = sanitizeHtml(result, environment);
      // Use a wrapper div to insert sanitized HTML.
      return createElement('div', {
        dangerouslySetInnerHTML: { __html: safe },
      });
    }

    if (typeof result === 'function') {
      return (result as any)(props);
    }

    return result;
  };
}

/**
 * Mount DocSearch into the given container and return a cleanup function.
 */
export function docsearch(props: DocSearchProps): () => void {
  const containerEl = getHTMLElement(props.container, props.environment);

  const transformedProps = {
    ...props,
    // Template function support with sanitization and `html` helper.
    hitComponent: createTemplateFunction(
      props.hitComponent as any,
      props.environment
    ),
    resultsFooterComponent: createTemplateFunction(
      props.resultsFooterComponent as any,
      props.environment
    ),
    transformSearchClient: (searchClient: any): any => {
      if (searchClient?.addAlgoliaAgent) {
        searchClient.addAlgoliaAgent('docsearch.js', docSearchVersion);
      }
      return props.transformSearchClient
        ? props.transformSearchClient(searchClient)
        : searchClient;
    },
  } satisfies DocSearchComponentProps;

  render(createElement(DocSearch as any, transformedProps as any), containerEl);

  // Return an idempotent cleanup to unmount the component.
  return () => {
    render(null as any, containerEl);
  };
}
