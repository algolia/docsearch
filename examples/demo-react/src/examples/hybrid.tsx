/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { DocSearchButton, DocSearchModal } from '@docsearch/modal';
import { Sidepanel, SidepanelButton } from '@docsearch/sidepanel';
import type { JSX } from 'react';

export default function BasicHybrid(): JSX.Element {
  return (
    <DocSearch>
      <DocSearchButton />
      <DocSearchModal
        indexName="docsearch"
        appId="PMZUYBQDAK"
        apiKey="24b09689d5b4223813d9b8e48563c8f6"
        askAi="askAIDemo"
      />

      <SidepanelButton />
      <Sidepanel
        indexName="docsearch"
        appId="PMZUYBQDAK"
        apiKey="24b09689d5b4223813d9b8e48563c8f6"
        assistantId="askAIDemo"
      />
    </DocSearch>
  );
}
