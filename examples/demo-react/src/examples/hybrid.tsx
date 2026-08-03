/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { DocSearchButton, DocSearchAskAiModal } from '@docsearch/modal';
import { Sidepanel, SidepanelButton } from '@docsearch/sidepanel';
import type { JSX } from 'react';

import type { DemoTheme } from '../App';

export default function BasicHybrid({
  theme,
}: {
  theme: DemoTheme;
}): JSX.Element {
  return (
    <DocSearch theme={theme}>
      <DocSearchButton />
      <DocSearchAskAiModal
        indices={['docsearch']}
        appId="PMZUYBQDAK"
        apiKey="24b09689d5b4223813d9b8e48563c8f6"
        askAi="ccdec697-e3fe-465b-a1c3-657e7bf18aef"
      />

      <SidepanelButton />
      <Sidepanel
        appId="PMZUYBQDAK"
        apiKey="24b09689d5b4223813d9b8e48563c8f6"
        agentId="ccdec697-e3fe-465b-a1c3-657e7bf18aef"
      />
    </DocSearch>
  );
}
