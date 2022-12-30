import docsearch from '@docsearch/js/dist/esm';

import './app.css';
import '@docsearch/css';

docsearch({
  container: '#docsearch',
  indexName: 'docsearch',
  appId: 'R2IYF7ETH7',
  apiKey: '599cec31baffa4868cae4e79f180729b',
  transformItems(items) { // transform absolute url into relative ones to solve CORS problem in cypress
    return items.map((item) => {
      const { origin } = new URL(item.url);
      return {
        ...item,
        url: item.url.replace(new RegExp(`^${origin}`), ''),
      };
    });
  },
});
