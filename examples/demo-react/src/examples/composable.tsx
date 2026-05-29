/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { DocSearchButton, DocSearchAskAiModal } from '@docsearch/modal';
import { type JSX } from 'react';

export default function Composable(): JSX.Element {
  return (
    <DocSearch>
      <DocSearchButton translations={{ buttonText: 'Composable API' }} />
      <DocSearchAskAiModal
        indexName="docsearch"
        appId="PMZUYBQDAK"
        apiKey="24b09689d5b4223813d9b8e48563c8f6"
        askAi={{
          assistantId: 'ccdec697-e3fe-465b-a1c3-657e7bf18aef',
        }}
      />
    </DocSearch>
  );
}
