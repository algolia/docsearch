/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';

import type { DemoTheme } from '../App';

export default function MultiIndex({ theme }: { theme: DemoTheme }): JSX.Element {
  return (
    <DocSearch
      indices={[
        {
          name: 'docsearch',
        },
        {
          name: 'tailwindcss',
        },
        {
          name: 'kubernetes',
        },
      ]}
      appId="PMZUYBQDAK"
      apiKey="24b09689d5b4223813d9b8e48563c8f6"
      translations={{ button: { buttonText: 'Multi index search' } }}
      insights={true}
      theme={theme}
    />
  );
}
