import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { AskAiScreen } from '../AskAiScreen';

const baseProps = {
  indexName: 'idx',
  inputRef: { current: null } as React.RefObject<HTMLInputElement>,
  recentSearches: { getAll: () => [], add: () => {} } as any,
  favoriteSearches: { getAll: () => [], add: () => {} } as any,
  conversations: { getAll: () => [], add: () => {} } as any,
  onAskAiToggle: () => {},
  onItemClick: () => {},
  setQuery: () => {},
  messages: [],
  status: 'ready' as const,
  disableUserPersonalization: false,
  resultsFooterComponent: null,
};

describe('AskAiScreen', () => {
  it('displays stream errors', () => {
    const { getByText } = render(
      <AskAiScreen {...baseProps} askAiStreamError={new Error('oh no')} askAiFetchError={undefined} />,
    );
    expect(getByText('oh no')).toBeInTheDocument();
  });
});
