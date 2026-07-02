import { describe, it, expect } from 'vitest';

import type { AIMessagePart } from '../AskiAi';
import { isAIToolPart } from '../AskiAi';

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
