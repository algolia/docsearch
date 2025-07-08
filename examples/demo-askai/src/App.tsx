/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';
import './App.css';
import '@docsearch/css/dist/style.css';

function App(): JSX.Element {
  return (
    <div>
      <h1>DocSearch v4 - AskAI</h1>
      <DocSearch
        indexName="docsearch"
        appId="PMZUYBQDAK"
        apiKey="24b09689d5b4223813d9b8e48563c8f6"
        askAi="askAIDemo"
        insights={true}
      />
    </div>
  );
}

export default App;
