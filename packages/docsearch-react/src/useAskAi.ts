import type { UseChatHelpers } from '@ai-sdk/react';
import { Chat, useChat } from '@ai-sdk/react';
import type { ChatOnToolCallCallback } from 'ai';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  generateId,
} from 'ai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  agentStudioBaseUrl,
  getAgentStudioErrorMessage,
  postAgentStudioFeedback,
} from './askai';
import type { Exchange } from './AskAiScreen';
import type { StoredSearchPlugin } from './stored-searches';
import { createStoredConversations } from './stored-searches';
import { type AIMessage, type ToolCalls } from './types/AskiAi';
import type { OnAskAiFeedback } from './types/Feedback';
import { EMPTY_TOOLS, sanitizeMessagesForRequest } from './utils/ai';

import type {
  AgentStudioIndices,
  AgentStudioSearchParameters,
  Memory,
  StoredAskAiState,
} from '.';

type UseChat = UseChatHelpers<AIMessage>;

type UseAskAiParams = {
  agentId: string;
  apiKey: string;
  appId: string;
  searchParameters?: AgentStudioSearchParameters;
  tools: ToolCalls;
  memory?: Memory;
  indices?: AgentStudioIndices[];
};

type UseAskAiReturn = {
  chatId: string;
  messages: AIMessage[];
  status: UseChat['status'];
  sendMessage: UseChat['sendMessage'];
  setMessages: UseChat['setMessages'];
  stopAskAiStreaming: UseChat['stop'];
  askAiError?: Error;
  isStreaming: boolean;
  exchanges: Exchange[];
  conversations: StoredSearchPlugin<StoredAskAiState>;
  sendFeedback: OnAskAiFeedback;
  /**
   * Create's a new chat instance, clearing existing messages and generating a
   * new conversation ID.
   */
  startNewConversation: () => void;
  /**
   * Create's a new chat instance, seeded with an existing conversation's ID and
   * its messages.
   */
  restoreConversation: (
    restored: AIMessage[],
    existingConversationId?: string
  ) => void;
};

type UseAskAi = (params: UseAskAiParams) => UseAskAiReturn;

type AgentStudioTransportParams = Pick<
  UseAskAiParams,
  'apiKey' | 'appId' | 'agentId'
> & {
  searchParameters?: AgentStudioSearchParameters;
  userToken?: string;
  indices?: AgentStudioIndices[];
};

const getAgentStudioTransport = ({
  appId,
  apiKey,
  agentId,
  searchParameters,
  userToken,
  indices,
}: AgentStudioTransportParams): DefaultChatTransport<AIMessage> => {
  const algoliaParams: {
    searchParameters?: AgentStudioSearchParameters;
    indices?: string[];
  } = {};

  if (searchParameters) {
    algoliaParams.searchParameters = searchParameters;
  }

  // Agent Studio completions expect index name strings, not full index configs.
  if (indices && indices.length > 0) {
    algoliaParams.indices = indices.map((index) => index.index);
  }

  return new DefaultChatTransport({
    api: `${agentStudioBaseUrl(appId)}/agents/${agentId}/completions?stream=true&compatibilityMode=ai-sdk-5`,
    headers: {
      'x-algolia-application-id': appId,
      'x-algolia-api-key': apiKey,
      ...(userToken ? { 'x-algolia-secure-user-token': userToken } : {}),
    },
    body: {
      algolia: algoliaParams,
    },
    prepareSendMessagesRequest({ id, messages, body, ...rest }) {
      // Filter out `data-*` part types since Agent Studio does not currently support them on the request
      const sanitizedMessages = sanitizeMessagesForRequest(messages);

      return {
        ...rest,
        body: {
          id,
          messages: sanitizedMessages,
          ...body,
        },
      };
    },
  });
};

export const useAskAi: UseAskAi = ({
  agentId,
  apiKey,
  appId,
  tools = EMPTY_TOOLS,
  searchParameters,
  memory,
  indices,
}) => {
  const abortControllerRef = useRef(new AbortController());

  const askAiTransport = useMemo(
    () =>
      getAgentStudioTransport({
        apiKey,
        appId,
        agentId,
        searchParameters,
        userToken: memory?.userToken,
        indices,
      }),
    [apiKey, appId, agentId, searchParameters, memory?.userToken, indices]
  );

  // Store transport in a ref since it is dependent on unstable dependencies:
  // - searchParameters, an object whose changed values trigger a new transport
  // - indices, an array whose changed values trigger a new transport
  const askAiTransportRef = useRef(askAiTransport);
  askAiTransportRef.current = askAiTransport;

  // Sync ref during render so the stable `handleToolCall` (registered once
  // by useChat) always sees the latest `tools` without re-creating itself.
  // Safe because tool calls only fire after a commit, and writes are idempotent.
  const toolsRef = useRef(tools);
  toolsRef.current = tools;

  const addToolOutputRef = useRef<UseChat['addToolOutput'] | null>(null);

  const handleToolCall: ChatOnToolCallCallback<AIMessage> = useCallback(
    ({ toolCall }) => {
      const tool = toolsRef.current[toolCall.toolName];
      if (!tool?.onToolCall) {
        return;
      }

      tool.onToolCall({
        ...toolCall,
        addToolOutput: async ({ output }) => {
          if (!addToolOutputRef.current) return;

          await addToolOutputRef.current({
            output,
            tool: toolCall.toolName,
            toolCallId: toolCall.toolCallId,
          });
        },
      });
    },
    []
  );

  const createChatInstance = useCallback(
    (messages?: AIMessage[], id = generateId()): Chat<AIMessage> =>
      new Chat<AIMessage>({
        id,
        messages,
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
        transport: askAiTransportRef.current,
        onToolCall: handleToolCall,
      }),
    [handleToolCall]
  );

  const [chatInstance, setChatInstance] = useState(
    (): Chat<AIMessage> => createChatInstance()
  );
  // Keep a stable reference to the chat instance so reading messages are render safe
  const chatInstanceRef = useRef<Chat<AIMessage>>(chatInstance);
  chatInstanceRef.current = chatInstance;

  const { messages, status, setMessages, error, stop, addToolOutput } = useChat(
    {
      chat: chatInstance,
    }
  );

  useEffect(() => {
    addToolOutputRef.current = addToolOutput;
  }, [addToolOutput]);

  const conversations = useRef(
    createStoredConversations<StoredAskAiState>({
      key: `__DOCSEARCH_ASKAI_CONVERSATIONS__${appId}`,
      limit: 10,
    })
  ).current;

  const sendFeedback = useCallback<OnAskAiFeedback>(
    async (messageId, { thumbs, tags, notes }): Promise<void> => {
      if (!agentId) return;

      const res = await postAgentStudioFeedback({
        agentId,
        vote: thumbs,
        messageId,
        appId,
        apiKey,
        abortSignal: abortControllerRef.current.signal,
        notes,
        tags,
      });

      if (res.status >= 300) throw new Error('Failed, try again later.');
      conversations.addFeedback?.(
        messageId,
        thumbs === 1 ? 'like' : 'dislike',
        { tags, notes }
      );
    },
    [agentId, appId, apiKey, conversations]
  );

  const onStopStreaming = useCallback(async (): Promise<void> => {
    abortControllerRef.current.abort();
    await stop();
  }, [stop]);

  const exchanges = useMemo((): Exchange[] => {
    const grouped: Exchange[] = [];

    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === 'user') {
        const userMessage = messages[i];
        const assistantMessage =
          messages[i + 1]?.role === 'assistant' ? messages[i + 1] : null;
        grouped.push({ id: userMessage.id, userMessage, assistantMessage });
        if (assistantMessage) {
          i++;
        }
      }
    }

    return grouped;
  }, [messages]);

  const isStreaming = status === 'streaming' || status === 'submitted';

  const askAiError = useMemo((): Error | undefined => {
    if (!error) return undefined;

    return getAgentStudioErrorMessage(error);
  }, [error]);

  const updateChatInstance = useCallback(
    (restored?: AIMessage[], existingConversationId?: string): void => {
      const newChatInstance = createChatInstance(
        restored,
        existingConversationId
      );
      chatInstanceRef.current = newChatInstance;
      setChatInstance(newChatInstance);
    },
    [createChatInstance]
  );

  const startNewConversation = useCallback((): void => {
    updateChatInstance();
  }, [updateChatInstance]);

  const restoreConversation = useCallback(
    (restored: AIMessage[], existingConversationId?: string): void => {
      updateChatInstance(restored, existingConversationId);
    },
    [updateChatInstance]
  );

  // This is so that the public `sendMessage` is always pointed to a stable reference of the chat instance
  const sendMessageSafe = useCallback<UseChat['sendMessage']>(
    (...args): Promise<void> => chatInstanceRef.current!.sendMessage(...args),
    []
  );

  return {
    chatId: chatInstance.id,
    messages,
    sendMessage: sendMessageSafe,
    status,
    setMessages,
    askAiError,
    stopAskAiStreaming: onStopStreaming,
    isStreaming,
    exchanges,
    conversations,
    sendFeedback,
    startNewConversation,
    restoreConversation,
  };
};
