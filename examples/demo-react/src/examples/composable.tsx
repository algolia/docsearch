/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { DocSearchButton, DocSearchModal } from '@docsearch/modal';
import { type JSX } from 'react';

export default function Composable(): JSX.Element {
  return (
    <DocSearch>
      <DocSearchButton translations={{ buttonText: 'Composable API' }} />
      <DocSearchModal
        indexName="docsearch"
        appId="PMZUYBQDAK"
        apiKey="24b09689d5b4223813d9b8e48563c8f6"
        askAi={{
          assistantId: 'askAIDemo',
          searchParameters: {
            facetFilters: ['language:en'],
          },
        }}
      />
    </DocSearch>
  );
}
