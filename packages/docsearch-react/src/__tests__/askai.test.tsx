import { render, within } from '@testing-library/react';
import type { UIMessage } from 'ai';
import React from 'react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { AskAiScreen } from '../AskAiScreen';

const baseProps = {
  indexName: 'idx',
  inputRef: React.createRef<HTMLInputElement>(),
  recentSearches: { getAll: () => [], add: () => {} } as any,
  favoriteSearches: { getAll: () => [], add: () => {} } as any,
  conversations: { getAll: () => [], add: () => {} } as any,
  onAskAiToggle: (): void => {},
  onItemClick: (): void => {},
  setQuery: (): void => {},
  messages: [],
  status: 'ready' as const,
  disableUserPersonalization: false,
  resultsFooterComponent: null,
} as any;

describe('AskAiScreen', () => {
  it('displays stream errors in the latest exchange', () => {
    const messages: UIMessage[] = [
      {
        id: '1',
        role: 'user',
        parts: [
          {
            type: 'text',
            text: 'hello',
          },
        ],
      },
    ];

    const { getByText } = render(
      <AskAiScreen {...baseProps} messages={messages} status="error" askAiError={new Error('oh no')} />,
    );

    expect(getByText('oh no')).toBeInTheDocument();
  });

  it('surfaces thread depth (AI-217) with a banner and hides the generic chat error', () => {
    const messages: UIMessage[] = [
      {
        id: '1',
        role: 'user',
        parts: [{ type: 'text', text: 'first' }],
      },
      {
        id: '2',
        role: 'assistant',
        parts: [{ type: 'text', text: 'answer' }],
      },
      {
        id: '3',
        role: 'user',
        parts: [{ type: 'text', text: 'follow-up' }],
      },
    ];

    const onNewConversation = (): void => {};

    const { container, getByText } = render(
      <AskAiScreen
        {...baseProps}
        messages={messages}
        status="error"
        askAiError={new Error('AI-217 - Thread depth exceeded')}
        onNewConversation={onNewConversation}
      />,
    );

    expect(
      getByText('This conversation is now closed to keep responses accurate.', { exact: false }),
    ).toBeInTheDocument();
    expect(getByText('Start a new conversation')).toBeInTheDocument();
    // Bound queries from `render()` use `baseElement` (often `document.body`), so a prior test can still
    // match. Restrict to this instance's root so we only assert on this tree.
    expect(within(container).queryByText('Chat error')).not.toBeInTheDocument();
  });
});
