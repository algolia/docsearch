/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';

export default function BasicAskAI(): JSX.Element {
  return (
    <DocSearch
      indexName="docsearch"
      appId="PMZUYBQDAK"
      apiKey="24b09689d5b4223813d9b8e48563c8f6"
      askAi={{
        assistantId: 'askAIDemo',
        searchParameters: {
          facetFilters: ['language:en'],
        },
      }}
      insights={true}
      translations={{ button: { buttonText: 'Search with Ask AI' } }}
    />
  );
}
