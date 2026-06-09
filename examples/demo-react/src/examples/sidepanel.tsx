/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { SidepanelButton, Sidepanel } from '@docsearch/sidepanel';
import type { JSX } from 'react';

import type { DemoTheme } from '../App';

export default function SidepanelExample({ theme }: { theme: DemoTheme }): JSX.Element {
  return (
    <DocSearch theme={theme}>
      <SidepanelButton variant="inline" />
      <Sidepanel
        indexName="docsearch"
        appId="PMZUYBQDAK"
        apiKey="24b09689d5b4223813d9b8e48563c8f6"
        assistantId="ccdec697-e3fe-465b-a1c3-657e7bf18aef"
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
