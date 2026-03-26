import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { ToolCall, type ToolCallTranslations } from '../ToolCall';
import type { AIToolPart } from '../types/AskiAi';

const TRANSLATIONS: ToolCallTranslations = {
  preToolCallText: 'Searching for',
  searchingText: 'Searching...',
  toolCallResultText: 'Searched',
};

describe('ToolCall', () => {
  describe('number of hits rendering', () => {
    it.each([
      {
        description: 'tool-searchIndex with hits array',
        part: {
          type: 'tool-searchIndex',
          toolCallId: 'id-1',
          state: 'output-available',
          input: { query: 'test' },
          output: { query: 'test', hits: [{}, {}, {}] },
        },
        expectedHits: 3,
      },
      {
        description: 'tool-searchIndex with empty hits',
        part: {
          type: 'tool-searchIndex',
          toolCallId: 'id-2',
          state: 'output-available',
          input: { query: 'test' },
          output: { query: 'test', hits: [] },
        },
        expectedHits: 0,
      },
      {
        description: 'tool-algolia_search_index with nbHits',
        part: {
          type: 'tool-algolia_search_index',
          toolCallId: 'id-3',
          state: 'output-available',
          input: { index: 'docs', query: 'test', number_of_results: 10, facet_filters: null },
          output: { hits: [{}, {}] },
        },
        expectedHits: 2,
      },
      {
        description: 'tool-algolia_search_index_custom with results array',
        part: {
          type: 'tool-algolia_search_index_custom',
          toolCallId: 'id-4',
          state: 'output-available',
          input: { query: 'test' },
          output: { hits: [{}] },
        },
        expectedHits: 1,
      },
    ] satisfies Array<{ description: string; part: AIToolPart; expectedHits: number }>)(
      'displays $expectedHits results for $description',
      ({ part, expectedHits }) => {
        render(<ToolCall part={part} translations={TRANSLATIONS} />);

        expect(screen.getByText(`found ${expectedHits} results`, { exact: false })).toBeInTheDocument();
      },
    );
  });
});
