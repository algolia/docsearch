import { describe, expect, it } from 'vitest';

import type { AIMessage } from '../../types/AskiAi';
import {
  filterExchangesForThreadDepthError,
  extractAgentStudioErrorFieldMessage,
  getAskAiBlockingBannerMessage,
  getAskAiPromptBlockingUserFacingMessage,
  getThreadDepthErrorUserFacingMessage,
  isAgentStudioTokenOutputLimitError,
  isAskAiPromptBlockingError,
  isThreadDepthError,
  showAskAiBlockingBannerNewConversationLink,
} from '../ai';

describe('isThreadDepthError', () => {
  it('detects AI-217 in message (any case)', () => {
    expect(isThreadDepthError(new Error('ai-217: limit'))).toBe(true);
    expect(isThreadDepthError(new Error('prefix AI-217 suffix'))).toBe(true);
  });

  it('detects conversation depth phrasing without code', () => {
    expect(
      isThreadDepthError(new Error("You've hit the max conversation depth (4 messages), start a new conversation.")),
    ).toBe(true);
    expect(isThreadDepthError(new Error('Maximum conversation depth reached.'))).toBe(true);
  });

  it('detects AI-217 in JSON-shaped error bodies', () => {
    expect(isThreadDepthError(new Error(JSON.stringify({ code: 'AI-217', message: 'Too deep' })))).toBe(true);
    expect(isThreadDepthError(new Error(JSON.stringify({ errorCode: 'ai-217' })))).toBe(true);
  });

  it('returns false for unrelated errors', () => {
    expect(isThreadDepthError(undefined)).toBe(false);
    expect(isThreadDepthError(new Error('Network failed'))).toBe(false);
    expect(isThreadDepthError(new Error(JSON.stringify({ code: 'AI-214' })))).toBe(false);
  });
});

describe('filterExchangesForThreadDepthError', () => {
  const userOnly = (id: string): { id: string; userMessage: AIMessage; assistantMessage: null } => ({
    id,
    userMessage: { id: `${id}-u`, role: 'user', parts: [{ type: 'text', text: 'q' }] },
    assistantMessage: null,
  });

  const withAssistant = (id: string): { id: string; userMessage: AIMessage; assistantMessage: AIMessage } => ({
    id,
    userMessage: { id: `${id}-u`, role: 'user', parts: [{ type: 'text', text: 'q' }] },
    assistantMessage: { id: `${id}-a`, role: 'assistant', parts: [{ type: 'text', text: 'a' }] },
  });

  it('keeps trailing user-only exchange when thread depth failed so the last prompt stays visible', () => {
    const exchanges = [withAssistant('1'), userOnly('2')];
    expect(filterExchangesForThreadDepthError(exchanges, true)).toEqual(exchanges);
  });

  it('leaves exchanges unchanged when not a thread depth error', () => {
    const exchanges = [withAssistant('1'), userOnly('2')];
    expect(filterExchangesForThreadDepthError(exchanges, false)).toEqual(exchanges);
  });

  it('does not remove exchanges when an assistant reply exists', () => {
    const exchanges = [withAssistant('1'), withAssistant('2')];
    expect(filterExchangesForThreadDepthError(exchanges, true)).toEqual(exchanges);
  });
});

describe('getThreadDepthErrorUserFacingMessage', () => {
  it('returns nested message from JSON-shaped thread depth errors', () => {
    const body = JSON.stringify({
      message: "You've hit the max conversation depth (4 messages), start a new conversation.",
    });
    expect(getThreadDepthErrorUserFacingMessage(new Error(body))).toBe(
      "You've hit the max conversation depth (4 messages), start a new conversation.",
    );
  });

  it('returns undefined when not a thread depth error', () => {
    expect(getThreadDepthErrorUserFacingMessage(new Error('Network failed'))).toBeUndefined();
  });
});

describe('isAskAiPromptBlockingError (Agent Studio cost controls)', () => {
  it('detects API codes when agentStudio is true', () => {
    expect(isAskAiPromptBlockingError(new Error('x (AI-203)'), true)).toBe(true);
    expect(isAskAiPromptBlockingError(new Error('x (AI-205)'), true)).toBe(true);
    expect(isAskAiPromptBlockingError(new Error('x (AI-224)'), true)).toBe(true);
  });

  it('does not treat Agent Studio codes as blocking when agentStudio is false', () => {
    expect(isAskAiPromptBlockingError(new Error('x (AI-205)'), false)).toBe(false);
  });

  it('still blocks thread depth when agentStudio is false', () => {
    expect(isAskAiPromptBlockingError(new Error('AI-217'), false)).toBe(true);
  });

  it('matches message heuristics when agentStudio is true', () => {
    expect(isAskAiPromptBlockingError(new Error('Rate limit exceeded'), true)).toBe(true);
    expect(isAskAiPromptBlockingError(new Error('Domain is not whitelisted'), true)).toBe(true);
    expect(isAskAiPromptBlockingError(new Error('Maximum token limit reached'), true)).toBe(true);
    expect(isAskAiPromptBlockingError(new Error('Maximum steps exceeded'), true)).toBe(true);
  });

  it('omits “Start new conversation” for domain-block API copy but keeps it for other blocks', () => {
    expect(showAskAiBlockingBannerNewConversationLink(new Error('Request blocked for this domain'), true)).toBe(false);
    expect(
      showAskAiBlockingBannerNewConversationLink(
        new Error(JSON.stringify({ message: 'Request blocked for this domain' })),
        true,
      ),
    ).toBe(false);
    expect(showAskAiBlockingBannerNewConversationLink(new Error('Domain is not whitelisted'), true)).toBe(true);
    expect(showAskAiBlockingBannerNewConversationLink(new Error('Rate limit exceeded'), true)).toBe(true);
    expect(showAskAiBlockingBannerNewConversationLink(new Error('AI-217'), false)).toBe(true);
    expect(showAskAiBlockingBannerNewConversationLink(new Error('AI-217'), true)).toBe(true);
    const tokenRaw = JSON.stringify({
      error: 'Could not complete response due to token output limits',
      type: 'TokenOutputLimitError',
      statusCode: 400,
    });
    expect(showAskAiBlockingBannerNewConversationLink(new Error(tokenRaw), true)).toBe(false);
  });

  it('detects Agent Studio JSON token output limit errors', () => {
    const raw = JSON.stringify({
      error: 'Could not complete response due to token output limits',
      type: 'TokenOutputLimitError',
      statusCode: 400,
    });
    expect(isAskAiPromptBlockingError(new Error(raw), true)).toBe(true);
    expect(getAskAiPromptBlockingUserFacingMessage(new Error(raw))).toBe(
      'Could not complete response due to token output limits',
    );
    expect(isAgentStudioTokenOutputLimitError(new Error(raw))).toBe(true);
    expect(isAgentStudioTokenOutputLimitError(new Error('Too many requests (AI-205)'))).toBe(false);
  });
});

describe('getAskAiPromptBlockingUserFacingMessage', () => {
  it('strips a trailing (AI-xxx) suffix from transformed Agent Studio errors', () => {
    expect(getAskAiPromptBlockingUserFacingMessage(new Error('Too many requests (AI-205)'))).toBe('Too many requests');
  });
});

describe('getAskAiBlockingBannerMessage', () => {
  it('returns the token-output fallback when the error is token limit but the message is empty', () => {
    expect(
      getAskAiBlockingBannerMessage(new Error(JSON.stringify({ type: 'TokenOutputLimitError', statusCode: 400 }))),
    ).toBe('Could not complete response due to token output limits');
  });
});

describe('extractAgentStudioErrorFieldMessage', () => {
  it('reads error from normal JSON', () => {
    const raw = JSON.stringify({
      error: 'Could not complete response due to token output limits',
      type: 'TokenOutputLimitError',
      statusCode: 400,
    });
    expect(extractAgentStudioErrorFieldMessage(raw)).toBe('Could not complete response due to token output limits');
  });

  it('reads error from JSON with escaped quotes (serialized twice)', () => {
    const inner = JSON.stringify({
      error: 'Could not complete response due to token output limits',
      type: 'TokenOutputLimitError',
      statusCode: 400,
    });
    const raw = JSON.stringify(inner);
    expect(extractAgentStudioErrorFieldMessage(raw)).toBe('Could not complete response due to token output limits');
  });

  it('reads error from brace payload with backslash-escaped quotes', () => {
    const raw =
      '{\\"error\\": \\"Could not complete response due to token output limits\\", \\"type\\": \\"TokenOutputLimitError\\", \\"statusCode\\": 400}';
    expect(extractAgentStudioErrorFieldMessage(raw)).toBe('Could not complete response due to token output limits');
  });

  it('treats domain-not-allowed style messages as Agent Studio prompt-blocking', () => {
    expect(isAskAiPromptBlockingError(new Error('Request blocked for this domain'), true)).toBe(true);
    expect(getAskAiBlockingBannerMessage(new Error('Request blocked for this domain'))).toBe(
      'Request blocked for this domain',
    );
  });

  it('prefers message over machine error code (TOO_MANY_REQUESTS)', () => {
    const raw = JSON.stringify({
      error: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded. Retry after 60 seconds.',
    });
    expect(extractAgentStudioErrorFieldMessage(raw)).toBe('Rate limit exceeded. Retry after 60 seconds.');
    expect(isAskAiPromptBlockingError(new Error(raw), true)).toBe(true);
    expect(getAskAiBlockingBannerMessage(new Error(raw))).toBe('Rate limit exceeded. Retry after 60 seconds.');
  });
});
