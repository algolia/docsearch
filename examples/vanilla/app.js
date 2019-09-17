import docsearch from 'docsearch.js';
import 'docsearch-theme-light';
import './docsearch-theme.css';

const searchParams = new URL(location).searchParams;
const indexName = searchParams.get('indexName') || 'francoischalifour';
const apiKey = searchParams.get('apiKey') || '05f2b9f825e93891445000c63e103290';
const indexNameInput = document.querySelector('#indexName');
const apiKeyInput = document.querySelector('#apiKey');

indexNameInput.value = indexName;
apiKeyInput.value = apiKey;

docsearch({
  indexName,
  apiKey,
  inputSelector: '#searchbox',
});
