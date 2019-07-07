/** @jsx h */

import { h, render } from 'preact';
import docsearchCore, { DocSearchCoreOptions } from 'docsearch-core';
import DocSearchAutocomplete from 'docsearch-renderer-downshift';
import { DocSearchHit } from 'docsearch-types';

export interface DocSearchOptions extends DocSearchCoreOptions {
  /**
   * The container of the search box.
   */
  container: HTMLElement | string;
  /**
   * The text that appears in the search box input when there is
   * no query.
   *
   * @default `"Search"`
   */
  placeholder?: string;
  /**
   * Function called when the user selects an item.
   */
  onItemSelect?({ hit }: { hit: DocSearchHit }): void;
}

function docsearch(options: DocSearchOptions = {} as DocSearchOptions) {
  const {
    container,
    placeholder = 'Search',
    onItemSelect,
    ...docsearchCoreOptions
  } = options;
  const containerNode =
    typeof container === 'string'
      ? document.querySelector<HTMLElement>(container)
      : container;

  if (!containerNode) {
    throw new Error(
      'The `container` option expects a `string` or an `HTMLElement`.'
    );
  }

  const docsearchIndex = docsearchCore(docsearchCoreOptions);

  render(
    <DocSearchAutocomplete
      placeholder={placeholder}
      search={docsearchIndex.search}
      onItemSelect={onItemSelect}
    />,
    containerNode
  );

  return docsearchIndex;
}

export default docsearch;
