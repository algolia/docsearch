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
        apiKey="a7b0d142f53e8b9e6868c4fdbc4374e7"
        datasourceId="crawler_rag_beta-react-rag"
        promptId="crawler_rag_beta-react-rag"
        insights={true}
      />
    </div>
  );
}

export default App;
