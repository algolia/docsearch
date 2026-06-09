/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { DocSearchButton, DocSearchAskAiModal } from '@docsearch/modal';
import { Sidepanel, SidepanelButton } from '@docsearch/sidepanel';
import type { JSX } from 'react';

export default function BasicHybrid(): JSX.Element {
  return (
    <DocSearch>
      <DocSearchButton />
      <DocSearchAskAiModal
        indexName="docsearch"
        appId="PMZUYBQDAK"
        apiKey="24b09689d5b4223813d9b8e48563c8f6"
        askAi={{
          assistantId: 'ccdec697-e3fe-465b-a1c3-657e7bf18aef',
        }}
      />

      <SidepanelButton />
      <Sidepanel
        indexName="docsearch-markdown"
        appId="PMZUYBQDAK"
        apiKey="24b09689d5b4223813d9b8e48563c8f6"
        assistantId="ccdec697-e3fe-465b-a1c3-657e7bf18aef"
      />
    </DocSearch>
  );
}
