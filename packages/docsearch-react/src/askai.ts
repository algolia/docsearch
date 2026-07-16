export const agentStudioBaseUrl = (appId: string): string =>
  `https://${appId}.algolia.net/agent-studio/1`;

interface AgentStudioValidationError extends Error {
  name: 'ValidationError';
  detail?: Array<{ type: string; loc: string[]; msg: string }>;
}

// Parse Agent Studio errors as they are returned as JSON rather than Markdown/text
export const getAgentStudioErrorMessage = (error: Error): Error => {
  let errorMessage = error.message;

  try {
    const parsedError = JSON.parse(error.message) as Error;

    // Check for known errors that we know how to parse
    if (parsedError.name === 'ValidationError') {
      const validationError = parsedError as AgentStudioValidationError;

      if (validationError.detail && validationError.detail.length > 0) {
        const { msg, loc } = validationError.detail[0];
        const field = loc.at(-1);

        errorMessage = `${msg}: ${field}`;
      }
    } else {
      errorMessage = parsedError.message;
    }
  } catch {
    // We don't care about this catch, we default to the error.message above
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
