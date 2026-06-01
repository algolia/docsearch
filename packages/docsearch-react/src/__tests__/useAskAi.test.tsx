import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAskAi } from '../useAskAi';

type ToolCall = {
  input: unknown;
  toolCallId: string;
  toolName: string;
};

type ChatOptions = {
  onToolCall: (params: { toolCall: ToolCall }) => unknown;
  transport: { options: { headers?: Record<string, string> } };
};

type CustomOnToolCallParams = ToolCall & {
  addToolOutput: (props: { output: unknown }) => Promise<void>;
};

const mocks = vi.hoisted(() => ({
  addToolOutput: vi.fn(),
  useChat: vi.fn(),
}));

vi.mock('@ai-sdk/react', () => ({
  useChat: mocks.useChat,
}));

vi.mock('ai', () => ({
  DefaultChatTransport: class DefaultChatTransport {
    options: unknown;

    constructor(options: unknown) {
      this.options = options;
    }
  },
  lastAssistantMessageIsCompleteWithToolCalls: vi.fn(() => false),
}));

describe('useAskAi', () => {
  let chatOptions: ChatOptions | undefined;

  function getOnToolCall(): ChatOptions['onToolCall'] {
    if (!chatOptions) {
      throw new Error('useChat was not initialized');
    }

    return chatOptions.onToolCall;
  }

  function getTransportHeaders(): Record<string, string> {
    if (!chatOptions) {
      throw new Error('useChat was not initialized');
    }

    return chatOptions.transport.options.headers ?? {};
  }

  beforeEach(() => {
    vi.clearAllMocks();

    chatOptions = undefined;
    mocks.useChat.mockImplementation((options: ChatOptions) => {
      chatOptions = options;

      return {
        addToolOutput: mocks.addToolOutput,
        error: undefined,
        messages: [],
        sendMessage: vi.fn(),
        setMessages: vi.fn(),
        status: 'ready',
        stop: vi.fn(),
      };
    });
  });

  it('forwards custom tool output to useChat addToolOutput', async () => {
    let addToolOutput: CustomOnToolCallParams['addToolOutput'] | undefined;
    const onToolCall = vi.fn((params: CustomOnToolCallParams) => {
      addToolOutput = params.addToolOutput;
    });

    renderHook(() =>
      useAskAi({
        agentStudio: false,
        apiKey: 'api-key',
        appId: 'app-id',
        assistantId: 'assistant-id',
        indexName: 'index-name',
        tools: {
          customAction: {
            onToolCall,
            render: () => 'Custom action complete',
          },
        },
      }),
    );

    getOnToolCall()({
      toolCall: {
        input: { value: 'input value' },
        toolCallId: 'tool-call-id',
        toolName: 'customAction',
      },
    });

    expect(onToolCall).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { value: 'input value' },
        toolCallId: 'tool-call-id',
        toolName: 'customAction',
      }),
    );

    if (!addToolOutput) {
      throw new Error('addToolOutput was not provided to the custom tool');
    }

    await addToolOutput({ output: { result: 'output value' } });

    expect(mocks.addToolOutput).toHaveBeenCalledWith({
      output: { result: 'output value' },
      tool: 'customAction',
      toolCallId: 'tool-call-id',
    });
  });

  it('does not wait for custom onToolCall to finish', () => {
    const pendingToolCall = new Promise<void>(() => {});
    const onToolCall = vi.fn(() => pendingToolCall);

    renderHook(() =>
      useAskAi({
        agentStudio: false,
        apiKey: 'api-key',
        appId: 'app-id',
        assistantId: 'assistant-id',
        indexName: 'index-name',
        tools: {
          customAction: {
            onToolCall,
            render: () => 'Custom action complete',
          },
        },
      }),
    );

    const result = getOnToolCall()({
      toolCall: {
        input: { value: 'input value' },
        toolCallId: 'tool-call-id',
        toolName: 'customAction',
      },
    });

    expect(onToolCall).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  it('sends the secure user token header when memory.userToken is provided in Agent Studio mode', () => {
    renderHook(() =>
      useAskAi({
        agentStudio: true,
        apiKey: 'api-key',
        appId: 'app-id',
        assistantId: 'assistant-id',
        indexName: 'index-name',
        tools: {},
        memory: { userToken: 'secure-user-token' },
      }),
    );

    expect(getTransportHeaders()).toMatchObject({
      'x-algolia-secure-user-token': 'secure-user-token',
    });
  });

  it('omits the secure user token header when no memory token is provided', () => {
    renderHook(() =>
      useAskAi({
        agentStudio: true,
        apiKey: 'api-key',
        appId: 'app-id',
        assistantId: 'assistant-id',
        indexName: 'index-name',
        tools: {},
      }),
    );

    expect(getTransportHeaders()).not.toHaveProperty('x-algolia-secure-user-token');
  });
});
