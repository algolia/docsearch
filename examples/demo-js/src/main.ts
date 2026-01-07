import type { AutocompleteState } from '@algolia/autocomplete-core';
import type { InitialAskAiMessage } from '@docsearch/core';
import docsearch, { type DocSearchInstance, type TemplateHelpers } from '@docsearch/js';
import sidepanel, { type SidepanelInstance } from '@docsearch/sidepanel-js';

import './app.css';
import '@docsearch/css/dist/style.css';
import '@docsearch/css/dist/sidepanel.css';

declare global {
  interface Window {
    docsearch?: DocSearchInstance;
    sidepanel?: SidepanelInstance;
  }
}

function logDocSearchState(instance: DocSearchInstance, label: string): void {
  // eslint-disable-next-line no-console
  console.log(`[demo-js] ${label}`, {
    isReady: instance.isReady,
    isOpen: instance.isOpen,
  });
}

function logSidepanelState(instance: SidepanelInstance, label: string): void {
  // eslint-disable-next-line no-console
  console.log(`[demo-js] ${label}`, {
    isReady: instance.isReady,
    isOpen: instance.isOpen,
  });
}

const sidepanelInstance = sidepanel({
  container: '#docsearch-sidepanel',
  indexName: 'docsearch',
  appId: 'PMZUYBQDAK',
  apiKey: '24b09689d5b4223813d9b8e48563c8f6',
  assistantId: 'askAIDemo',
  onReady: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] sidepanel onReady()');
  },
  onOpen: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] sidepanel onOpen()');
  },
  onClose: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] sidepanel onClose()');
  },
});

window.sidepanel = sidepanelInstance;

// eslint-disable-next-line no-console
console.log('[demo-js] sidepanel instance exposed on window.sidepanel');
// eslint-disable-next-line no-console
console.log('[demo-js] sidepanel try:', {
  open: 'window.sidepanel?.open()',
  close: 'window.sidepanel?.close()',
  openWithMessage: "window.sidepanel?.openWithMessage({ query: 'Hello from demo-js' })",
  destroy: 'window.sidepanel?.destroy()',
});
logSidepanelState(sidepanelInstance, 'sidepanel initial state');

const docsearchInstance = docsearch({
  container: '#docsearch',
  indexName: 'docsearch',
  appId: 'PMZUYBQDAK',
  apiKey: '24b09689d5b4223813d9b8e48563c8f6',
  askAi: 'askAIDemo',
  interceptAskAiEvent: (initialMessage: InitialAskAiMessage) => {
    docsearchInstance.close();
    sidepanelInstance.openWithMessage(initialMessage);
    return true;
  },
  onReady: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] docsearch onReady()');
  },
  onOpen: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] docsearch onOpen()');
  },
  onClose: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] docsearch onClose()');
  },
  resultsFooterComponent: ({ state }: { state: AutocompleteState<any> }, helpers?: TemplateHelpers) => {
    const { html } = helpers || {};
    if (!html) return null;

    return html`
      <div class="DocSearch-HitsFooter">
        <a href="https://docsearch.algolia.com/apply" target="_blank">
          See all ${state.context?.nbHits || 0} results
        </a>
      </div>
    `;
  },
});

// Expose instance
window.docsearch = docsearchInstance;

// eslint-disable-next-line no-console
console.log('[demo-js] docsearch instance exposed on window.docsearch');
// eslint-disable-next-line no-console
console.log('[demo-js] docsearch try:', {
  open: 'window.docsearch?.open()',
  close: 'window.docsearch?.close()',
  openAskAi: "window.docsearch?.openAskAi({ query: 'Hello from demo-js' })",
  destroy: 'window.docsearch?.destroy()',
});
logDocSearchState(docsearchInstance, 'docsearch initial state');
