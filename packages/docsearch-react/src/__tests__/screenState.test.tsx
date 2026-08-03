import { cleanup, render, screen } from '@testing-library/react';
import React, { type JSX } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { AskAiScreenState } from '../AskAiScreenState';
import { ScreenState } from '../ScreenState';

function Hit({ children }: { children: React.ReactNode }): JSX.Element {
  return <>{children}</>;
}

function createState(overrides = {}): any {
  return {
    activeItemId: null,
    collections: [],
    completion: null,
    context: { searchSuggestions: [] },
    isOpen: true,
    query: 'old query',
    status: 'idle',
    ...overrides,
  };
}

function createProps(overrides = {}): any {
  return {
    state: createState(),
    recentSearches: { add: vi.fn(), remove: vi.fn() },
    favoriteSearches: { add: vi.fn(), remove: vi.fn() },
    conversations: { add: vi.fn(), remove: vi.fn() },
    getItemProps: vi.fn(() => ({})),
    getListProps: vi.fn(() => ({})),
    inputRef: React.createRef<HTMLInputElement>(),
    onItemClick: vi.fn(),
    refresh: vi.fn(),
    setQuery: vi.fn(),
    hitComponent: Hit,
    indexName: 'docs',
    disableUserPersonalization: false,
    resultsFooterComponent: () => null,
    translations: {},
    hasCollections: false,
    ...overrides,
  };
}

function createAskAiProps(overrides = {}): any {
  return {
    ...createProps(),
    askAiState: 'initial',
    canHandleAskAi: true,
    isAskAiActive: false,
    messages: [],
    onAskAiToggle: vi.fn(),
    onNewConversation: vi.fn(),
    selectAskAiQuestion: vi.fn(),
    selectSuggestedQuestion: vi.fn(),
    status: 'ready',
    suggestedQuestions: [],
    tools: [],
    ...overrides,
  };
}

afterEach(() => {
  cleanup();
});

describe('ScreenState', () => {
  it('keeps the current screen until collections for a new query arrive', () => {
    const collections = [];
    const props = createProps({ state: createState({ collections }) });
    const view = render(<ScreenState {...props} />);

    expect(screen.getByText(/No results found for/)).toHaveTextContent(
      'old query'
    );

    view.rerender(
      <ScreenState
        {...props}
        state={createState({ collections, query: 'new query' })}
      />
    );

    expect(screen.getByText(/No results found for/)).toHaveTextContent(
      'old query'
    );

    view.rerender(
      <ScreenState
        {...props}
        state={createState({
          collections: [{ items: [], source: { sourceId: 'hits_docs' } }],
          query: 'new query',
        })}
      />
    );

    expect(screen.getByText(/No results found for/)).toHaveTextContent(
      'new query'
    );
  });

  it('keeps the current screen while loading or stalled', () => {
    const collections = [];
    const props = createProps({ state: createState({ collections }) });
    const view = render(<ScreenState {...props} />);

    view.rerender(
      <ScreenState
        {...props}
        state={createState({
          collections,
          query: 'loading query',
          status: 'loading',
        })}
      />
    );

    expect(screen.getByText(/No results found for/)).toHaveTextContent(
      'old query'
    );

    view.rerender(
      <ScreenState
        {...props}
        state={createState({
          collections,
          query: 'stalled query',
          status: 'stalled',
        })}
      />
    );

    expect(screen.getByText(/No results found for/)).toHaveTextContent(
      'old query'
    );
  });

  it('renders the start screen when the query is cleared', () => {
    const props = createProps();
    const view = render(<ScreenState {...props} />);

    view.rerender(
      <ScreenState {...props} state={createState({ query: '' })} />
    );

    expect(screen.queryByText(/No results found for/)).not.toBeInTheDocument();
    expect(
      document.querySelector('.DocSearch-Dropdown-Container')
    ).toBeInTheDocument();
  });
});

describe('AskAiScreenState', () => {
  it('leaves Ask AI when the active mode changes during a pending search', () => {
    const collections = [];
    const props = createAskAiProps({
      isAskAiActive: true,
      state: createState({ collections }),
    });
    const view = render(<AskAiScreenState {...props} />);

    expect(document.querySelector('.DocSearch-AskAiScreen')).toBeInTheDocument();

    view.rerender(
      <AskAiScreenState
        {...props}
        isAskAiActive={false}
        state={createState({ collections, query: 'new query' })}
      />
    );

    expect(
      document.querySelector('.DocSearch-AskAiScreen')
    ).not.toBeInTheDocument();
    expect(screen.getByText(/No results found for/)).toHaveTextContent(
      'new query'
    );
  });

  it('rerenders when the Ask AI screen state changes', () => {
    const props = createAskAiProps({
      askAiState: 'new-conversation',
      isAskAiActive: true,
    });
    const view = render(<AskAiScreenState {...props} />);

    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();

    view.rerender(<AskAiScreenState {...props} askAiState="initial" />);

    expect(
      screen.queryByText('How can I help you today?')
    ).not.toBeInTheDocument();
    expect(document.querySelector('.DocSearch-AskAiScreen')).toBeInTheDocument();
  });
});
