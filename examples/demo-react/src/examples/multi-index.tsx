/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';

import type { DemoTheme } from '../App';
import { API_KEY, APP_ID, SEARCH_INDEX_NAME } from '../constants';

export default function MultiIndex({
  theme,
}: {
  theme: DemoTheme;
}): JSX.Element {
  return (
    <DocSearch
      indices={[
        {
          name: SEARCH_INDEX_NAME,
        },
        {
          name: 'tailwindcss',
        },
        {
          name: 'kubernetes',
        },
      ]}
      appId={APP_ID}
      apiKey={API_KEY}
      translations={{ button: { buttonText: 'Multi index search' } }}
      insights={true}
      theme={theme}
    />
  );
}
