import docsearch from '../index.js';

docsearch({
  apiKey: 'e3d767b736584dbe6d4c35f7cf7d4633',
  indexName: 'react-native',
  inputSelector: '#search-input',
  autocompleteOptions: {
    debug: true
  }
});

document.getElementById('search-input').focus();
