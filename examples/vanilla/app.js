import docsearch from 'docsearch.js';
import 'docsearch-theme-light';

docsearch({
  apiKey: '3949f721e5d8ca1de8928152ff745b28',
  indexName: 'yarnpkg',
  container: '#searchbox',
  searchParameters: {
    filters: 'lang:en',
  },
});
