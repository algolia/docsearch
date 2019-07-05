import docsearchCore /*, { DocSearchOptions }*/ from 'docsearch.js-core';
import renderer from './renderer';

type DocSearchOptions = any;

function docsearch(options: DocSearchOptions) {
  return docsearchCore({ ...options, onResult: renderer });
}

export default docsearch;
