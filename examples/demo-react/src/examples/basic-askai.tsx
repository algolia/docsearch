/* eslint-disable react/react-in-jsx-scope */
import { DocSearchAI, type ToolCalls } from '@docsearch/react';
import type { JSX } from 'react';

import type { DemoTheme } from '../App';
import { AGENT_ID, API_KEY, APP_ID, SEARCH_INDEX_NAME } from '../constants';

const customTools: ToolCalls = {
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
};

export default function BasicAskAI({
  theme,
}: {
  theme: DemoTheme;
}): JSX.Element {
  return (
    <DocSearchAI
      indices={[SEARCH_INDEX_NAME]}
      appId={APP_ID}
      apiKey={API_KEY}
      askAi={{
        agentId: AGENT_ID,
        suggestedQuestions: true,
        tools: customTools,
        promptSuggestions: {
          indexName: 'docsearch-markdown_prompt_suggestions',
        },
      }}
      facets={[
        { key: 'language', label: 'Language' },
        { key: 'version', label: 'Version' },
        { key: 'type', label: 'Content type' },
      ]}
      insights={true}
      translations={{ button: { buttonText: 'Search with Ask AI' } }}
      theme={theme}
      resultBadgeKey="type"
    />
  );
}
