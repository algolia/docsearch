/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';

import type { DemoTheme } from '../App';
import { API_KEY, APP_ID, SEARCH_INDEX_NAME } from '../constants';

export default function Basic({ theme }: { theme: DemoTheme }): JSX.Element {
  return (
    <DocSearch
      indices={[SEARCH_INDEX_NAME]}
      appId={APP_ID}
      apiKey={API_KEY}
      translations={{ button: { buttonText: 'Keyword search' } }}
      insights={true}
      theme={theme}
      facets={[
        { key: 'language', label: 'Language' },
        { key: 'version', label: 'Version' },
        { key: 'type', label: 'Content type' },
      ]}
    />
  );
}
