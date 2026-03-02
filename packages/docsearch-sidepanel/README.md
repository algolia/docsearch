# @docsearch/sidepanel

React package for [DocSearch Sidepanel](http://docsearch.algolia.com/), a standalone Ask AI chat panel.

## Installation

```bash
# or
npm install @docsearch/core@4 @docsearch/sidepanel@4 @docsearch/css@4
```

If you don’t want to use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@docsearch/sidepanel-js"></script>
```

## Get started

DocSearch Sidepanel generates a fully accessible Ask AI chat panel for you.

```jsx App.js
import { DocSearch } from '@docsearch/core';
import { SidepanelButton, Sidepanel } from '@docsearch/sidepanel';

// Or using individual imports:
// import { Sidepanel } from '@docsearch/sidepanel/sidepanel';
// import { SidepanelButton } from '@docsearch/sidepanel/button';

import '@docsearch/css/dist/style.css';
import '@docsearch/css/dist/sidepanel.css';

function App() {
  return (
    <DocSearch>
      <SidepanelButton />
      <Sidepanel
        appId="YOUR_APP_ID"
        indexName="YOUR_INDEX_NAME"
        apiKey="YOUR_SEARCH_API_KEY"
        assistantId="YOUR_ASK_AI_ASSISTANT_ID"
      />
    </DocSearch>
  );
}
```

## Documentation

[Read documentation →](https://docsearch.algolia.com)
