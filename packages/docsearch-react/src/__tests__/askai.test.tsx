import { render } from '@testing-library/react';
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
  it('displays stream errors', () => {
    const { getByText } = render(
      <AskAiScreen {...baseProps} askAiStreamError={new Error('oh no')} askAiFetchError={undefined} />,
    );
    expect(getByText('oh no')).toBeInTheDocument();
  });
});
