/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { DocSearchButton } from '@docsearch/modal/button';
import { DocSearchModal } from '@docsearch/modal/modal';
import type { JSX } from 'react';

export default function AgentStudio(): JSX.Element {
  return (
    <DocSearch>
      <DocSearchButton
        translations={{
          buttonText: 'Ask AI with Agent Studio',
        }}
      />
      <DocSearchModal
        indexName="docsearch"
        appId="PMZUYBQDAK"
        apiKey="a00716d83c64f6c61905c078b7d5ab66"
        askAi={{
          assistantId: 'ccdec697-e3fe-465b-a1c3-657e7bf18aef',
          agentStudio: true,
        }}
      />
    </DocSearch>
  );
}
