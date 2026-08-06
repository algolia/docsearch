interface BlockingMatchContext {
  message: string;
  messageLower: string;
  parsedJson: Record<string, unknown> | null;
  code: string | undefined;
}

interface BlockingMatcher {
  matches: (context: BlockingMatchContext) => boolean;
  showNewConversationLink?: boolean;
}

const PROMPT_BLOCKING_CODES = new Set(['AI-203', 'AI-205', 'AI-224', 'AI-225']);

export function readStringField(
  value: Record<string, unknown>,
  key: string
): string | undefined {
  for (const [field, fieldValue] of Object.entries(value)) {
    if (
      field.toLowerCase() === key.toLowerCase() &&
      typeof fieldValue === 'string' &&
      fieldValue.trim() !== ''
    ) {
      return fieldValue.trim();
    }
  }

  return undefined;
}

function extractErrorCode(message: string): string | undefined {
  const directMatch = /\b(AI-\d{3})\b/i.exec(message);

  if (directMatch) {
    return directMatch[1].toUpperCase();
  }

  return undefined;
}

function parseJson(message: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(message);

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Plain-text errors are handled by the other matchers.
  }

  return null;
}

function matchesDomainBlock(message: string): boolean {
  return (
    /\brequest blocked for this domain\b/.test(message) ||
    /\bblocked for this domain\b/.test(message)
  );
}

function matchesRateLimit(message: string): boolean {
  return (
    /\b429\b/.test(message) ||
    /\brate\s*limit/.test(message) ||
    /\bretry\s+after\s+\d+/.test(message) ||
    /\btoo\s+many\s+attempts\b/.test(message) ||
    /\btoo_many_requests\b/.test(message)
  );
}

function matchesTokenOutputLimit(message: string): boolean {
  return (
    /\btokenoutputlimiterror\b/.test(message) ||
    /could not complete response due to token output limits/.test(message)
  );
}

function matchesAccessOrLimit(message: string): boolean {
  return (
    /\bwhitelist(?:ed)?\b/.test(message) ||
    /\bnot\s+allowed\s+for\s+this\s+domain\b/.test(message) ||
    /\bcontext\s+length\b/.test(message) ||
    /\b(?:max|maximum)\s+tokens?\b/.test(message) ||
    /\btoken\s+limit\b/.test(message) ||
    /\btoken\s+output\b/.test(message) ||
    /\boutput\s+limits?\b/.test(message) ||
    /\bstep\s+limit\b/.test(message) ||
    /\b(?:max|maximum)(?:\s+agent)?\s+steps?\b/.test(message)
  );
}

function jsonImpliesCostControl(value: Record<string, unknown>): boolean {
  const type = readStringField(value, 'type') ?? '';
  const error = readStringField(value, 'error') ?? '';
  const message = readStringField(value, 'message') ?? '';

  return (
    /tokenoutput|outputlimit|steplimit|maxstep|ratelimit|domainnotallowed/i.test(
      type
    ) ||
    error.toUpperCase() === 'TOO_MANY_REQUESTS' ||
    matchesRateLimit(`${error} ${message}`.toLowerCase()) ||
    matchesAccessOrLimit(`${error} ${message}`.toLowerCase())
  );
}

const BLOCKING_MATCHERS: BlockingMatcher[] = [
  {
    matches: ({ code }) => Boolean(code && PROMPT_BLOCKING_CODES.has(code)),
  },
  {
    matches: ({ parsedJson }) =>
      Boolean(
        parsedJson &&
        matchesDomainBlock(
          (readStringField(parsedJson, 'message') ?? '').toLowerCase()
        )
      ),
    showNewConversationLink: false,
  },
  {
    matches: ({ parsedJson }) =>
      Boolean(parsedJson && jsonImpliesCostControl(parsedJson)),
  },
  {
    matches: ({ messageLower }) => matchesTokenOutputLimit(messageLower),
    showNewConversationLink: false,
  },
  {
    matches: ({ messageLower }) => matchesRateLimit(messageLower),
  },
  {
    matches: ({ messageLower }) => matchesDomainBlock(messageLower),
    showNewConversationLink: false,
  },
  {
    matches: ({ messageLower }) => matchesAccessOrLimit(messageLower),
  },
];

export function resolvePromptBlockingError(error: Error): {
  blocking: boolean;
  showNewConversationLink: boolean;
} {
  const message = error.message ?? '';
  const context: BlockingMatchContext = {
    message,
    messageLower: message.toLowerCase(),
    parsedJson: parseJson(message),
    code: extractErrorCode(message),
  };
  const matches = BLOCKING_MATCHERS.filter((matcher) =>
    matcher.matches(context)
  );

  return {
    blocking: matches.length > 0,
    showNewConversationLink: matches.every(
      (matcher) => matcher.showNewConversationLink !== false
    ),
  };
}

export function isTokenOutputLimitError(error?: Error): boolean {
  return Boolean(
    error && matchesTokenOutputLimit((error.message ?? '').toLowerCase())
  );
}
