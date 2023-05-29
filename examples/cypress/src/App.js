import React from 'react';
import { DocSearch } from '@docsearch/react';

import './app.css';
import '@docsearch/css';

function App() {
  return (
    <div>
      <h1>DocSearch v3 - React</h1>
      <button data-testid="btn">A button</button>
      <DocSearch
        indexName="docsearch"
        appId="R2IYF7ETH7"
        apiKey="599cec31baffa4868cae4e79f180729b"
        transformItems={
          (items) => { // transform absolute url into relative ones to solve CORS problem in cypress
            return items.map((item) => {
              const { origin } = new URL(item.url);
              return {
                ...item,
                url: item.url.replace(new RegExp(`^${origin}`), ''),
              };
            })
          }
        }
      />
    </div>
  );
}

export default App;
