/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';

export default function WTransformItems(): JSX.Element {
  return (
    <DocSearch
      indexName="crawler_doc"
      appId="PMZUYBQDAK"
      apiKey="24b09689d5b4223813d9b8e48563c8f6"
      insights={true}
      transformItems={(items: any) => {
        return items.map((item: any) => ({
          ...item,
          hierarchy: {
            lvl0: item.title ?? '',
            lvl1: item.h1 ?? '',
            lvl2: item.h2 ?? '',
          },
          content: item.content ?? '',
        }));
      }}
      translations={{ button: { buttonText: 'Search with transformItems' } }}
    />
  );
}
