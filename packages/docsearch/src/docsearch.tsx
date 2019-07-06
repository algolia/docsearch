/** @jsx h */

import { h, render } from 'preact';
import docsearchCore, { DocSearchCoreOptions } from 'docsearch.js-core';
import { DocSearchHit, QueryParameters } from 'docsearch.js-types';

import { AutocompleteDropdown } from './components';

export interface DocSearchOptions extends DocSearchCoreOptions {
  container: HTMLElement | string;
  searchParameters?: QueryParameters;
  onItemSelect?({ hit }: { hit: DocSearchHit }): void;
}

function docsearch(options: DocSearchOptions = {} as DocSearchOptions) {
  const {
    container,
    searchParameters,
    onItemSelect,
    ...docsearchCoreOptions
  } = options;
  const containerNode =
    typeof container === 'string'
      ? document.querySelector<HTMLElement>(container)
      : container;

  if (!containerNode) {
    throw new Error('The `container` is not a DOM element.');
  }

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
