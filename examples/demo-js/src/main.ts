import docsearch, {
  type DocSearchInstance,
  type TemplateHelpers,
} from '@docsearch/js';
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

let docsearchInstance: DocSearchInstance | undefined = undefined;
let sidepanelInstance: SidepanelInstance | undefined = undefined;

sidepanelInstance = sidepanel({
  container: '#docsearch-sidepanel',
  indexName: 'docsearch',
  appId: 'PMZUYBQDAK',
  apiKey: '24b09689d5b4223813d9b8e48563c8f6',
  assistantId: 'ccdec697-e3fe-465b-a1c3-657e7bf18aef',
  onReady: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] sidepanel onReady()');
  },
  onOpen: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] sidepanel onOpen()');
    docsearchInstance?.close();
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
  openWithMessage: "window.sidepanel?.open({ query: 'Hello from demo-js' })",
  close: 'window.sidepanel?.close()',
  destroy: 'window.sidepanel?.destroy()',
});
logSidepanelState(sidepanelInstance, 'sidepanel initial state');

docsearchInstance = docsearch({
  container: '#docsearch',
  indexName: 'docsearch',
  appId: 'PMZUYBQDAK',
  apiKey: '24b09689d5b4223813d9b8e48563c8f6',
  askAi: {
    assistantId: 'ccdec697-e3fe-465b-a1c3-657e7bf18aef',
  },
  interceptAskAiEvent: (initialMessage) => {
    docsearchInstance?.close();
    sidepanelInstance.open(initialMessage);
    return true;
  },
  onReady: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] docsearch onReady()');
  },
  onOpen: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] docsearch onOpen()');
    sidepanelInstance.close();
  },
  onClose: () => {
    // eslint-disable-next-line no-console
    console.log('[demo-js] docsearch onClose()');
  },
  resultsFooterComponent: ({ state }, helpers?: TemplateHelpers) => {
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
