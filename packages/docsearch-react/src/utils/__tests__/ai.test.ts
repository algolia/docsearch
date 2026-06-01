import { describe, it, expect } from 'vitest';

import type { AIMessagePart } from '../../types/AskiAi';
import { isAIToolPart, isAlgoliaMCPSearchOutputPart } from '../ai';

describe('isAIToolPart', () => {
  it.each([
    {
      part: {
        type: 'tool-searchIndex',
        toolCallId: 'id-1',
        state: 'output-available',
        input: { query: 'test' },
        output: { hits: [] },
      },
      expected: true,
    },
    {
      part: {
        type: 'tool-algolia_search_index',
        toolCallId: 'id-2',
        state: 'input-streaming',
        input: {},
      },
      expected: true,
    },
    {
      part: { type: 'text', text: 'Hello' },
      expected: false,
    },
    {
      part: { type: 'reasoning', text: 'Thinking...' },
      expected: false,
    },
  ] satisfies Array<{ part: AIMessagePart; expected: boolean }>)(
    'returns $expected for $part.type',
    ({ part, expected }) => {
      expect(isAIToolPart(part)).toBe(expected);
    },
  );
});

describe('isAlgoliaMCPSearchOutputPart', () => {
  it.each([
    {
      part: {
        type: 'tool-algolia_search_index',
        toolCallId: 'id-1',
        state: 'output-available',
        input: { query: 'foo', index: 'docs' },
        output: { hits: [] },
      },
      expected: true,
    },
    {
      part: {
        type: 'tool-algolia_search_index_custom',
        toolCallId: 'id-2',
        state: 'output-available',
        input: { query: 'foo', index: 'docs' },
        output: { hits: [] },
      },
      expected: true,
    },
    {
      part: {
        type: 'tool-algolia_search_indexer',
        toolCallId: 'id-3',
        state: 'output-available',
        input: { query: 'foo', index: 'docs' },
        output: { hits: [] },
      },
      expected: false,
    },
  ] satisfies Array<{ part: AIMessagePart; expected: boolean }>)(
    'returns $expected for $part.type',
    ({ part, expected }) => {
      expect(isAlgoliaMCPSearchOutputPart(part)).toBe(expected);
    },
  );
});
