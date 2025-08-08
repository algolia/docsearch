/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/react';
import type { JSX } from 'react';

// this type matches the structure of the provided example hit
/* type _DocSearchCustomHit = {
  path: string;
  metaDescription: string;
  title: string;
  h1: string;
  h2: string;
  content: string;
  breadcrumb: string[];
  variation: Record<string, unknown>;
  pageDepth: number;
  domain: string;
  objectID: string;
  _snippetResult: any;
  _highlightResult: any;
}; */

export default function WTransformItems(): JSX.Element {
  return (
    <DocSearch
      indexName="crawler_doc"
      appId="PMZUYBQDAK"
      apiKey="24b09689d5b4223813d9b8e48563c8f6"
      askAi={{
        assistantId: 'askAIDemo',
      }}
      insights={true}
      searchParameters={{
        attributesToRetrieve: ['*'],
        attributesToSnippet: ['*'],
        hitsPerPage: 20,
      }}
      transformItems={(items) => {
        return items.map((item: any) => ({
          objectID: item.objectID,
          content: item.content ?? '',
          url: new URL(item.domain + item.path).toString(),
          hierarchy: {
            lvl0: item.breadcrumb.join(' > ') ?? '',
            lvl1: item.h1 ?? '',
            lvl2: item.h2 ?? '',
            lvl3: null,
            lvl4: null,
            lvl5: null,
            lvl6: null,
          },
          url_without_anchor: new URL(item.domain + item.path).toString(),
          type: 'content' as const,
          anchor: null,
          _highlightResult: item._highlightResult,
          _snippetResult: item._snippetResult,
        }));
      }}
      translations={{ button: { buttonText: 'Search with transformItems' } }}
    />
  );
}
