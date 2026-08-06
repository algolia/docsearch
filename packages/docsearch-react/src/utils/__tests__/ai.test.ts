import { describe, it, expect } from 'vitest';

import { getAgentStudioErrorMessage } from '../../askai';
import type {
  AIMessage,
  AIMessagePart,
  SearchToolPart,
} from '../../types/AskiAi';
import {
  getAskAiBlockingBannerMessage,
  getAgentPromptSuggestions,
  getSearchToolQueries,
  isAIToolPart,
  isAlgoliaMCPSearchOutputPart,
  isThreadDepthError,
  isAskAiPromptBlockingError,
  showAskAiBlockingBannerNewConversationLink,
  sanitizeMessagesForRequest,
  getMessageContent,
} from '../ai';

describe('isThreadDepthError', () => {
  it('detects AI-217 regardless of casing', () => {
    expect(isThreadDepthError(new Error('AI-217: limit reached'))).toBe(true);
    expect(isThreadDepthError(new Error('prefix ai-217 suffix'))).toBe(true);
  });

  it('detects conversation depth phrasing', () => {
    expect(
      isThreadDepthError(
        new Error(
          "You've hit the max conversation depth (4 messages), start a new conversation."
        )
      )
    ).toBe(true);
    expect(
      isThreadDepthError(new Error('Maximum conversation depth reached.'))
    ).toBe(true);
  });

  it('detects conversation depth in a JSON-shaped error message', () => {
    expect(
      isThreadDepthError(
        new Error(
          JSON.stringify({ message: 'Maximum conversation depth reached.' })
        )
      )
    ).toBe(true);
  });

  it('ignores unrelated errors', () => {
    expect(isThreadDepthError()).toBe(false);
    expect(isThreadDepthError(new Error('Network failed'))).toBe(false);
    expect(isThreadDepthError(new Error('AI-214: rate limit'))).toBe(false);
  });
});

describe('Agent Studio prompt-blocking errors', () => {
  it.each(['AI-203', 'AI-205', 'AI-224', 'AI-225'])(
    'blocks error code %s',
    (code) => {
      expect(isAskAiPromptBlockingError(new Error(`Failed (${code})`))).toBe(
        true
      );
    }
  );

  it.each([
    'Rate limit exceeded',
    'Domain is not whitelisted',
    'Maximum token limit reached',
    'Maximum agent steps exceeded',
  ])('blocks matching message: %s', (errorMessage) => {
    expect(isAskAiPromptBlockingError(new Error(errorMessage))).toBe(true);
  });

  it('does not block unrelated errors', () => {
    expect(isAskAiPromptBlockingError(new Error('Network failed'))).toBe(false);
  });

  it('hides recovery when a new conversation cannot resolve the error', () => {
    expect(
      showAskAiBlockingBannerNewConversationLink(
        new Error('Request blocked for this domain')
      )
    ).toBe(false);
    expect(
      showAskAiBlockingBannerNewConversationLink(
        new Error('Could not complete response due to token output limits')
      )
    ).toBe(false);
    expect(
      showAskAiBlockingBannerNewConversationLink(
        new Error('Rate limit exceeded')
      )
    ).toBe(true);
  });

  it('uses the human message from JSON errors', () => {
    const error = new Error(
      JSON.stringify({
        error: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded. Retry after 60 seconds.',
      })
    );

    expect(getAskAiBlockingBannerMessage(error)).toBe(
      'Rate limit exceeded. Retry after 60 seconds.'
    );
  });

  it('matches retry-after messages and case-insensitive JSON fields', () => {
    const error = new Error(
      JSON.stringify({ Message: 'Please retry after 60 seconds' })
    );

    expect(isAskAiPromptBlockingError(error)).toBe(true);
    expect(getAskAiBlockingBannerMessage(error)).toBe(
      'Please retry after 60 seconds'
    );
  });

  it('provides a fallback for code-only conversation limits', () => {
    const error = new Error(JSON.stringify({ code: 'AI-217' }));

    expect(getAskAiBlockingBannerMessage(error)).toBeUndefined();
  });

  it('normalizes nested JSON while preserving the error code', () => {
    const error = getAgentStudioErrorMessage(
      new Error(
        JSON.stringify(
          JSON.stringify({ message: 'Too many requests', code: 'AI-205' })
        )
      )
    );

    expect(error.message).toBe('Too many requests (AI-205)');
    expect(isAskAiPromptBlockingError(error)).toBe(true);
    expect(getAskAiBlockingBannerMessage(error)).toBe('Too many requests');
  });

  it('uses a fallback for type-only token output errors', () => {
    const error = new Error(JSON.stringify({ type: 'TokenOutputLimitError' }));

    expect(isAskAiPromptBlockingError(error)).toBe(true);
    expect(getAskAiBlockingBannerMessage(error)).toBe(
      'Could not complete response due to token output limits'
    );
  });
});

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
    }
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
    }
  );
});

describe('sanitizeMessagesForRequest', () => {
  it('returns the original messages array when there are no data parts', () => {
    const messages = [message('message-1', [{ type: 'text', text: 'Hello' }])];

    expect(sanitizeMessagesForRequest(messages)).toBe(messages);
  });

  it('removes data parts from messages', () => {
    const textPart: AIMessagePart = { type: 'text', text: 'Hello' };
    const reasoningPart: AIMessagePart = {
      type: 'reasoning',
      state: 'done',
      text: 'Thinking...',
    };
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

    expect(sanitizeMessagesForRequest(messages)).toEqual([
      message('message-1', [textPart, reasoningPart]),
    ]);
  });

  it('keeps unchanged messages by reference when a later message is sanitized', () => {
    const unchangedMessage = message('message-1', [
      { type: 'text', text: 'Hello' },
    ]);
    const sanitizedMessage = message('message-2', [
      { type: 'text', text: 'Hi' },
      {
        type: 'data-suggestions',
        data: { suggestions: ['What is DocSearch?'] },
      },
    ]);

    const result = sanitizeMessagesForRequest([
      unchangedMessage,
      sanitizedMessage,
    ]);

    expect(result[0]).toBe(unchangedMessage);
    expect(result[1]).not.toBe(sanitizedMessage);
    expect(result[1].parts).toEqual([{ type: 'text', text: 'Hi' }]);
  });
});

describe('getAgentPromptSuggestions', () => {
  it('returns an empty array when there is no suggestions part', () => {
    expect(
      getAgentPromptSuggestions([{ type: 'text', text: 'Hello' }])
    ).toEqual([]);
  });

  it('returns suggestions from the data suggestions part', () => {
    expect(
      getAgentPromptSuggestions([
        { type: 'text', text: 'Hello' },
        {
          type: 'data-suggestions',
          data: {
            suggestions: [
              'How do I install DocSearch?',
              'How do I configure facets?',
            ],
          },
        },
      ])
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
      ])
    ).toEqual(['First suggestion']);
  });
});

describe('getSearchToolQueries', () => {
  it('returns input query for tool-searchIndex', () => {
    const queries = getSearchToolQueries({
      toolCallId: 'testing-123',
      type: 'tool-searchIndex',
      state: 'input-available',
      input: {
        query: 'testing',
      },
      output: undefined,
    });

    expect(queries).toEqual(['testing']);
  });

  it('returns queries for MCP search tool', () => {
    const queries = getSearchToolQueries({
      type: 'tool-algolia_search_index_testing',
      toolCallId: 'testing-456',
      state: 'input-available',
      input: {
        clickAnalytics: false,
        originalQuery: 'testing',
        queries: [
          {
            query: 'first',
          },
          {
            query: '',
          },
          {
            query: 'second',
          },
        ],
      },
      output: undefined,
    });

    expect(queries).toEqual(['first', 'second']);
  });

  it('extracts query from stored MCP tool call with v1 input', () => {
    const part: SearchToolPart = {
      type: 'tool-algolia_search_index',
      toolCallId: 'legacy-id',
      state: 'output-available',
      input: {
        query: '  foo  ',
        index: 'docs',
      },
      output: { hits: [] },
    };

    expect(getSearchToolQueries(part)).toEqual(['foo']);
  });
});

describe('getMessageContent', () => {
  it('joins the text parts around tool calls so copying returns the full answer', () => {
    expect(
      getMessageContent(
        message('a1', [
          { type: 'text', text: 'Let me look that up.', state: 'done' },
          {
            type: 'tool-algolia_search_index',
            toolCallId: 't1',
            state: 'output-available',
            input: {
              query: 'foo',
              index: 'bar',
            },
            output: { hits: [] },
          },
          {
            type: 'text',
            text: 'Docusaurus is a static site generator.',
            state: 'done',
          },
        ])
      )
    ).toBe('Let me look that up.\n\nDocusaurus is a static site generator.');
  });

  it('returns an empty string without a message or text parts', () => {
    expect(getMessageContent(null)).toBe('');
    expect(
      getMessageContent(
        message('a2', [
          {
            type: 'tool-algolia_search_index',
            toolCallId: 't2',
            state: 'output-available',
            input: {
              query: 'foo',
              index: 'bar',
            },
            output: { hits: [] },
          },
        ])
      )
    ).toBe('');
  });
});
