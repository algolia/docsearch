import { render, within } from '@testing-library/react';
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
          input: { index: 'docs', query: 'test', number_of_results: 10, facet_filters: [] },
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
          input: { index: 'docs', query: 'test' },
          output: { hits: [{}] },
        },
        expectedHits: 1,
      },
      {
        description: 'tool-algolia_search_index with nbHits over hits length',
        part: {
          type: 'tool-algolia_search_index',
          toolCallId: 'id-5',
          state: 'output-available',
          input: { index: 'docs', query: 'test' },
          output: { hits: [{}], nbHits: 42 },
        },
        expectedHits: 42,
      },
    ] satisfies Array<{ description: string; part: AIToolPart; expectedHits: number }>)(
      'displays $expectedHits results for $description',
      ({ part, expectedHits }) => {
        const { container } = render(<ToolCall part={part} translations={TRANSLATIONS} />);

        expect(within(container).getByText(`found ${expectedHits} results`, { exact: false })).toBeInTheDocument();
      },
    );

    it.each([
      {
        description: 'no output',
        part: {
          type: 'tool-algolia_search_index',
          toolCallId: 'id-6',
          state: 'output-available',
          input: { queries: [{ query: 'test' }], clickAnalytics: false, originalQuery: 'test' },
          output: undefined,
        },
        expectedQueries: ['test'],
      },
      {
        description: 'multiple queries sharing one hits array',
        part: {
          type: 'tool-algolia_search_index',
          toolCallId: 'id-7',
          state: 'output-available',
          input: {
            queries: [{ query: 'first' }, { query: 'second' }],
            clickAnalytics: false,
            originalQuery: 'original',
          },
          output: { hits: [{}, {}, {}, {}, {}] },
        },
        expectedQueries: ['first', 'second'],
      },
    ] satisfies Array<{ description: string; part: AIToolPart; expectedQueries: string[] }>)(
      'omits the result count for V2 input with $description',
      ({ part, expectedQueries }) => {
        const { container } = render(<ToolCall part={part} translations={TRANSLATIONS} />);

        expectedQueries.forEach((query) => expect(container).toHaveTextContent(`"${query}"`));
        expect(container).not.toHaveTextContent('found');
      },
    );
  });

  describe('query rendering', () => {
    it.each([
      {
        description: 'V1 input query while searching',
        part: {
          type: 'tool-algolia_search_index',
          toolCallId: 'id-1',
          state: 'input-available',
          input: { index: 'docs', query: 'v1 query' },
        },
        expectedText: 'Searching for "v1 query" ...',
      },
      {
        description: 'V2 input query while searching',
        part: {
          type: 'tool-algolia_search_index',
          toolCallId: 'id-2',
          state: 'input-available',
          input: { queries: [{ query: 'v2 query' }], clickAnalytics: false, originalQuery: 'original' },
        },
        expectedText: 'Searching for "v2 query" ...',
      },
      {
        description: 'searchIndex output query over input query',
        part: {
          type: 'tool-searchIndex',
          toolCallId: 'id-3',
          state: 'output-available',
          input: { query: 'input query' },
          output: { query: 'output query', hits: [] },
        },
        expectedText: '"output query"',
      },
    ] satisfies Array<{ description: string; part: AIToolPart; expectedText: string }>)(
      'renders $description',
      ({ part, expectedText }) => {
        const { container } = render(<ToolCall part={part} translations={TRANSLATIONS} />);

        expect(container).toHaveTextContent(expectedText);
      },
    );
  });
});
