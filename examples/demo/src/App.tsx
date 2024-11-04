import { DocSearch } from '@docsearch/react';

import './App.css';
import '@docsearch/css/dist/style.css';

function App() {
  return (
    <div>
      <h1>DocSearch v3 - React</h1>
      <DocSearch
        indexName="vuejs"
        appId="ML0LEBN7FQ"
        apiKey="21cf9df0734770a2448a9da64a700c22"
        insights={true}
      />
    </div>
  );
}

export default App;
