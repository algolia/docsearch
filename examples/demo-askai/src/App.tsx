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
        indexName="INDEX_NAME"
        appId="APP_ID"
        apiKey="KEY"
        askAi={{
          assistantId: 'askAIDemo',
          searchParameters: {
            facetFilters: ['language:en'],
          },
        }}
        insights={true}
        fieldMapping={{
          content: 'body_safe',
          url: (record) => `/help/articles/${record.objectID}`,
          hierarchy: {
            lvl0: 'category.title',          // Uses dot notation - simpler
            lvl1: 'section.title',           // Access nested properties directly
            lvl2: 'title'
          },
          metadata: {
            locale: 'locale.locale',         // "en-gb"
            language: 'locale.name',         // "British English"
            fullPath: 'section.full_path',   // "In-store FAQs > Technical advice and support"
            voteSum: 'vote_sum',
            promoted: 'promoted'
          }
        }}
        recordMapperConfig={{
          maxContentLength: 180
        }}
      />
    </div>
  );
}

export default App;
