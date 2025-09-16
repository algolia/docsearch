/* eslint-disable no-warning-comments */
import docsearchComp from '@docsearch/core-js';
import docsearch from '@docsearch/js';
import docsearchSidepanel from '@docsearch/sidepanel-js';

import './app.css';
import '@docsearch/css/dist/style.css';

docsearch({
  container: '#docsearch',
  indexName: 'docsearch',
  appId: 'PMZUYBQDAK',
  apiKey: '24b09689d5b4223813d9b8e48563c8f6',
});

docsearchComp({
  container: '#docsearch-composable',
});

docsearchSidepanel({
  container: '#docsearch-sidepanel',
});

// TODO: Enable once addons/extensions is working
// docsearchComp({
//   container: '#docsearch-addons',
//   addons: [sidepanelAddon()],
// });
