/* eslint-disable react/react-in-jsx-scope */
import type { AutocompleteState } from '@algolia/autocomplete-core';
import { DocSearch } from '@docsearch/react';
import type { InternalDocSearchHit } from '@docsearch/react';
import type { JSX } from 'react';

function ResultsFooterComponent({ state }: { state: AutocompleteState<InternalDocSearchHit> }): JSX.Element {
  // Using JSX templates
  return (
    <div className="DocSearch-HitsFooter">
      <a href="https://docsearch.algolia.com/apply" target="_blank" rel="noreferrer">
        See all {String(state.context?.nbHits || 0)} results
      </a>
    </div>
  );
}

export default function WResultsFooter(): JSX.Element {
  return (
    <DocSearch
      indexName="docsearch"
      appId="PMZUYBQDAK"
      apiKey="24b09689d5b4223813d9b8e48563c8f6"
      insights={true}
      resultsFooterComponent={ResultsFooterComponent}
      translations={{ button: { buttonText: 'Search with results footer' } }}
    />
  );
}
