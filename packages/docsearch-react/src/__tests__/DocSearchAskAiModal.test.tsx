import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { UIMessage } from 'ai';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { DocSearchAskAiModal } from '../DocSearchAskAiModal';
import type { StoredAskAiState } from '../types';

const mocks = vi.hoisted(() => ({
  restoreConversation: vi.fn(),
  startNewConversation: vi.fn(),
  useAskAi: vi.fn(),
}));

vi.mock('../useAskAi', () => ({
  useAskAi: mocks.useAskAi,
}));

describe('DocSearchAskAiModal', () => {
  let messages: UIMessage[] = [];
  let storedConversations: StoredAskAiState[] = [];

  beforeEach(() => {
    messages = [];
    storedConversations = [];
    mocks.restoreConversation.mockReset();
    mocks.startNewConversation.mockReset();
    mocks.useAskAi.mockImplementation(() => ({
      askAiError: undefined,
      chatId: 'chat-id',
      conversations: { add: vi.fn(), getAll: () => storedConversations },
      exchanges: [],
      isStreaming: false,
      messages,
      restoreConversation: mocks.restoreConversation,
      sendFeedback: vi.fn(),
      sendMessage: vi.fn(),
      setMessages: vi.fn(),
      startNewConversation: mocks.startNewConversation,
      status: 'ready',
      stopAskAiStreaming: vi.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  function createStoredConversation(): StoredAskAiState {
    return {
      anchor: 'stored',
      chatId: 'stored-chat-id',
      content: null,
      hierarchy: {
        lvl0: 'askAI',
        lvl1: 'What is DocSearch?',
        lvl2: '2026-08-19T00:00:00.000Z',
        lvl3: null,
        lvl4: null,
        lvl5: null,
        lvl6: null,
      },
      messages: [
        {
          id: 'stored-message-id',
          parts: [{ text: 'What is DocSearch?', type: 'text' }],
          role: 'user',
        },
      ],
      objectID: 'stored-conversation',
      query: 'What is DocSearch?',
      type: 'askAI',
      url: '',
      url_without_anchor: '',
    };
  }

  function createProps() {
    return {
      apiKey: 'api-key',
      appId: 'app-id',
      askAi: 'agent-id',
      indices: ['index-name'],
      initialScrollY: 0,
      onAskAiToggle: vi.fn(),
    };
  }

  it('does not reset a conversation when its first message arrives before Ask AI activates', () => {
    const props = createProps();
    const { rerender } = render(
      <DocSearchAskAiModal {...props} isAskAiActive={false} />
    );

    messages = [
      {
        id: 'message-id',
        parts: [{ text: 'Question', type: 'text' }],
        role: 'user',
      },
    ];
    rerender(<DocSearchAskAiModal {...props} isAskAiActive={false} />);

    expect(mocks.startNewConversation).not.toHaveBeenCalled();
  });

  it('restores a stored conversation with its persisted chat ID on click', async () => {
    const conversation = createStoredConversation();
    storedConversations = [conversation];
    const props = createProps();

    render(<DocSearchAskAiModal {...props} isAskAiActive={false} />);

    fireEvent.click(await screen.findByText('What is DocSearch?'));

    expect(mocks.restoreConversation).toHaveBeenCalledTimes(1);
    expect(mocks.restoreConversation).toHaveBeenCalledWith(
      conversation.messages,
      'stored-chat-id'
    );
    await waitFor(() => {
      expect(props.onAskAiToggle).toHaveBeenCalledWith(true, {
        messageId: 'stored-message-id',
        query: 'What is DocSearch?',
      });
    });
  });

  it('restores a stored conversation with its persisted chat ID on Enter', async () => {
    const conversation = createStoredConversation();
    storedConversations = [conversation];
    const props = createProps();

    render(<DocSearchAskAiModal {...props} isAskAiActive={false} />);

    const input = await screen.findByPlaceholderText(
      'Search docs or ask AI a question'
    );
    await screen.findByText('What is DocSearch?');
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(mocks.restoreConversation).toHaveBeenCalledTimes(1);
    });
    expect(mocks.restoreConversation).toHaveBeenCalledWith(
      conversation.messages,
      'stored-chat-id'
    );
    expect(props.onAskAiToggle).toHaveBeenCalledWith(true, {
      messageId: 'stored-message-id',
      query: 'What is DocSearch?',
    });
  });

  it('does not open Ask AI when stored conversation selection is intercepted', async () => {
    const conversation = createStoredConversation();
    storedConversations = [conversation];
    const interceptAskAiEvent = vi.fn(() => true);
    const props = createProps();

    render(
      <DocSearchAskAiModal
        {...props}
        interceptAskAiEvent={interceptAskAiEvent}
        isAskAiActive={false}
      />
    );

    fireEvent.click(await screen.findByText('What is DocSearch?'));

    expect(mocks.restoreConversation).toHaveBeenCalledWith(
      conversation.messages,
      'stored-chat-id'
    );
    expect(interceptAskAiEvent).toHaveBeenCalledWith({
      messageId: 'stored-message-id',
      query: 'What is DocSearch?',
    });
    expect(props.onAskAiToggle).not.toHaveBeenCalled();
  });
});
