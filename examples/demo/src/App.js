import React from 'react';
import { DocSearch } from '@docsearch/react';

import './app.css';
import '@docsearch/css';

function App() {
  return (
    <div>
      <h1>DocSearch v3 - React</h1>
      <DocSearch
        indexName="docsearch"
        apiKey="25626fae796133dc1e734c6bcaaeac3c"
      />
    </div>
  );
}

export default App;
