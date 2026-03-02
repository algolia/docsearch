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
        appId="beta3G7FSQDJR3"
        apiKey="0faad3eae2ba413c16355a0f8670c201"
        askAi={{
          assistantId: 'e3Kl4lTCBlSA',
          indexName: 'docsearch-markdown',
        }}
      />

      <SidepanelButton />
      <Sidepanel
        indexName="docsearch-markdown"
        appId="beta3G7FSQDJR3"
        apiKey="0faad3eae2ba413c16355a0f8670c201"
        assistantId="e3Kl4lTCBlSA"
      />
    </DocSearch>
  );
}
