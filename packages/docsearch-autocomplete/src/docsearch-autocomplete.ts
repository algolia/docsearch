import docsearch, { withUsage, QueryParameters } from 'docsearch.js-core';
import autocomplete from 'autocomplete.js';

import { suggestionTemplate } from './templates';

interface DocSearchAutocompleteOptions {
  apiKey: string;
  indexName: string;
  inputSelector: string | HTMLElement;
  algoliaOptions: QueryParameters;
}

function docsearchAutocomplete({
  apiKey,
  indexName,
  inputSelector,
  algoliaOptions,
}: DocSearchAutocompleteOptions) {
  if (!inputSelector) {
    throw new Error(
      withUsage(
        'The `inputSelector` option expects a `string` or an `HTMLElement`.'
      )
    );
  }

  const inputSelectorNode =
    typeof inputSelector === 'string'
      ? document.querySelector(inputSelector)
      : inputSelector;

  const docsearchIndex = docsearch({
    apiKey,
    indexName,
  });

  type SourceCallback = (response: any[]) => void;

  autocomplete(inputSelectorNode, { hint: false, debug: true }, [
    {
      source: (query: string, callback: SourceCallback) => {
        return docsearchIndex
          .search({ ...algoliaOptions, query })
          .then(({ hits }) => {
            callback([hits]);
          });
      },
      displayKey: 'name',
      templates: {
        suggestion: suggestionTemplate,
      },
    },
  ]);
}

export default docsearchAutocomplete;
