import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAskAi } from '../useAskAi';

type ToolCall = {
  input: unknown;
  toolCallId: string;
  toolName: string;
};

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  parts: Array<{ type: 'text'; text: string }>;
};

type ChatOptions = {
  id?: string;
  messages?: ChatMessage[];
  onToolCall: (params: { toolCall: ToolCall }) => unknown;
  transport: {
    options: {
      headers?: Record<string, string>;
      body?: Record<string, unknown>;
    };
  };
};

type CustomOnToolCallParams = ToolCall & {
  addToolOutput: (props: { output: unknown }) => Promise<void>;
};

const mocks = vi.hoisted(() => ({
  addToolOutput: vi.fn(),
  setMessages: vi.fn(),
  useChat: vi.fn(),
  generateId: vi.fn(),
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
  generateId: mocks.generateId,
}));

describe('useAskAi', () => {
  let chatOptions: ChatOptions | undefined;
  let chatOptionsHistory: ChatOptions[] = [];

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

  function getTransportBody(): Record<string, unknown> {
    if (!chatOptions) {
      throw new Error('useChat was not initialized');
    }

    return chatOptions.transport.options.body ?? {};
  }

  beforeEach(() => {
    vi.clearAllMocks();

    let idCounter = 0;
    mocks.generateId.mockImplementation(() => {
      idCounter += 1;
      return `generated-id-${idCounter}`;
    });

    chatOptions = undefined;
    chatOptionsHistory = [];
    mocks.useChat.mockImplementation((options: ChatOptions) => {
      chatOptions = options;
      chatOptionsHistory.push(options);

      return {
        addToolOutput: mocks.addToolOutput,
        error: undefined,
        messages: [],
        sendMessage: vi.fn(),
        setMessages: mocks.setMessages,
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

  it('sends the secure user token header when memory.userToken is provided', () => {
    renderHook(() =>
      useAskAi({
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
        apiKey: 'api-key',
        appId: 'app-id',
        assistantId: 'assistant-id',
        indexName: 'index-name',
        tools: {},
      }),
    );

    expect(getTransportHeaders()).not.toHaveProperty('x-algolia-secure-user-token');
  });

  it('sends an empty transport body when no search parameters or indices are provided', () => {
    renderHook(() =>
      useAskAi({
        apiKey: 'api-key',
        appId: 'app-id',
        assistantId: 'assistant-id',
        indexName: 'index-name',
        tools: {},
      }),
    );

    expect(getTransportBody()).toEqual({ algolia: {} });
  });

  it('includes searchParameters under the algolia body when provided', () => {
    const searchParameters = {
      'index-name': { distinct: false },
    };

    renderHook(() =>
      useAskAi({
        apiKey: 'api-key',
        appId: 'app-id',
        assistantId: 'assistant-id',
        indexName: 'index-name',
        tools: {},
        searchParameters,
      }),
    );

    expect(getTransportBody()).toEqual({
      algolia: { searchParameters },
    });
  });

  it('includes indices under the algolia body when provided', () => {
    const indices = [
      {
        index: 'docsearch-markdown',
        description: 'Use this to gather specific results.',
      },
    ];

    renderHook(() =>
      useAskAi({
        apiKey: 'api-key',
        appId: 'app-id',
        assistantId: 'assistant-id',
        indexName: 'index-name',
        tools: {},
        indices,
      }),
    );

    expect(getTransportBody()).toEqual({
      algolia: { indices },
    });
  });

  it('includes both searchParameters and indices under the algolia body when both are provided', () => {
    const searchParameters = {
      'index-name': { distinct: false },
    };
    const indices = [
      {
        index: 'docsearch-markdown',
        description: 'Use this to gather specific results.',
      },
    ];

    renderHook(() =>
      useAskAi({
        apiKey: 'api-key',
        appId: 'app-id',
        assistantId: 'assistant-id',
        indexName: 'index-name',
        tools: {},
        searchParameters,
        indices,
      }),
    );

    expect(getTransportBody()).toEqual({
      algolia: { searchParameters, indices },
    });
  });

  it('omits indices from the body when an empty indices array is provided', () => {
    renderHook(() =>
      useAskAi({
        apiKey: 'api-key',
        appId: 'app-id',
        assistantId: 'assistant-id',
        indexName: 'index-name',
        tools: {},
        indices: [],
      }),
    );

    expect(getTransportBody()).toEqual({ algolia: {} });
  });

  describe('conversation id rotation', () => {
    it('passes a generated id to useChat on mount', () => {
      renderHook(() =>
        useAskAi({
          apiKey: 'api-key',
          appId: 'app-id',
          assistantId: 'assistant-id',
          indexName: 'index-name',
          tools: {},
        }),
      );

      expect(chatOptions?.id).toBe('generated-id-1');
    });

    it('rotates the chat id and clears messages on startNewConversation', () => {
      const { result } = renderHook(() =>
        useAskAi({
          apiKey: 'api-key',
          appId: 'app-id',
          assistantId: 'assistant-id',
          indexName: 'index-name',
          tools: {},
        }),
      );

      const initialId = chatOptions?.id;
      expect(initialId).toBe('generated-id-1');

      act(() => {
        result.current.startNewConversation();
      });

      // Rotating the id recreates the `Chat` instance with no seeded messages,
      // which is what clears the previous conversation.
      expect(chatOptions?.messages).toBeUndefined();
      expect(chatOptions?.id).toBe('generated-id-2');
      expect(chatOptions?.id).not.toBe(initialId);
    });

    it('generates a fresh id for each new conversation', () => {
      const { result } = renderHook(() =>
        useAskAi({
          apiKey: 'api-key',
          appId: 'app-id',
          assistantId: 'assistant-id',
          indexName: 'index-name',
          tools: {},
        }),
      );

      act(() => {
        result.current.startNewConversation();
      });
      const secondId = chatOptions?.id;

      act(() => {
        result.current.startNewConversation();
      });
      const thirdId = chatOptions?.id;

      expect(secondId).toBe('generated-id-2');
      expect(thirdId).toBe('generated-id-3');
      expect(secondId).not.toBe(thirdId);
    });

    it('restores a stored conversation using its persisted chat id', () => {
      const { result } = renderHook(() =>
        useAskAi({
          apiKey: 'api-key',
          appId: 'app-id',
          assistantId: 'assistant-id',
          indexName: 'index-name',
          tools: {},
        }),
      );

      const storedMessages: ChatMessage[] = [
        {
          id: 'message-1',
          role: 'user',
          parts: [{ type: 'text', text: 'stored question' }],
        },
      ];

      act(() => {
        result.current.restoreConversation(storedMessages, 'stored-chat-id');
      });

      // Restored messages are seeded through the `messages` option so they
      // survive the `Chat` instance being recreated when the id changes.
      expect(chatOptions?.messages).toEqual(storedMessages);
      expect(chatOptions?.id).toBe('stored-chat-id');
    });

    it('restores a stored conversation with a fresh id when no chat id is persisted', () => {
      const { result } = renderHook(() =>
        useAskAi({
          apiKey: 'api-key',
          appId: 'app-id',
          assistantId: 'assistant-id',
          indexName: 'index-name',
          tools: {},
        }),
      );

      const storedMessages: ChatMessage[] = [
        {
          id: 'message-1',
          role: 'user',
          parts: [{ type: 'text', text: 'stored question' }],
        },
      ];

      act(() => {
        result.current.restoreConversation(storedMessages);
      });

      // The messages must still be seeded even when a fresh id is generated,
      // otherwise the recreated `Chat` instance would render an empty thread.
      expect(chatOptions?.messages).toEqual(storedMessages);
      expect(chatOptions?.id).toBe('generated-id-2');
    });

    it('does not seed initial messages on mount', () => {
      renderHook(() =>
        useAskAi({
          apiKey: 'api-key',
          appId: 'app-id',
          assistantId: 'assistant-id',
          indexName: 'index-name',
          tools: {},
        }),
      );

      expect(chatOptions?.messages).toBeUndefined();
    });

    it('clears seeded messages and rotates the id when starting a new conversation after a restore', () => {
      const { result } = renderHook(() =>
        useAskAi({
          apiKey: 'api-key',
          appId: 'app-id',
          assistantId: 'assistant-id',
          indexName: 'index-name',
          tools: {},
        }),
      );

      const storedMessages: ChatMessage[] = [
        {
          id: 'message-1',
          role: 'user',
          parts: [{ type: 'text', text: 'stored question' }],
        },
      ];

      act(() => {
        result.current.restoreConversation(storedMessages, 'stored-chat-id');
      });

      expect(chatOptions?.messages).toEqual(storedMessages);

      act(() => {
        result.current.startNewConversation();
      });

      // Starting a new conversation must drop the seeded messages so a later
      // recreation does not re-hydrate the previous conversation.
      expect(chatOptions?.messages).toBeUndefined();
      expect(chatOptions?.id).toBe('generated-id-2');
    });
  });
});
