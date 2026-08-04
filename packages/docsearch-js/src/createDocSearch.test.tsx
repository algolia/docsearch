import { createElement, type JSX } from 'preact';
import { afterEach, describe, expect, it } from 'vitest';

import { createDocSearch, type DocSearchInstance } from './createDocSearch';
import type { FooterActionFn as KeywordFooterActionFn } from './docsearch';

import type { FooterActionFn as AskAiFooterActionFn } from './index';

interface TestComponentProps {
  footerAction?: () => JSX.Element | null;
}

function TestComponent({ footerAction }: TestComponentProps): JSX.Element {
  return createElement(
    'div',
    null,
    footerAction && createElement(footerAction, null)
  );
}

const askAiFooterAction: AskAiFooterActionFn = (_props, { html }) =>
  html`<button type="button">Ask AI footer action</button>`;

const keywordFooterAction: KeywordFooterActionFn = (_props, { html }) =>
  html`<button type="button">Keyword footer action</button>`;

describe('createDocSearch', () => {
  let instance: DocSearchInstance | undefined;

  afterEach(() => {
    instance?.destroy();
    instance = undefined;
  });

  it('adapts footerAction templates for the rendered component', () => {
    const container = document.createElement('div');
    const footerAction = (): JSX.Element =>
      createElement('button', { type: 'button' }, 'Footer action');
    const docsearch = createDocSearch<TestComponentProps>(
      TestComponent,
      'test'
    );

    instance = docsearch({ container, footerAction });

    expect(container.textContent).toContain('Footer action');
  });

  it('provides the html helper to footerAction templates', () => {
    const container = document.createElement('div');
    const docsearch = createDocSearch<TestComponentProps>(
      TestComponent,
      'test'
    );

    instance = docsearch({ container, footerAction: askAiFooterAction });

    expect(container.textContent).toContain('Ask AI footer action');
  });

  it('accepts footerAction templates from the keyword-only entry point', () => {
    const container = document.createElement('div');
    const docsearch = createDocSearch<TestComponentProps>(
      TestComponent,
      'test'
    );

    instance = docsearch({ container, footerAction: keywordFooterAction });

    expect(container.textContent).toContain('Keyword footer action');
  });

  it('renders string and component footerAction template returns', () => {
    const container = document.createElement('div');
    const docsearch = createDocSearch<TestComponentProps>(
      TestComponent,
      'test'
    );

    instance = docsearch({
      container,
      footerAction: () => () =>
        createElement('button', { type: 'button' }, 'Component footer action'),
    });

    expect(container.textContent).toContain('Component footer action');

    instance.destroy();
    instance = docsearch({
      container,
      footerAction: () => 'Text footer action',
    });

    expect(container.textContent).toContain('Text footer action');
  });

  it('supports footerAction templates that return null', () => {
    const container = document.createElement('div');
    const docsearch = createDocSearch<TestComponentProps>(
      TestComponent,
      'test'
    );

    instance = docsearch({ container, footerAction: () => null });

    expect(container.textContent).toBe('');
  });
});
