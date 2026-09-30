import { describe, it, expect } from 'vitest';

import type { AIMessage } from '../types/AskiAi';
import { shouldSendAutomaticallyForAgentStudio } from '../useAskAi';

type Part = AIMessage['parts'][number];

const completedTool: Part = {
  type: 'tool-algolia_search_index',
  toolCallId: 'tool-1',
  state: 'output-available',
  input: { index: 'docs', query: 'test' },
  output: { hits: [] },
};

const pendingTool: Part = {
  type: 'tool-algolia_search_index',
  toolCallId: 'tool-2',
  state: 'input-available',
  input: { index: 'docs', query: 'test' },
};

const failedTool: Part = {
  type: 'tool-algolia_search_index',
  toolCallId: 'tool-3',
  state: 'output-error',
  input: { index: 'docs', query: 'test' },
  errorText: 'Search failed',
};

const assistant = (parts: Part[]): AIMessage => ({ id: 'assistant', role: 'assistant', parts });

describe('shouldSendAutomaticallyForAgentStudio', () => {
  it.each([
    { description: 'there are no messages', messages: [], expected: false },
    {
      description: 'the last message is from the user',
      messages: [{ id: 'user', role: 'user', parts: [{ type: 'text', text: 'Hi' }] }],
      expected: false,
    },
    { description: 'the assistant message has no parts', messages: [assistant([])], expected: false },
    {
      description: 'the last step has no tool calls',
      messages: [
        assistant([{ type: 'step-start' }, completedTool, { type: 'step-start' }, { type: 'text', text: 'Done' }]),
      ],
      expected: false,
    },
    {
      description: 'a tool call in the last step is pending',
      messages: [assistant([{ type: 'step-start' }, completedTool, pendingTool])],
      expected: false,
    },
    {
      description: 'only provider-executed tools completed',
      messages: [assistant([{ type: 'step-start' }, { ...completedTool, providerExecuted: true }])],
      expected: false,
    },
    {
      description: 'every tool call in the last step completed',
      messages: [assistant([{ type: 'step-start' }, completedTool])],
      expected: true,
    },
    {
      description: 'every tool call in the last step completed or failed',
      messages: [assistant([{ type: 'step-start' }, completedTool, failedTool])],
      expected: true,
    },
  ] satisfies Array<{ description: string; messages: AIMessage[]; expected: boolean }>)(
    'returns $expected when $description',
    ({ messages, expected }) => {
      expect(shouldSendAutomaticallyForAgentStudio({ messages })).toBe(expected);
    },
  );
});
