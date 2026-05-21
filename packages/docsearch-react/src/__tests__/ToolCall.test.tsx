import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { ToolCall, type ToolCallTranslations } from '../components/ui/ToolCall';
import type { AIToolPart, ToolCalls } from '../types/AskiAi';

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
          input: {
            index: 'docs',
            query: 'test',
            number_of_results: 10,
            facet_filters: null,
          },
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
    ] satisfies Array<{
      description: string;
      part: AIToolPart;
      expectedHits: number;
    }>)('displays $expectedHits results for $description', ({ part, expectedHits }) => {
      render(<ToolCall part={part} translations={TRANSLATIONS} tools={{}} />);

      expect(screen.getByText(`found ${expectedHits} results`, { exact: false })).toBeInTheDocument();
    });
  });

  describe('custom tools', () => {
    it('renders the custom loading text while output is unavailable', () => {
      const part: AIToolPart = {
        type: 'tool-customAction',
        toolCallId: 'custom-tool-1',
        state: 'input-available',
        input: { value: 'test' },
      };
      const tools: ToolCalls = {
        customAction: {
          render: () => 'Custom tool finished',
          translations: { callingToolText: 'Running custom action' },
        },
      };

      render(<ToolCall part={part} translations={TRANSLATIONS} tools={tools} />);

      expect(screen.getByText('Running custom action')).toBeInTheDocument();
    });

    it('renders custom tool output with input and output', () => {
      const part: AIToolPart = {
        type: 'tool-customAction',
        toolCallId: 'custom-tool-2',
        state: 'output-available',
        input: { value: 'input value' },
        output: { result: 'output value' },
      };
      const renderToolOutput = vi.fn(() => 'Custom tool finished');
      const tools: ToolCalls = {
        customAction: {
          render: renderToolOutput,
        },
      };

      render(<ToolCall part={part} translations={TRANSLATIONS} tools={tools} />);

      expect(renderToolOutput).toHaveBeenCalledWith({
        message: {
          input: { value: 'input value' },
          output: { result: 'output value' },
        },
      });
      expect(screen.getByText('Custom tool finished')).toBeInTheDocument();
    });

    it('renders nothing for custom tool output errors', () => {
      const part: AIToolPart = {
        type: 'tool-customAction',
        toolCallId: 'custom-tool-3',
        state: 'output-error',
        input: { value: 'test' },
        errorText: 'Custom tool failed',
      };
      const tools: ToolCalls = {
        customAction: {
          render: () => 'Custom tool finished',
        },
      };

      const { container } = render(<ToolCall part={part} translations={TRANSLATIONS} tools={tools} />);

      expect(container).toBeEmptyDOMElement();
    });
  });
});
