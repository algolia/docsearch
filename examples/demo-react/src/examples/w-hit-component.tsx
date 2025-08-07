/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';

export default function WHitComponent(): JSX.Element {
  return (
    <DocSearch
      indexName="docsearch"
      appId="PMZUYBQDAK"
      apiKey="24b09689d5b4223813d9b8e48563c8f6"
      insights={true}
      translations={{ button: { buttonText: 'Search with custom hits' } }}
      hitComponent={({ hit }) => <div>Hello {hit.content}</div>}
    />
  );
}
