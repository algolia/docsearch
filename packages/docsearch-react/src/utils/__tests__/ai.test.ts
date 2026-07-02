import { describe, it, expect } from 'vitest';

import type { AIMessage, AIMessagePart } from '../../types/AskiAi';
import {
  getAgentPromptSuggestions,
  isAIToolPart,
  isAlgoliaMCPSearchOutputPart,
  sanitizeMessagesForRequest,
} from '../ai';

function message(id: string, parts: AIMessagePart[]): AIMessage {
  return {
    id,
    role: 'assistant',
    parts,
  };
}

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

describe('sanitizeMessagesForRequest', () => {
  it('returns the original messages array when there are no data parts', () => {
    const messages = [message('message-1', [{ type: 'text', text: 'Hello' }])];

    expect(sanitizeMessagesForRequest(messages)).toBe(messages);
  });

  it('removes data parts from messages', () => {
    const textPart: AIMessagePart = { type: 'text', text: 'Hello' };
    const reasoningPart: AIMessagePart = { type: 'reasoning', state: 'done', text: 'Thinking...' };
    const messages = [
      message('message-1', [
        textPart,
        {
          type: 'data-suggestions',
          data: { suggestions: ['How do I configure DocSearch?'] },
        },
        reasoningPart,
      ]),
    ];

    expect(sanitizeMessagesForRequest(messages)).toEqual([message('message-1', [textPart, reasoningPart])]);
  });

  it('keeps unchanged messages by reference when a later message is sanitized', () => {
    const unchangedMessage = message('message-1', [{ type: 'text', text: 'Hello' }]);
    const sanitizedMessage = message('message-2', [
      { type: 'text', text: 'Hi' },
      {
        type: 'data-suggestions',
        data: { suggestions: ['What is DocSearch?'] },
      },
    ]);

    const result = sanitizeMessagesForRequest([unchangedMessage, sanitizedMessage]);

    expect(result[0]).toBe(unchangedMessage);
    expect(result[1]).not.toBe(sanitizedMessage);
    expect(result[1].parts).toEqual([{ type: 'text', text: 'Hi' }]);
  });
});

describe('getAgentPromptSuggestions', () => {
  it('returns an empty array when there is no suggestions part', () => {
    expect(getAgentPromptSuggestions([{ type: 'text', text: 'Hello' }])).toEqual([]);
  });

  it('returns suggestions from the data suggestions part', () => {
    expect(
      getAgentPromptSuggestions([
        { type: 'text', text: 'Hello' },
        {
          type: 'data-suggestions',
          data: {
            suggestions: ['How do I install DocSearch?', 'How do I configure facets?'],
          },
        },
      ]),
    ).toEqual(['How do I install DocSearch?', 'How do I configure facets?']);
  });

  it('returns suggestions from the first suggestions part', () => {
    expect(
      getAgentPromptSuggestions([
        {
          type: 'data-suggestions',
          data: { suggestions: ['First suggestion'] },
        },
        {
          type: 'data-suggestions',
          data: { suggestions: ['Second suggestion'] },
        },
      ]),
    ).toEqual(['First suggestion']);
  });
});
