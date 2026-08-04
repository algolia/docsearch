/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { SidepanelButton, Sidepanel } from '@docsearch/sidepanel';
import type { JSX } from 'react';

import type { DemoTheme } from '../App';
import { AGENT_ID, API_KEY, APP_ID } from '../constants';

export default function SidepanelExample({
  theme,
}: {
  theme: DemoTheme;
}): JSX.Element {
  return (
    <DocSearch appId={APP_ID} apiKey={API_KEY} theme={theme}>
      <SidepanelButton variant="inline" />
      <Sidepanel
        agentId={AGENT_ID}
        variant="floating"
        tools={{
          printConsoleMessage: {
            render({ message: { output } }) {
              if (!output) return '';

              return output as string;
            },
            async onToolCall({ input, addToolOutput }) {
              // eslint-disable-next-line no-console
              console.log((input as any).message);

              await addToolOutput({
                output: 'Check your console for a nice message :)',
              });
            },
          },
        }}
      />
    </DocSearch>
  );
}
