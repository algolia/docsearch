import React, { useState } from 'react';
import './App.css';
import docsearch from 'docsearch.js';

function App() {
  return (
    <div>
      <DocSearch
        apiKey="05f2b9f825e93891445000c63e103290"
        indexName="francoischalifour"
      />
    </div>
  );
}

function DocSearch({ apiKey, indexName }) {
  const [hits, setHits] = useState({});

  const searchService = docsearch({
    apiKey,
    indexName,
    onResult: ({ hits }) => {
      setHits(hits);
    },
  });

  function onChange(event) {
    searchService.search({ query: event.target.value });
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
