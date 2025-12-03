import { render } from '@testing-library/react';
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
});
