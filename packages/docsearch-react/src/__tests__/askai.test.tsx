import { fireEvent, render, screen } from '@testing-library/react';
import type { UIMessage } from 'ai';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
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
  tools: {},
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
      <AskAiScreen
        {...baseProps}
        messages={messages}
        status="error"
        askAiError={new Error('oh no')}
      />
    );

    expect(getByText('oh no')).toBeInTheDocument();
  });

  it('copies all assistant text parts around tool calls', () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const messages: UIMessage[] = [
      {
        id: 'user-1',
        role: 'user',
        parts: [{ type: 'text', text: 'What is Docusaurus?' }],
      },
      {
        id: 'assistant-1',
        role: 'assistant',
        parts: [
          { type: 'text', text: 'Let me look that up.', state: 'done' },
          {
            type: 'tool-algolia_search_index',
            toolCallId: 'tool-1',
            state: 'output-available',
            input: { query: 'Docusaurus', index: 'docs' },
            output: { hits: [] },
          },
          {
            type: 'text',
            text: 'Docusaurus is a static site generator.',
            state: 'done',
          },
        ],
      },
    ];

    render(<AskAiScreen {...baseProps} messages={messages} />);

    fireEvent.click(screen.getByTitle('Copy'));

    expect(writeText).toHaveBeenCalledWith(
      'Let me look that up.\n\nDocusaurus is a static site generator.'
    );
  });
});
