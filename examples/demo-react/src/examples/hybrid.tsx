/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { DocSearchButton, DocSearchAskAiModal } from '@docsearch/modal';
import { Sidepanel, SidepanelButton } from '@docsearch/sidepanel';
import type { JSX } from 'react';

import type { DemoTheme } from '../App';
import { AGENT_ID, API_KEY, APP_ID } from '../constants';

export default function BasicHybrid({
  theme,
}: {
  theme: DemoTheme;
}): JSX.Element {
  return (
    <DocSearch appId={APP_ID} apiKey={API_KEY} theme={theme}>
      <DocSearchButton />
      <DocSearchAskAiModal askAi={AGENT_ID} indices={['docsearch']} />

      <SidepanelButton />
      <Sidepanel agentId={AGENT_ID} />
    </DocSearch>
  );
}
