/** @jsx h */

import { h, render } from 'preact';
import docsearchCore from 'docsearch.js-core';

import { AutocompleteDropdown } from './components';

export type DocSearchHit = {
  objectID: string;
  levels: string[];
  levelIndex: number;
  content: string;
  url: string;
};

export type DocSearchHits = {
  [title: string]: DocSearchHit[];
};

export interface DocSearchOptions {
  appId?: string;
  apiKey: string;
  indexName: string;
  containerNode: any;
  transformHits?(hits: any): any;
  onResult?(options: any): void;
  onItemSelect?({ hit }: { hit: any }): void;
  searchParameters?: any;
}

function docsearch(options: DocSearchOptions = {} as DocSearchOptions) {
  const {
    containerNode,
    searchParameters,
    onItemSelect,
    ...docsearchCoreOptions
  } = options;
  const docsearchIndex = docsearchCore(docsearchCoreOptions);

  render(
    <AutocompleteDropdown
      search={docsearchIndex.search}
      searchParameters={searchParameters}
      onItemSelect={onItemSelect}
    />,
    containerNode
  );

  return docsearchIndex;
}

export default docsearch;
