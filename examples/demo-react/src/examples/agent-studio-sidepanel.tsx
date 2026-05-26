/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { SidepanelButton } from '@docsearch/sidepanel/button';
import { Sidepanel } from '@docsearch/sidepanel/sidepanel';
import type { JSX } from 'react';

export default function AgentStudioSidepanel(): JSX.Element {
  return (
    <DocSearch>
      <SidepanelButton
        variant="inline"
        translations={{
          buttonText: 'Agent Studio',
        }}
      />
      <Sidepanel
        indexName="docsearch-markdown"
        appId="PMZUYBQDAK"
        apiKey="a00716d83c64f6c61905c078b7d5ab66"
        assistantId="ccdec697-e3fe-465b-a1c3-657e7bf18aef"
        agentStudio={true}
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
