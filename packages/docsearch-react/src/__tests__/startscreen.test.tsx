import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React, { type JSX } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

import { AskAiStartScreen } from '../components/AskAiStartScreen';
import { KeywordStartScreen } from '../components/KeywordStartScreen';
import { RecentConversationsResults } from '../components/ui/RecentConversationsResults';
import { StoredSearchesSections } from '../components/ui/StoredSearchesSections';
import type { InternalDocSearchHit, StoredAskAiState } from '../types';
import { SOURCE_IDS } from '../utils';

afterEach(() => {
  cleanup();
});

function createHit(objectID: string, title: string): InternalDocSearchHit {
  return {
    objectID,
    content: null,
    url: `https://example.com/${objectID}`,
    url_without_anchor: `https://example.com/${objectID}`,
    type: 'lvl1',
    anchor: null,
    hierarchy: {
      lvl0: 'Docs',
      lvl1: title,
      lvl2: null,
      lvl3: null,
      lvl4: null,
      lvl5: null,
      lvl6: null,
    },
    _highlightResult: {
      content: { value: '', matchLevel: 'none', matchedWords: [] },
      hierarchy: {
        lvl0: { value: 'Docs', matchLevel: 'none', matchedWords: [] },
        lvl1: { value: title, matchLevel: 'none', matchedWords: [] },
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
        lvl0: { value: 'Docs', matchLevel: 'none', matchedWords: [] },
        lvl1: { value: title, matchLevel: 'none', matchedWords: [] },
        lvl2: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl3: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl4: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl5: { value: '', matchLevel: 'none', matchedWords: [] },
        lvl6: { value: '', matchLevel: 'none', matchedWords: [] },
      },
      hierarchy_camel: [],
    },
    __docsearch_parent: null,
  };
}

function createCollection(sourceId: string, items: InternalDocSearchHit[]): unknown {
  return {
    source: { sourceId },
    items,
  };
}

function Hit({ children }: { children: React.ReactNode }): JSX.Element {
  return <>{children}</>;
}

function createProps(collections: unknown[]) {
  return {
    state: {
      collections,
      query: '',
      status: 'idle',
    },
    recentSearches: {
      add: vi.fn(),
      remove: vi.fn(),
    },
    favoriteSearches: {
      add: vi.fn(),
      remove: vi.fn(),
    },
    conversations: {
      add: vi.fn(),
      remove: vi.fn(),
    },
    refresh: vi.fn(),
    getListProps: vi.fn(() => ({})),
    getItemProps: vi.fn(({ onClick }) => ({ onClick })),
    onItemClick: vi.fn(),
    inputRef: React.createRef<HTMLInputElement>(),
    hitComponent: Hit,
    indexName: 'docs',
    disableUserPersonalization: false,
    resultsFooterComponent: null,
    hasCollections: true,
  } as any;
}

describe('start screen components', () => {
  it('renders stored searches and runs save/remove actions', () => {
    const recentHit = createHit('recent', 'Recent result');
    const favoriteHit = createHit('favorite', 'Favorite result');
    const props = createProps([
      createCollection(SOURCE_IDS.recentSearches, [recentHit]),
      createCollection(SOURCE_IDS.favoriteSearches, [favoriteHit]),
    ]);

    render(<StoredSearchesSections {...props} />);

    expect(screen.getByText('Recent result')).toBeInTheDocument();
    expect(screen.getByText('Favorite result')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Pin this search'));
    expect(props.favoriteSearches.add).toHaveBeenCalledWith(recentHit);
    expect(props.recentSearches.remove).toHaveBeenCalledWith(recentHit);

    fireEvent.click(screen.getByTitle('Remove this search from history'));
    expect(props.recentSearches.remove).toHaveBeenCalledWith(recentHit);

    fireEvent.click(screen.getByTitle('Remove this saved search'));
    expect(props.favoriteSearches.remove).toHaveBeenCalledWith(favoriteHit);
    expect(props.refresh).toHaveBeenCalledTimes(3);
  });

  it('renders recent conversations and removes them', () => {
    const conversation = createHit('conversation', 'Conversation result') as InternalDocSearchHit & StoredAskAiState;
    const props = createProps([
      createCollection(SOURCE_IDS.recentSearches, []),
      createCollection(SOURCE_IDS.favoriteSearches, []),
      createCollection(SOURCE_IDS.recentConversations, [conversation]),
    ]);

    render(<RecentConversationsResults {...props} />);

    expect(screen.getByText('Conversation result')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Remove this conversation from history'));
    expect(props.conversations.remove).toHaveBeenCalledWith(conversation);
    expect(props.refresh).toHaveBeenCalledTimes(1);
  });

  it('keeps the keyword start screen scoped to stored searches', () => {
    const props = createProps([
      createCollection(SOURCE_IDS.recentSearches, []),
      createCollection(SOURCE_IDS.favoriteSearches, []),
      createCollection(SOURCE_IDS.recentConversations, [createHit('conversation', 'Conversation result')]),
    ]);

    render(
      <KeywordStartScreen
        {...props}
        translations={{
          recentSearchesTitle: 'Search history',
          noRecentSearchesText: 'Nothing yet',
        }}
      />,
    );

    expect(screen.queryByText('Recent conversations')).not.toBeInTheDocument();
  });

  it('composes stored searches and recent conversations for Ask AI', () => {
    const props = createProps([
      createCollection(SOURCE_IDS.recentSearches, []),
      createCollection(SOURCE_IDS.favoriteSearches, []),
      createCollection(SOURCE_IDS.recentConversations, [createHit('conversation', 'Conversation result')]),
    ]);

    render(
      <AskAiStartScreen
        {...props}
        translations={{
          noRecentSearchesText: 'No saved searches',
          recentConversationsTitle: 'Recent chats',
          removeRecentConversationButtonTitle: 'Remove chat',
        }}
      />,
    );

    expect(screen.getByText('Recent chats')).toBeInTheDocument();
    expect(screen.getByText('Conversation result')).toBeInTheDocument();
    expect(screen.getByTitle('Remove chat')).toBeInTheDocument();
  });
});
