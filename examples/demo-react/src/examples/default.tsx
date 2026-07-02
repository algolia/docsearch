/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';

export default function DefaultExperience(): JSX.Element {
  return <DocSearch indexName="docsearch" appId="PMZUYBQDAK" apiKey="24b09689d5b4223813d9b8e48563c8f6" />;
}
