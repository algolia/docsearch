/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { SidepanelButton, Sidepanel } from '@docsearch/sidepanel';
import type { JSX } from 'react';

export default function SidepanelExample(): JSX.Element {
  return (
    <DocSearch>
      <SidepanelButton variant="inline" />
      <Sidepanel
        indexName="docsearch"
        appId="PMZUYBQDAK"
        searchApiKey="24b09689d5b4223813d9b8e48563c8f6"
        assistantId="askAIDemo"
        variant="floating"
      />
    </DocSearch>
  );
}
