import docsearch from '@docsearch/js';

import './app.css';
import '@docsearch/css/dist/style.css';

docsearch({
  container: '#docsearch',
  indexName: 'docsearch',
  appId: 'PMZUYBQDAK',
  apiKey: '24b09689d5b4223813d9b8e48563c8f6',
  resultsFooterComponent: (({ state }: any, { html }: any) => {
    // Using HTML strings with html helper
    return html`
      <div class="DocSearch-HitsFooter">
        <a href="https://docsearch.algolia.com/apply" target="_blank">
          See all ${state.context?.nbHits || 0} results
        </a>
      </div>
    `;
  }) as any,
});
