/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { DocSearchButton, DocSearchAskAiModal } from '@docsearch/modal';
import { Sidepanel, SidepanelButton } from '@docsearch/sidepanel';
import type { JSX } from 'react';

import type { DemoTheme } from '../App';

export default function BasicHybrid({ theme }: { theme: DemoTheme }): JSX.Element {
  return (
    <DocSearch theme={theme}>
      <DocSearchButton />
      <DocSearchAskAiModal
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
