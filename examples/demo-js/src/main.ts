import type { AutocompleteState } from '@algolia/autocomplete-core';
import docsearch from '@docsearch/js';
import type { TemplateHelpers } from '@docsearch/js';
import sidepanel from '@docsearch/sidepanel-js';

import './app.css';
import '@docsearch/css/dist/style.css';
import '@docsearch/css/dist/sidepanel.css';

docsearch({
  container: '#docsearch',
  indexName: 'docsearch',
  appId: 'PMZUYBQDAK',
  apiKey: '24b09689d5b4223813d9b8e48563c8f6',
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

sidepanel({
  container: '#docsearch-sidepanel',
  indexName: 'docsearch',
  appId: 'PMZUYBQDAK',
  apiKey: '24b09689d5b4223813d9b8e48563c8f6',
  assistantId: 'askAIDemo',
});
