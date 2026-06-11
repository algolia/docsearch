/* eslint-disable react/react-in-jsx-scope */
import { DocSearchAI } from '@docsearch/react';
import type { JSX } from 'react';

import type { DemoTheme } from '../App';

export default function BasicAskAI({ theme }: { theme: DemoTheme }): JSX.Element {
  return (
    <DocSearchAI
      indexName="docsearch"
      appId="PMZUYBQDAK"
      apiKey="24b09689d5b4223813d9b8e48563c8f6"
      askAi={{
        assistantId: 'ccdec697-e3fe-465b-a1c3-657e7bf18aef',
        suggestedQuestions: true,
      }}
      insights={true}
      translations={{ button: { buttonText: 'Search with Ask AI' } }}
      theme={theme}
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
  );
}
