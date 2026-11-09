import { describe, expect, it } from 'vitest';

import type { AIMessage } from '../types/AskiAi';
import {
  resolveGuardrailFallback,
  sanitizeMessagesForRequest,
} from '../utils/ai';

function message(fallbackResponse?: string): AIMessage {
  return {
    id: 'answer',
    role: 'assistant',
    parts: [
      { type: 'text', text: 'I' },
      {
        type: 'data-guardrail-violation',
        data: {
          category: 'off_topic_questions',
          guardrailType: 'input',
          fallbackResponse,
        },
      },
    ],
  };
}

describe('guardrail fallback', () => {
  it('replaces interrupted text without mutating the SDK message', () => {
    const original = message('Please ask about the documentation.');
    const resolved = resolveGuardrailFallback(original);
    expect(resolved.parts.filter((part) => part.type === 'text')).toEqual([
      { type: 'text', text: 'Please ask about the documentation.', state: 'done' },
    ]);
    expect(original.parts[0]).toEqual({ type: 'text', text: 'I' });
    expect(resolveGuardrailFallback(resolved)).toEqual(resolved);
  });

  it.each([undefined, ''])('preserves text when the fallback is %j', (fallback) => {
    const original = message(fallback);
    expect(resolveGuardrailFallback(original)).toBe(original);
  });

  it('sends the fallback as conversation context without the data event', () => {
    expect(sanitizeMessagesForRequest([message('Fallback')])[0].parts).toEqual([
      { type: 'text', text: 'Fallback', state: 'done' },
    ]);
  });
});
