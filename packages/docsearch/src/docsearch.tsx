/** @jsx h */

import { h, render } from 'preact';
import docsearchCore, { DocSearchCoreOptions } from 'docsearch-core';
import DocSearch from 'docsearch-renderer-downshift';
import { DocSearchHit } from 'docsearch-types';

export interface DocSearchOptions extends DocSearchCoreOptions {
  /**
   * The container of the search box.
   */
  inputSelector: HTMLElement | string;
  /**
   * The text that appears in the search box input when there is
   * no query.
   *
   * @default `"Search"`
   */
  placeholder?: string;
  /**
   * The number of milliseconds before the search is considered
   * as stalled.
   *
   * @default `300`
   */
  stalledSearchDelay?: number;
  /**
   * The function called when the user highlights an item.
   * Highlighting happens on hover and on keyboard navigation.
   */
  onItemHighlight?({ hit }: { hit: DocSearchHit }): void;
  /**
   * The function called when the user selects an item.
   */
  onItemSelect?({ hit }: { hit: DocSearchHit }): void;
}

function withUsage(message: string) {
  return `
${message}

See: https://community.algolia.com/docsearch
`.trim();
}

function docsearch(options: DocSearchOptions = {} as DocSearchOptions) {
  const {
    inputSelector,
    placeholder = 'Search',
    stalledSearchDelay = 300,
    onItemSelect,
    onItemHighlight,
    ...docsearchCoreOptions
  } = options;
  const inputNode =
    typeof inputSelector === 'string'
      ? document.querySelector<HTMLElement>(inputSelector)
      : inputSelector;

  if (!inputNode) {
    throw new Error(
      withUsage(
        'The `inputSelector` option expects a `string` or an `HTMLElement`.'
      )
    );
  }

  const docsearchIndex = docsearchCore(docsearchCoreOptions);

  render(
    <DocSearch
      placeholder={placeholder}
      stalledSearchDelay={stalledSearchDelay}
      search={docsearchIndex.search}
      onItemSelect={onItemSelect}
      onItemHighlight={onItemHighlight}
    />,
    inputNode,
    inputNode.firstElementChild as Element
  );
}

export default docsearch;
