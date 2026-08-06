import { fireEvent, render, screen, within } from '@testing-library/react';
import type { UIMessage } from 'ai';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { AskAiScreen } from '../AskAiScreen';
import { PromptForm } from '../Sidepanel/PromptForm';

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

  it('shows cost-control errors in a blocking banner', () => {
    const messages: UIMessage[] = [
      {
        id: '1',
        role: 'user',
        parts: [{ type: 'text', text: 'hello' }],
      },
    ];
    const onNewConversation = vi.fn();
    const { container } = render(
      <AskAiScreen
        {...baseProps}
        messages={messages}
        status="error"
        askAiError={new Error('Too many requests (AI-205)')}
        onNewConversation={onNewConversation}
      />
    );

    expect(
      within(container).getByText('Too many requests')
    ).toBeInTheDocument();
    expect(within(container).queryByText('Chat error')).not.toBeInTheDocument();
    expect(within(container).getByText('hello')).toBeInTheDocument();

    fireEvent.click(
      within(container).getByRole('button', {
        name: 'Start a new conversation',
      })
    );
    expect(onNewConversation).toHaveBeenCalledTimes(1);
  });

  it('does not offer a new conversation for token output errors', () => {
    const messages: UIMessage[] = [
      {
        id: '1',
        role: 'user',
        parts: [{ type: 'text', text: 'hello' }],
      },
    ];
    const error = new Error(
      JSON.stringify({
        error: 'Could not complete response due to token output limits',
        type: 'TokenOutputLimitError',
      })
    );
    const { container } = render(
      <AskAiScreen
        {...baseProps}
        messages={messages}
        status="error"
        askAiError={error}
      />
    );

    expect(
      within(container).getByText(
        'Could not complete response due to token output limits'
      )
    ).toBeInTheDocument();
    expect(
      within(container).queryByRole('button', {
        name: 'Start a new conversation',
      })
    ).not.toBeInTheDocument();
  });
});

describe('Sidepanel PromptForm', () => {
  it('shows a blocking error and recovery action', () => {
    const onStartNewConversation = vi.fn();

    const { container } = render(
      <PromptForm
        exchanges={[]}
        isStreaming={false}
        blockingErrorMessage="Rate limit exceeded"
        showBlockingError={true}
        onSend={vi.fn()}
        onStopStreaming={vi.fn()}
        onStartNewConversation={onStartNewConversation}
      />
    );

    expect(within(container).getByRole('alert')).toHaveTextContent(
      'Rate limit exceeded'
    );
    expect(within(container).getByRole('textbox')).toHaveAttribute('readonly');
    expect(within(container).getByRole('textbox')).toHaveAttribute(
      'aria-disabled',
      'true'
    );

    fireEvent.click(
      within(container).getByRole('button', {
        name: 'Start a new conversation',
      })
    );
    expect(onStartNewConversation).toHaveBeenCalledTimes(1);
  });

  it('does not submit a draft while blocked', () => {
    const onSend = vi.fn();
    const props = {
      exchanges: [],
      isStreaming: false,
      onSend,
      onStopStreaming: vi.fn(),
      onStartNewConversation: vi.fn(),
    };
    const { container, rerender } = render(<PromptForm {...props} />);
    const input = within(container).getByRole('textbox');

    fireEvent.change(input, { target: { value: 'draft question' } });
    rerender(<PromptForm {...props} showBlockingError={true} />);
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSend).not.toHaveBeenCalled();
    expect(input).toHaveValue('draft question');
  });
});
