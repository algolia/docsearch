import type { TextUIPart } from 'ai';

import type { StoredAskAiState } from '../types';
import type { AIMessage } from '../types/AskiAi';

import {
  matchesThreadDepthLimitError,
  readAgentStudioJsonStringField,
  resolveAgentStudioPromptBlocking,
} from './askAiBlockingMatchers';
import { sanitizeUserInput } from './sanitize';

type ExtractedLink = {
  url: string;
  title?: string;
};

// utility to extract links (markdown and bare urls) from a string
export function extractLinksFromMessage(message: AIMessage | null): ExtractedLink[] {
  const links: ExtractedLink[] = [];
  // Used to dedupe multiple urls
  const seen = new Set<string>();

  if (!message) {
    return [];
  }

  message.parts.forEach((part) => {
    if (part.type !== 'text') {
      return;
    }

    if (part.text.length === 0) {
      return;
    }

    const markdownLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    const plainLinkRegex = /(?<!\]\()https?:\/\/[^\s<>"{}|\\^`[\]]+/g;

    // Strip out all code blocks e.g. ```
    const textWithoutCodeBlocks = part.text.replace(/```[\s\S]*?```/g, '');

    // Strip out all inline code blocks e.g. `
    const cleanText = textWithoutCodeBlocks.replace(/`[^`]*`/g, '');

    // Get all markdown based links e.g. []()
    const markdownMatches = cleanText.matchAll(markdownLinkRegex);

    // Parses the title and url from the found links
    for (const match of markdownMatches) {
      const title = match[1].trim();
      const url = match[2];

      if (!seen.has(url)) {
        seen.add(url);
        links.push({ url, title: title || undefined });
      }
    }

    // Get all "plain" links e.g. https://algolia.com/doc
    const plainUrls = cleanText.matchAll(plainLinkRegex);

    for (const match of plainUrls) {
      // Strip any extra punctuation
      const cleanUrl = match[0].replace(/[.,;:!?]+$/, '');

      if (!seen.has(cleanUrl)) {
        seen.add(cleanUrl);
        links.push({ url: cleanUrl });
      }
    }
  });

  return links;
}

export const buildDummyAskAiHit = (query: string, messages: AIMessage[]): StoredAskAiState => {
  const textPart = messages[0].parts.find((part) => part.type === 'text');
  const sanitizedText = textPart?.text ? sanitizeUserInput(textPart.text) : '';

  return {
    query,
    objectID: sanitizedText,
    messages,
    type: 'askAI',
    anchor: 'stored',
    // dummy content to make it a valid hit
    // this is useful to show it among other hits
    content: null,
    hierarchy: {
      lvl0: 'askAI',
      lvl1: sanitizedText, // use first message as hit name (sanitized to prevent XSS)
      lvl2: null,
      lvl3: null,
      lvl4: null,
      lvl5: null,
      lvl6: null,
    },
    url: '',
    url_without_anchor: '',
  };
};

export const getMessageContent = (message: AIMessage | null): TextUIPart | undefined =>
  message?.parts.find((part) => part.type === 'text');

type ExchangeWithOptionalAssistant = {
  assistantMessage: AIMessage | null;
};

/**
 * Pass-through: keep all exchanges when thread depth fails so the last user message stays visible
 * (there is often no assistant reply for that turn).
 */
export function filterExchangesForThreadDepthError<T extends ExchangeWithOptionalAssistant>(
  exchanges: T[],
  _hasThreadDepthError: boolean,
): T[] {
  return exchanges;
}

function threadDepthFromPlainText(message: string): boolean {
  if (!message) return false;
  return matchesThreadDepthLimitError(message.toLowerCase());
}

function messageLooksLikeThreadDepth(message: string): boolean {
  if (threadDepthFromPlainText(message)) return true;

  try {
    const parsed = JSON.parse(message) as {
      code?: string;
      errorCode?: string;
      message?: string;
    };
    const code = parsed.code ?? parsed.errorCode;
    if (typeof code === 'string' && code.toUpperCase() === 'AI-217') {
      return true;
    }
    const nested = typeof parsed.message === 'string' ? parsed.message : '';
    return threadDepthFromPlainText(nested);
  } catch {
    return false;
  }
}

/**
 * Whether the error is thread depth exceeded (AI-217), including JSON-shaped Agent Studio payloads.
 */
export function isThreadDepthError(error?: Error): boolean {
  if (!error) return false;

  return messageLooksLikeThreadDepth(error.message ?? '');
}

function messageLooksLikeAgentStudioCostControl(error: Error): boolean {
  return resolveAgentStudioPromptBlocking(error).blocking;
}

/**
 * Whether further prompts should be blocked: thread depth (all backends) or Agent Studio cost controls.
 */
export function isAskAiPromptBlockingError(error: Error | undefined, agentStudio: boolean): boolean {
  if (!error) return false;
  if (isThreadDepthError(error)) return true;
  if (!agentStudio) return false;
  return messageLooksLikeAgentStudioCostControl(error);
}

/**
 * Agent Studio stream hit the completion token ceiling (`TokenOutputLimitError`).
 * This case uses a message-only banner (no “Start a new conversation” row).
 */
export function isAgentStudioTokenOutputLimitError(error?: Error): boolean {
  if (!error) return false;
  const msg = error.message ?? '';
  if (/TokenOutputLimitError/i.test(msg)) return true;
  if (/could not complete response due to token output limits/i.test(msg)) return true;
  try {
    const p = JSON.parse(msg) as { type?: string; error?: string };
    if (typeof p.type === 'string' && /^TokenOutputLimitError$/i.test(p.type.trim())) {
      return true;
    }
    if (typeof p.error === 'string' && /token output limits/i.test(p.error)) {
      return true;
    }
  } catch {
    // not JSON
  }
  return false;
}

/**
 * Whether the blocking banner should include “Start a new conversation … to continue”.
 * Thread depth and most Agent Studio limits keep it; token output limit and “request blocked for this domain” omit it.
 */
export function showAskAiBlockingBannerNewConversationLink(error: Error | undefined, agentStudio: boolean): boolean {
  if (!error) return true;
  if (isAgentStudioTokenOutputLimitError(error)) return false;
  if (isThreadDepthError(error)) return true;
  if (!agentStudio) return true;
  return resolveAgentStudioPromptBlocking(error).showNewConversationLink;
}

function stripTrailingAiCodeSuffix(message: string): string {
  return message.replace(/\s*\(AI-\d{3}\)\s*$/i, '').trim();
}

/**
 * Pulls `message` or `error` from Agent Studio JSON payloads, including double-encoded JSON
 * and objects serialized with escaped quotes (`{\"error\": \"...\"}`).
 */
export function extractAgentStudioErrorFieldMessage(raw: string): string | undefined {
  let s = raw.trim();
  if (!s) return undefined;

  let iterations = 0;
  while (iterations < 10) {
    iterations += 1;
    try {
      const v: unknown = JSON.parse(s);
      if (typeof v === 'string') {
        const next = v.trim();
        if (!next) return undefined;
        s = next;
      } else if (v && typeof v === 'object' && !Array.isArray(v)) {
        const o = v as Record<string, unknown>;
        const msg = readAgentStudioJsonStringField(o, 'message');
        if (msg) {
          return msg;
        }
        const err = readAgentStudioJsonStringField(o, 'error');
        if (err) {
          return err;
        }
        return undefined;
      } else {
        return undefined;
      }
    } catch {
      if (/\\"/.test(s)) {
        s = s.replace(/\\"/g, '"').replace(/\\\\/g, '\\').trim();
      } else {
        const mMsg = /"message"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(s);
        if (mMsg?.[1]) {
          return mMsg[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\').trim();
        }
        const mErr = /"error"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(s);
        if (mErr?.[1]) {
          return mErr[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\').trim();
        }
        return undefined;
      }
    }
  }

  return undefined;
}

/**
 * Prefer the API `message` when the body was JSON; otherwise the thrown message (without a trailing `(AI-xxx)` suffix).
 * Only meaningful when {@link isAskAiPromptBlockingError} would return true for this error.
 */
export function getAskAiPromptBlockingUserFacingMessage(error?: Error): string | undefined {
  if (!error) return undefined;

  const raw = error.message ?? '';
  const extracted = extractAgentStudioErrorFieldMessage(raw);
  if (extracted) {
    return extracted;
  }

  const stripped = stripTrailingAiCodeSuffix(raw.trim());
  return stripped !== '' ? stripped : undefined;
}

const TOKEN_OUTPUT_LIMIT_FALLBACK = 'Could not complete response due to token output limits';

function looksLikeJsonObjectString(s: string): boolean {
  const t = s.trim();
  return t.startsWith('{') && t.endsWith('}');
}

/**
 * Message shown in the top blocking banner (parsed API text, never raw JSON when avoidable).
 */
export function getAskAiBlockingBannerMessage(error?: Error): string | undefined {
  if (!error) return undefined;

  if (isAgentStudioTokenOutputLimitError(error)) {
    const m = getAskAiPromptBlockingUserFacingMessage(error);
    if (m && !looksLikeJsonObjectString(m)) {
      return m;
    }
    return TOKEN_OUTPUT_LIMIT_FALLBACK;
  }

  return getAskAiPromptBlockingUserFacingMessage(error);
}

/**
 * Prefer the API `message` field when the error body is JSON; otherwise the thrown message string.
 * Only meaningful when {@link isThreadDepthError} is true.
 */
export function getThreadDepthErrorUserFacingMessage(error?: Error): string | undefined {
  if (!error || !isThreadDepthError(error)) return undefined;

  return getAskAiPromptBlockingUserFacingMessage(error);
}
