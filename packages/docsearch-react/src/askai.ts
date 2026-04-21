import { ASK_AI_API_URL, BETA_ASK_AI_API_URL } from './constants';
import { extractAgentStudioErrorFieldMessage } from './utils/ai';

const TOKEN_KEY = 'askai_token';

export const agentStudioBaseUrl = (appId: string): string => `https://${appId}.algolia.net/agent-studio/1`;

type TokenPayload = { exp: number };

const decode = (token: string): TokenPayload => {
  const [b64] = token.split('.');
  return JSON.parse(atob(b64));
};

const isExpired = (token?: string | null): boolean => {
  if (!token) return true;
  try {
    const { exp } = decode(token);
    // refresh 30 s before the backend rejects it
    return Date.now() / 1000 > exp - 30;
  } catch {
    return true;
  }
};

let inflight: Promise<string> | null = null;

// call /token once, cache the promise while it’s running
export const getValidToken = async ({
  assistantId,
  abortSignal,
  useStagingEnv = false,
}: {
  assistantId: string;
  abortSignal: AbortSignal;
  useStagingEnv?: boolean;
  // eslint-disable-next-line require-await
}): Promise<string | null> => {
  const cached = sessionStorage.getItem(TOKEN_KEY);
  if (!isExpired(cached)) return cached!;

  const baseUrl = useStagingEnv ? BETA_ASK_AI_API_URL : ASK_AI_API_URL;

  if (!inflight) {
    inflight = fetch(`${baseUrl}/token`, {
      method: 'POST',
      headers: {
        'x-algolia-assistant-id': assistantId,
        'content-type': 'application/json',
      },
      signal: abortSignal,
    })
      .then((r) => r.json())
      .then(({ token, success, message }) => {
        // If request was unsuccessful, throw an error to prevent calling `/chat` without a token
        if (!success && message) {
          throw new Error(message);
        }

        sessionStorage.setItem(TOKEN_KEY, token);
        return token;
      })
      .finally(() => (inflight = null));
  }

  return inflight;
};

export const postFeedback = async ({
  assistantId,
  thumbs,
  messageId,
  appId,
  abortSignal,
  useStagingEnv = false,
}: {
  assistantId: string;
  thumbs: 0 | 1;
  messageId: string;
  appId: string;
  abortSignal: AbortSignal;
  useStagingEnv?: boolean;
}): Promise<Response> => {
  const headers = new Headers();
  headers.set('x-algolia-assistant-id', assistantId);
  headers.set('content-type', 'application/json');

  const token = await getValidToken({
    assistantId,
    abortSignal,
    useStagingEnv,
  });
  headers.set('authorization', `TOKEN ${token}`);

  const baseUrl = useStagingEnv ? BETA_ASK_AI_API_URL : ASK_AI_API_URL;

  return fetch(`${baseUrl}/feedback`, {
    method: 'POST',
    body: JSON.stringify({
      appId,
      messageId,
      thumbs,
    }),
    headers,
  });
};

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
    const extracted = extractAgentStudioErrorFieldMessage(raw);
    return new Error(extracted ?? raw);
  }

  while (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed.trim());
    } catch {
      const extracted = extractAgentStudioErrorFieldMessage(raw);
      return new Error(extracted ?? (parsed as string));
    }
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    const extracted = extractAgentStudioErrorFieldMessage(raw);
    return new Error(extracted ?? raw);
  }

  const parsedError = parsed as Error & {
    code?: string;
    errorCode?: string;
    message?: string;
    error?: string;
  };

  if (parsedError.name === 'ValidationError') {
    const validationError = parsedError as AgentStudioValidationError;
    let errorMessage = raw;
    if (validationError.detail && validationError.detail.length > 0) {
      const { msg, loc } = validationError.detail[0];
      const field = loc.at(-1);
      errorMessage = `${msg}: ${field}`;
    }
    return new Error(errorMessage);
  }

  const extracted = extractAgentStudioErrorFieldMessage(raw);
  let errorMessage: string;
  if (extracted) {
    errorMessage = extracted;
  } else if (typeof parsedError.message === 'string' && parsedError.message.trim() !== '') {
    errorMessage = parsedError.message.trim();
  } else if (typeof parsedError.error === 'string' && parsedError.error.trim() !== '') {
    errorMessage = parsedError.error.trim();
  } else {
    errorMessage = raw;
  }

  const code = parsedError.code ?? parsedError.errorCode;
  if (typeof code === 'string' && code.trim() !== '') {
    const c = code.trim();
    if (!errorMessage.toUpperCase().includes(c.toUpperCase())) {
      errorMessage = `${errorMessage} (${c})`;
    }
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
}: {
  agentId: string;
  vote: 0 | 1;
  messageId: string;
  appId: string;
  apiKey: string;
  abortSignal: AbortSignal;
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
    }),
    headers,
    signal: abortSignal,
  });
};
