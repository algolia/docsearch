import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { afterEach, describe, it, expect, vi } from 'vitest';

import type { AIToolPart, MemoryToolPart, ToolCalls } from '../../types/AskiAi';
import { ToolCall, type ToolCallTranslations } from '../ToolCall';

const TRANSLATIONS: ToolCallTranslations = {
  preToolCallText: 'Searching for',
  searchingText: 'Searching...',
  toolCallResultText: 'Searched',
  savedMemoryToolResultText: 'Saved to memory',
  memoryToolResultText: 'Used memory to enhance results',
};

describe('ToolCall', () => {
  afterEach(() => {
    cleanup();
  });

  describe('search tools', () => {
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
      },
      {
        description: 'tool-algolia_search_index with nbHits',
        part: {
          type: 'tool-algolia_search_index',
          toolCallId: 'id-3',
          state: 'output-available',
          input: {
            clickAnalytics: false,
            originalQuery: 'testing',
            queries: [
              {
                query: 'test',
              },
            ],
          },
          output: { hits: [], nbHits: 7 },
        },
      },
      {
        description: 'tool-algolia_search_index_custom with results array',
        part: {
          type: 'tool-algolia_search_index_custom',
          toolCallId: 'id-4',
          state: 'output-available',
          input: {
            clickAnalytics: false,
            originalQuery: 'testing',
            queries: [
              {
                query: 'test',
              },
            ],
          },
          output: { hits: [{}] },
        },
      },
    ] satisfies Array<{
      description: string;
      part: AIToolPart;
    }>)(
      'renders the completed search tool result for $description',
      ({ part }) => {
        const { container } = render(
          <ToolCall part={part} translations={TRANSLATIONS} tools={{}} />
        );

        expect(
          within(container).getByText('Searched', { exact: false })
        ).toBeInTheDocument();
        expect(within(container).getByText(/"test"/)).toBeInTheDocument();
      }
    );

    it('renders multiple MCP search tool queries', () => {
      const part = {
        type: 'tool-algolia_search_index_test',
        toolCallId: 'multiple-queries',
        state: 'output-available',
        input: {
          clickAnalytics: false,
          originalQuery: 'testing',
          queries: [
            {
              query: 'first',
            },
            {
              query: 'second',
            },
          ],
        },
        output: {
          hits: [],
        },
      } satisfies AIToolPart;

      render(<ToolCall part={part} translations={TRANSLATIONS} tools={{}} />);

      expect(screen.getByText(/"first"/)).toBeInTheDocument();
      expect(screen.getByText(/"second"/)).toBeInTheDocument();
    });
  });

  describe('memory tools', () => {
    it.each([
      {
        description: 'tool-algolia_ponder',
        part: {
          type: 'tool-algolia_ponder',
          toolCallId: 'memory-ponder',
          state: 'output-available',
          input: { value: 'remember this' },
          output: { stored: true },
        },
        expectedMessage: 'Used memory to enhance results',
      },
      {
        description: 'tool-algolia_memorize',
        part: {
          type: 'tool-algolia_memorize',
          toolCallId: 'memory-memorize',
          state: 'output-available',
          input: { value: 'remember this' },
          output: { stored: true },
        },
        expectedMessage: 'Saved to memory',
      },
      {
        description: 'tool-algolia_memory_search',
        part: {
          type: 'tool-algolia_memory_search',
          toolCallId: 'memory-search',
          state: 'output-available',
          input: { value: 'remember this' },
          output: { stored: true },
        },
        expectedMessage: 'Used memory to enhance results',
      },
    ] satisfies Array<{
      description: string;
      part: MemoryToolPart;
      expectedMessage: string;
    }>)(
      'renders the memory result text for $description when output is available and memory is enabled',
      ({ part, expectedMessage }) => {
        const { container } = render(
          <ToolCall
            part={part}
            translations={TRANSLATIONS}
            tools={{}}
            memoryEnabled={true}
          />
        );

        expect(
          within(container).getByText(expectedMessage)
        ).toBeInTheDocument();
      }
    );

    it.each([
      {
        description: 'input-streaming',
        part: {
          type: 'tool-algolia_ponder',
          toolCallId: 'memory-input-streaming',
          state: 'input-streaming',
          input: { value: 'remember this' },
        },
        expectedMessage: 'Used memory to enhance results',
      },
      {
        description: 'input-available',
        part: {
          type: 'tool-algolia_memorize',
          toolCallId: 'memory-input-available',
          state: 'input-available',
          input: { value: 'remember this' },
        },
        expectedMessage: 'Saved to memory',
      },
      {
        description: 'output-available',
        part: {
          type: 'tool-algolia_memory_search',
          toolCallId: 'memory-output-available',
          state: 'output-available',
          input: { value: 'remember this' },
          output: { stored: true },
        },
        expectedMessage: 'Used memory to enhance results',
      },
    ] satisfies Array<{
      description: string;
      part: MemoryToolPart;
      expectedMessage: string;
    }>)(
      'renders the memory result text in $description state when memory is enabled',
      ({ part, expectedMessage }) => {
        const { container } = render(
          <ToolCall
            part={part}
            translations={TRANSLATIONS}
            tools={{}}
            memoryEnabled={true}
          />
        );

        expect(
          within(container).getByText(expectedMessage)
        ).toBeInTheDocument();
      }
    );

    it('renders nothing for memory tool output errors when memory is enabled', () => {
      const part: MemoryToolPart = {
        type: 'tool-algolia_memorize',
        toolCallId: 'memory-error',
        state: 'output-error',
        input: { value: 'remember this' },
        errorText: 'Memory tool failed',
      };

      const { container } = render(
        <ToolCall
          part={part}
          translations={TRANSLATIONS}
          tools={{}}
          memoryEnabled={true}
        />
      );

      expect(container).toBeEmptyDOMElement();
    });

    it.each([
      {
        description: 'memoryEnabled is false',
        part: {
          type: 'tool-algolia_ponder',
          toolCallId: 'memory-disabled',
          state: 'output-available',
          input: { value: 'remember this' },
          output: { stored: true },
        },
        memoryEnabled: false,
      },
      {
        description: 'memoryEnabled is omitted (defaults to false)',
        part: {
          type: 'tool-algolia_memory_search',
          toolCallId: 'memory-default-off',
          state: 'output-available',
          input: { value: 'remember this' },
          output: { stored: true },
        },
        memoryEnabled: undefined,
      },
    ] satisfies Array<{
      description: string;
      part: MemoryToolPart;
      memoryEnabled: boolean | undefined;
    }>)(
      'renders nothing for memory tools when $description',
      ({ part, memoryEnabled }) => {
        const { container } = render(
          <ToolCall
            part={part}
            translations={TRANSLATIONS}
            tools={{}}
            memoryEnabled={memoryEnabled}
          />
        );

        expect(container).toBeEmptyDOMElement();
      }
    );

    it('prioritizes a matching custom tool over the memory tool rendering', () => {
      const part: MemoryToolPart = {
        type: 'tool-algolia_ponder',
        toolCallId: 'memory-custom',
        state: 'output-available',
        input: { value: 'remember this' },
        output: { stored: true },
      };
      const tools: ToolCalls = {
        algolia_ponder: {
          render: () => 'Custom memory render',
        },
      };

      const { container } = render(
        <ToolCall part={part} translations={TRANSLATIONS} tools={tools} />
      );

      expect(
        within(container).getByText('Custom memory render')
      ).toBeInTheDocument();
      expect(
        within(container).queryByText('Used memory to enhance results')
      ).not.toBeInTheDocument();
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

      render(
        <ToolCall part={part} translations={TRANSLATIONS} tools={tools} />
      );

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

      render(
        <ToolCall part={part} translations={TRANSLATIONS} tools={tools} />
      );

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

      const { container } = render(
        <ToolCall part={part} translations={TRANSLATIONS} tools={tools} />
      );

      expect(container).toBeEmptyDOMElement();
    });
  });
});
