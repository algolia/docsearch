import { cleanup, render } from '@testing-library/react';
import React, { type JSX } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ResultsScreen } from '../ResultsScreen';
import type { InternalDocSearchHit } from '../types';

function Hit({ children }: { children: React.ReactNode }): JSX.Element {
  return <>{children}</>;
}

function createHit(
  objectID: string,
  lvl0: string,
  parent: InternalDocSearchHit | null = null
): InternalDocSearchHit {
  const hit: InternalDocSearchHit = {
    objectID,
    content: null,
    url: `/${objectID}`,
    url_without_anchor: `/${objectID}`,
    type: parent ? 'content' : 'lvl1',
    anchor: null,
    hierarchy: {
      lvl0,
      lvl1: 'Installation',
      lvl2: null,
      lvl3: null,
      lvl4: null,
      lvl5: null,
      lvl6: null,
    },
    _highlightResult: {
      content: { value: '', matchLevel: 'none', matchedWords: [] },
      hierarchy: {
        lvl0: { value: lvl0, matchLevel: 'none', matchedWords: [] },
        lvl1: { value: 'Installation', matchLevel: 'none', matchedWords: [] },
        lvl2: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl3: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl4: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl5: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl6: { value: '', matchLevel: 'none', matchedWords: [] },
      },
      hierarchy_camel: [],
    },
    _snippetResult: {
      content: { value: '', matchLevel: 'none' },
      hierarchy: {
        lvl0: { value: lvl0, matchLevel: 'none', matchedWords: [] },
        lvl1: { value: 'Installation', matchLevel: 'none', matchedWords: [] },
        lvl2: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl3: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl4: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl5: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl6: { value: '', matchLevel: 'none', matchedWords: [] },
      },
      hierarchy_camel: [],
    },
    __docsearch_parent: parent,
  };

  return hit;
}

afterEach(() => {
  cleanup();
});

describe('ResultsScreen', () => {
  it('renders lvl0 headings and tree connectors for grouped child hits', () => {
    const parent = createHit('guide-install', 'Guides');
    const firstChild = createHit('guide-install-1', 'Guides', parent);
    const lastChild = createHit('guide-install-2', 'Guides', parent);
    const reference = createHit('reference-install', 'Reference');

    const props = {
      state: {
        activeItemId: null,
        collections: [
          {
            source: { sourceId: 'hits_docs_0' },
            items: [parent, firstChild, lastChild],
          },
          {
            source: { sourceId: 'hits_docs_1' },
            items: [reference],
          },
        ],
        completion: null,
        context: {},
        isOpen: true,
        query: 'install',
        status: 'idle',
      },
      getItemProps: vi.fn(() => ({})),
      getListProps: vi.fn(() => ({})),
      hitComponent: Hit,
      indexName: 'docs',
      inputRef: React.createRef<HTMLInputElement>(),
      onItemClick: vi.fn(),
      refresh: vi.fn(),
      setQuery: vi.fn(),
      recentSearches: { add: vi.fn(), remove: vi.fn() },
      favoriteSearches: { add: vi.fn(), remove: vi.fn() },
      conversations: { add: vi.fn(), remove: vi.fn() },
      disableUserPersonalization: false,
      hasCollections: true,
    } as any;

    render(<ResultsScreen {...props} />);

    expect(document.querySelector('.DocSearch-Hit-source')).toHaveTextContent(
      'Guides'
    );
    expect(
      document.querySelectorAll('.DocSearch-Hit-source')[1]
    ).toHaveTextContent('Reference');

    const connectorPaths = Array.from(
      document.querySelectorAll('.DocSearch-Hit-Tree path')
    ).map((path) => path.getAttribute('d'));

    expect(connectorPaths).toEqual(['M8 6v42M20 27H8.3', 'M8 6v21M20 27H8.3']);
  });
});
