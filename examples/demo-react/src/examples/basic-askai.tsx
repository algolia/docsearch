/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';

export default function BasicAskAI(): JSX.Element {
  return (
    <DocSearch
      indexName="React Docs"
      appId="betaDCVKGIDYYD"
      apiKey="a53774491e2a0b9d92ea6da719cf46b2"
      askAi={{
        assistantId: 'O7o81mRwDQ3d',
        suggestedQuestions: true,
      }}
      insights={true}
      translations={{ button: { buttonText: 'Search with Ask AI' } }}
    />
  );
}
