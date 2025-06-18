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
        indexName="beta-react"
        appId="betaHAXPMHIMMC"
        apiKey="8b00405cba281a7d800ccec393e9af24"
        askAi={true}
        insights={true}
      />
    </div>
  );
}

export default App;
