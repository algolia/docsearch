/**
 * Registry of Agent Studio prompt-blocking matchers (cost controls, access, limits).
 * Add cases here instead of scattering regex across call sites.
 * Set `showNewConversationLink` to false to omit the “Start a new conversation … to continue” row when starting over does not fix the issue (for example, domain allowlisting).
 */

export type AgentStudioBlockingMatchContext = {
  message: string;
  messageLower: string;
  parsedJson: Record<string, unknown> | null;
  extractedCodeUpper: string | undefined;
};

export type AgentStudioPromptBlockingMatcher = {
  matches: (ctx: AgentStudioBlockingMatchContext) => boolean;
  showNewConversationLink?: boolean;
};

/** Agent Studio cost / access control codes that block further input. */
export const AGENT_STUDIO_PROMPT_BLOCKING_CODES = new Set([
  'AI-203', // Forbidden (e.g. domain not whitelisted)
  'AI-205', // Rate limited
  'AI-224', // Context / max token length
  'AI-225', // Max agent steps (reserved; also matched by message heuristics)
]);

export function readAgentStudioJsonStringField(o: Record<string, unknown>, key: string): string | undefined {
  for (const [k, v] of Object.entries(o)) {
    if (k.toLowerCase() === key.toLowerCase() && typeof v === 'string' && v.trim() !== '') {
      return v.trim();
    }
  }
  return undefined;
}

export function extractAiErrorCodeFromMessage(message: string): string | undefined {
  const direct = /\b(AI-\d{3})\b/i.exec(message);
  if (direct) return direct[1].toUpperCase();

  try {
    const parsed = JSON.parse(message) as { code?: string; errorCode?: string };
    const c = parsed.code ?? parsed.errorCode;
    if (typeof c === 'string' && /AI-\d{3}/i.test(c)) {
      return c.trim().toUpperCase();
    }
  } catch {
    // ignore
  }

  return undefined;
}

/** Plain-text / stringified JSON heuristic; JSON-shaped payloads still use `isThreadDepthError` in `ai.ts`. */
export function matchesThreadDepthLimitError(normalizedMessage: string): boolean {
  return normalizedMessage.includes('ai-217') || /conversation\s+depth/i.test(normalizedMessage);
}

/** API copy for domain allowlisting — starting a new conversation does not resolve it. */
export function matchesRequestBlockedForThisDomainMessage(normalizedMessage: string): boolean {
  return (
    /\brequest blocked for this domain\b/.test(normalizedMessage) ||
    /\bblocked for this domain\b/.test(normalizedMessage)
  );
}

export function matchesAgentStudioMaxStepsMessage(normalizedMessage: string): boolean {
  const m = normalizedMessage;
  // Explicit phrases only (no nested optional quantifiers — avoids ReDoS / unsafe-regex tooling noise).
  return (
    /\bstep limit\b/.test(m) ||
    /\bmax steps\b/.test(m) ||
    /\bmax step\b/.test(m) ||
    /\bmaximum steps\b/.test(m) ||
    /\bmaximum step\b/.test(m) ||
    /\bmax agent steps\b/.test(m) ||
    /\bmax agent step\b/.test(m) ||
    /\bmaximum agent steps\b/.test(m) ||
    /\bmaximum agent step\b/.test(m)
  );
}

export function matchesAgentStudioRateLimitMessage(normalizedMessage: string): boolean {
  return (
    /\b429\b/.test(normalizedMessage) ||
    /\brate\s*limit/i.test(normalizedMessage) ||
    /\btoo\s+many\s+attempts\b/.test(normalizedMessage) ||
    /\btoo_many_requests\b/.test(normalizedMessage)
  );
}

export function matchesAgentStudioTokenOutputLimitPlainMessage(message: string): boolean {
  return /\bTokenOutputLimitError\b/i.test(message);
}

export function matchesAgentStudioWhitelistOrNotAllowedDomainPlainMessage(normalizedMessage: string): boolean {
  return (
    /\bwhitelist(ed)?\b/.test(normalizedMessage) || /\bnot\s+allowed\s+for\s+this\s+domain\b/.test(normalizedMessage)
  );
}

export function matchesAgentStudioContextOrTokenLimitsPlainMessage(normalizedMessage: string): boolean {
  const m = normalizedMessage;
  return (
    /\bcontext\s+length\b/.test(m) ||
    /\bmax tokens\b/.test(m) ||
    /\bmax token\b/.test(m) ||
    /\bmaximum tokens\b/.test(m) ||
    /\bmaximum token\b/.test(m) ||
    /\btoken\s+limit\b/.test(m) ||
    /\btoken\s+output\b/.test(m) ||
    /\boutput\s+limits?\b/.test(m)
  );
}

function jsonMessageIsRequestBlockedForDomain(parsed: Record<string, unknown>): boolean {
  const msg = readAgentStudioJsonStringField(parsed, 'message') ?? '';
  return matchesRequestBlockedForThisDomainMessage(msg.toLowerCase());
}

/** JSON-shaped errors other than the domain API string in `message` (that case is its own matcher). */
function jsonPayloadImpliesCostControlExcludingRequestBlockedDomainMessage(parsed: Record<string, unknown>): boolean {
  const type = typeof parsed.type === 'string' ? parsed.type : '';
  if (/tokenoutput|outputlimit|steplimit|maxstep|ratelimit|domainnotallowed/i.test(type)) {
    return true;
  }
  const errCode = readAgentStudioJsonStringField(parsed, 'error') ?? '';
  if (errCode.toUpperCase() === 'TOO_MANY_REQUESTS') {
    return true;
  }
  if (
    /token output|output limits|token limits|rate limit|whitelist|step limit|max steps|could not complete response due to token/i.test(
      errCode,
    )
  ) {
    return true;
  }
  const msg = readAgentStudioJsonStringField(parsed, 'message') ?? '';
  if (/rate limit exceeded|retry after \d+/i.test(msg)) {
    return true;
  }
  if (/whitelist/i.test(msg)) {
    return true;
  }
  const lower = msg.toLowerCase();
  const notAllowedAt = lower.indexOf('not allowed');
  if (notAllowedAt !== -1 && lower.indexOf('domain', notAllowedAt) !== -1) {
    return true;
  }
  return false;
}

function buildAgentStudioBlockingContext(error: Error): AgentStudioBlockingMatchContext {
  const message = error.message ?? '';
  const messageLower = message.toLowerCase();
  let parsedJson: Record<string, unknown> | null = null;
  try {
    const p = JSON.parse(message) as Record<string, unknown>;
    if (p && typeof p === 'object' && !Array.isArray(p)) {
      parsedJson = p;
    }
  } catch {
    // not JSON
  }
  return {
    message,
    messageLower,
    parsedJson,
    extractedCodeUpper: extractAiErrorCodeFromMessage(message),
  };
}

/**
 * Ordered registry: first match does not win alone — `resolveAgentStudioPromptBlocking`
 * OR-combines blocking and AND-combines “show new conversation” (any `false` hides the row).
 */
export const agentStudioPromptBlockingMatchers: AgentStudioPromptBlockingMatcher[] = [
  {
    matches: (c) =>
      typeof c.extractedCodeUpper === 'string' && AGENT_STUDIO_PROMPT_BLOCKING_CODES.has(c.extractedCodeUpper),
  },
  {
    matches: (c) => c.parsedJson !== null && jsonMessageIsRequestBlockedForDomain(c.parsedJson),
    showNewConversationLink: false,
  },
  {
    matches: (c) =>
      c.parsedJson !== null && jsonPayloadImpliesCostControlExcludingRequestBlockedDomainMessage(c.parsedJson),
  },
  {
    matches: (c) => matchesAgentStudioTokenOutputLimitPlainMessage(c.message),
    showNewConversationLink: false,
  },
  {
    matches: (c) => matchesAgentStudioRateLimitMessage(c.messageLower),
  },
  {
    matches: (c) => matchesRequestBlockedForThisDomainMessage(c.messageLower),
    showNewConversationLink: false,
  },
  {
    matches: (c) => matchesAgentStudioWhitelistOrNotAllowedDomainPlainMessage(c.messageLower),
  },
  {
    matches: (c) => matchesAgentStudioContextOrTokenLimitsPlainMessage(c.messageLower),
  },
  {
    matches: (c) => matchesAgentStudioMaxStepsMessage(c.messageLower),
  },
];

export function resolveAgentStudioPromptBlocking(error: Error): {
  blocking: boolean;
  showNewConversationLink: boolean;
} {
  const ctx = buildAgentStudioBlockingContext(error);
  const matched = agentStudioPromptBlockingMatchers.filter((m) => m.matches(ctx));
  if (matched.length === 0) {
    return { blocking: false, showNewConversationLink: true };
  }
  const showNewConversationLink = matched.every((m) => m.showNewConversationLink !== false);
  return { blocking: true, showNewConversationLink };
}

/**
 * Plain-text matchers over `Error.message.toLowerCase()` (callers pass `error.message.toLowerCase()`).
 * Conversation depth / AI-217: first entry mirrors common plain cases; JSON-shaped payloads still need `isThreadDepthError` in `ai.ts`.
 *
 * Blocking UX and “Start new conversation” visibility are driven by `agentStudioPromptBlockingMatchers`.
 */
export type NewConversationErrorMatcher = (normalizedMessage: string) => boolean;

export const newConversationErrorMatchers: NewConversationErrorMatcher[] = [
  (m) => matchesThreadDepthLimitError(m),
  (m) => matchesAgentStudioRateLimitMessage(m),
  (m) => matchesRequestBlockedForThisDomainMessage(m),
  (m) => matchesAgentStudioWhitelistOrNotAllowedDomainPlainMessage(m),
  (m) => matchesAgentStudioContextOrTokenLimitsPlainMessage(m),
  (m) => matchesAgentStudioMaxStepsMessage(m),
];
