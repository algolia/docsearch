import { DocSearch } from '@docsearch/react';
import React from 'react';
import './App.css';
import '@docsearch/css/dist/style.css';

function App(): React.JSX.Element {
  return (
    <div>
      <h1>DocSearch v4 - React - 18</h1>
      <DocSearch indexName="vuejs" appId="ML0LEBN7FQ" apiKey="21cf9df0734770a2448a9da64a700c22" insights={true} />
    </div>
  );
}

export default App;
