import { readStringField } from './utils/askAiBlockingMatchers';

export const agentStudioBaseUrl = (appId: string): string =>
  `https://${appId}.algolia.net/agent-studio/1`;

interface AgentStudioValidationError extends Error {
  name: 'ValidationError';
  detail?: Array<{ type: string; loc: string[]; msg: string }>;
}

// Parse Agent Studio errors as they are returned as JSON rather than Markdown/text
export const getAgentStudioErrorMessage = (error: Error): Error => {
  const raw = error.message;
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return new Error(raw);
  }

  let iterations = 0;

  while (typeof parsed === 'string' && iterations < 10) {
    iterations += 1;
    const serializedError = parsed.trim();

    try {
      parsed = JSON.parse(serializedError);
    } catch {
      return new Error(serializedError);
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return new Error(raw);
  }

  const parsedRecord = parsed as Record<string, unknown>;
  const parsedError = parsed as Error & {
    code?: string;
    errorCode?: string;
    error?: string;
  };
  let errorMessage = raw;

  if (parsedError.name === 'ValidationError') {
    const validationError = parsedError as AgentStudioValidationError;

    if (validationError.detail && validationError.detail.length > 0) {
      const { msg, loc } = validationError.detail[0];
      const field = loc.at(-1);

      errorMessage = `${msg}: ${field}`;
    }
  } else {
    errorMessage =
      readStringField(parsedRecord, 'message') ??
      readStringField(parsedRecord, 'error') ??
      raw;
  }

  const code = parsedError.code ?? parsedError.errorCode;

  if (
    typeof code === 'string' &&
    code.trim() &&
    !errorMessage.toUpperCase().includes(code.trim().toUpperCase())
  ) {
    errorMessage = `${errorMessage} (${code.trim()})`;
  }

  return new Error(errorMessage);
};

export const postAgentStudioFeedback = ({
  agentId,
  vote,
  messageId,
  appId,
  apiKey,
  abortSignal,
  notes,
  tags,
}: {
  agentId: string;
  vote: 0 | 1;
  messageId: string;
  appId: string;
  apiKey: string;
  abortSignal: AbortSignal;
  notes?: string;
  tags?: string[];
}): Promise<Response> => {
  const headers = new Headers();
  headers.set('x-algolia-application-id', appId);
  headers.set('x-algolia-api-key', apiKey);
  headers.set('content-type', 'application/json');

  const baseUrl = `${agentStudioBaseUrl(appId)}/feedback`;

  return fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify({
      messageId,
      agentId,
      vote,
      ...(notes ? { notes } : {}),
      ...(tags && tags.length > 0 ? { tags } : {}),
    }),
    headers,
    signal: abortSignal,
  });
};
