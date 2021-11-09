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
        appId="R2IYF7ETH7"
        apiKey="599cec31baffa4868cae4e79f180729b"
      />
    </div>
  );
}

export default App;
