import { render } from '@testing-library/react';
import type { UIMessage } from 'ai';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DocSearchAskAiModal } from '../DocSearchAskAiModal';

const mocks = vi.hoisted(() => ({
  startNewConversation: vi.fn(),
  useAskAi: vi.fn(),
}));

vi.mock('../useAskAi', () => ({
  useAskAi: mocks.useAskAi,
}));

describe('DocSearchAskAiModal', () => {
  let messages: UIMessage[] = [];

  beforeEach(() => {
    messages = [];
    mocks.startNewConversation.mockReset();
    mocks.useAskAi.mockImplementation(() => ({
      askAiError: undefined,
      chatId: 'chat-id',
      conversations: { add: vi.fn(), getAll: () => [] },
      exchanges: [],
      isStreaming: false,
      messages,
      restoreConversation: vi.fn(),
      sendFeedback: vi.fn(),
      sendMessage: vi.fn(),
      setMessages: vi.fn(),
      startNewConversation: mocks.startNewConversation,
      status: 'ready',
      stopAskAiStreaming: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not reset a conversation when its first message arrives before Ask AI activates', () => {
    const props = {
      apiKey: 'api-key',
      appId: 'app-id',
      askAi: 'agent-id',
      indices: ['index-name'],
      initialScrollY: 0,
      onAskAiToggle: vi.fn(),
    };
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
});
