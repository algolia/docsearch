import docsearch from '../index.js';

docsearch({
  apiKey: '52a6d7ab710fcef44537c3cff5290e55',
  indexName: 'tim_stripe',
  inputSelector: '#search-input'
});

document.getElementById('search-input').focus();
