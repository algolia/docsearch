/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';

export default function BasicAskAI(): JSX.Element {
  return (
    <DocSearch
      indexName="astro"
      appId="betaHAXPMHIMMC"
      apiKey="54278a5cb95f7a5902363c97b029a4b2"
      askAi={{
        assistantId: 'Z03Eno3oLaXI',
      }}
      insights={true}
      translations={{ button: { buttonText: 'Search with AskAI' } }}
    />
  );
}
