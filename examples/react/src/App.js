import React, { useState } from 'react';
import docsearch from 'docsearch.js-core';

import './App.css';
import './DocSearch.css';

function App() {
  return (
    <DocSearch apiKey="3949f721e5d8ca1de8928152ff745b28" indexName="yarnpkg" />
  );
}

function DocSearch({ apiKey, indexName }) {
  const [hits, setHits] = useState({});

  const docsearchIndex = docsearch({
    apiKey,
    indexName,
  });

  async function onChange(event) {
    const { hits } = await docsearchIndex.search({
      query: event.target.value,
      filters: 'lang:en',
    });

    setHits(hits);
  }

  return (
    <div className="App">
      <input
        placeholder="Search the documentation"
        onChange={onChange}
        style={{
          padding: 12,
          border: '1px solid #ddd',
          borderRadius: 3,
          font: 'inherit',
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.16)',
          width: '100%',
          maxWidth: 500,
          marginBottom: '1rem',
        }}
      />

      <pre>{JSON.stringify(hits, null, 2)}</pre>
    </div>
  );
}

export default App;
