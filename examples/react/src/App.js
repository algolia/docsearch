import React, { useState } from 'react';
import './App.css';
import docsearch from 'docsearch.js';

function App() {
  return (
    <div>
      <DocSearch
        apiKey="25626fae796133dc1e734c6bcaaeac3c"
        indexName="docsearch"
      />
    </div>
  );
}

function DocSearch({ apiKey, indexName }) {
  const [hits, setHits] = useState({});

  const searchService = docsearch({
    apiKey,
    indexName,
  });

  async function onChange(event) {
    const { hits } = await searchService.search({ query: event.target.value });

    setHits(hits);
  }

  return (
    <div>
      <input onChange={onChange} />
      <div>
        <h1>Results</h1>
        <pre>{JSON.stringify(hits, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
