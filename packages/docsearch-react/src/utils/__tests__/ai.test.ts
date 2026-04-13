import { describe, expect, it } from 'vitest';

import type { AIMessage } from '../../types/AskiAi';
import { filterExchangesForThreadDepthError, getThreadDepthErrorUserFacingMessage, isThreadDepthError } from '../ai';

describe('isThreadDepthError', () => {
  it('detects AI-217 in message (any case)', () => {
    expect(isThreadDepthError(new Error('ai-217: limit'))).toBe(true);
    expect(isThreadDepthError(new Error('prefix AI-217 suffix'))).toBe(true);
  });

  it('detects thread depth phrasing without code', () => {
    expect(isThreadDepthError(new Error('Thread depth exceeded'))).toBe(true);
    expect(isThreadDepthError(new Error('thread depth limit reached'))).toBe(true);
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
      message: 'Conversation has reached its maximum thread depth of 3 messages. Please start a new conversation.',
    });
    expect(getThreadDepthErrorUserFacingMessage(new Error(body))).toBe(
      'Conversation has reached its maximum thread depth of 3 messages. Please start a new conversation.',
    );
  });

  it('returns undefined when not a thread depth error', () => {
    expect(getThreadDepthErrorUserFacingMessage(new Error('Network failed'))).toBeUndefined();
  });
});
