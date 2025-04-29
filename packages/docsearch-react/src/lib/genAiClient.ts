export interface AskAiResponse {
  response: string;
  additionalFilters: string[];
  context: Array<{ title?: string; url?: string; objectID: string }>;
  conversationID: string;
  createdAt: string;
  query: string;
  metadata: Record<string, any>;
}

export interface GenAiClientOptions {
  dataSourceId?: string;
  promptId?: string;
}

export interface GenAiClient {
  appId: string;
  apiKey: string;
  dataSourceId?: string;
  promptId?: string;
  fetchAskAiResponse: (params: Omit<FetchAskAiResponseParams, 'genAiClient'>) => Promise<AskAiResponse>;
}

const BASE_URL = 'https://generative-ai.algolia.com';

export function algoliaGenAiToolkit(appId: string, apiKey: string, options: GenAiClientOptions): GenAiClient {
  const client: Omit<GenAiClient, 'fetchAskAiResponse'> = {
    appId,
    apiKey,
    ...options,
  };

  return {
    ...client,
    fetchAskAiResponse: (params) =>
      fetchAskAiResponseFunction({
        ...params,
        genAiClient: client as GenAiClient,
      }),
  };
}

export interface FetchAskAiResponseParams {
  query: string;
  genAiClient: GenAiClient;
  additionalFilters?: Record<string, any>;
  onUpdate: (chunk: AskAiResponse) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

async function fetchAskAiResponseFunction({
  query,
  genAiClient,
  additionalFilters,
  onUpdate,
  onComplete,
  onError,
}: FetchAskAiResponseParams): Promise<AskAiResponse> {
  const { appId, apiKey, dataSourceId, promptId } = genAiClient;
  let finalResponse: AskAiResponse | null = null;

  // Helper function to process a single SSE line
  function processSseLine(
    line: string,
    context: string, // 'chunk' or 'final chunk' for error messages
  ): AskAiResponse | null {
    if (!line.startsWith('data:')) {
      return null;
    }
    const jsonString = line.substring(5).trim();
    if (!jsonString) {
      return null;
    }
    try {
      const chunk = JSON.parse(jsonString) as AskAiResponse;
      onUpdate(chunk);
      return chunk;
    } catch (e) {
      if (onError) {
        onError(e instanceof Error ? e : new Error(`failed to parse sse ${context}`));
      }
      return null;
    }
  }

  try {
    const response = await fetch(`${BASE_URL}/generate/response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-Application-Id': appId,
        'X-Algolia-API-Key': apiKey,
      },
      body: JSON.stringify({
        query,
        dataSourceId,
        promptId,
        additionalFilters,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Ask AI request failed with status ${response.status}: ${errorBody}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const chunk = processSseLine(line, 'chunk');
        if (chunk) {
          finalResponse = chunk;
        }
      }
    }

    // Process any remaining data in the buffer
    const finalChunk = processSseLine(buffer, 'final chunk');
    if (finalChunk) {
      finalResponse = finalChunk;
    }

    if (onComplete) {
      onComplete();
    }

    if (!finalResponse) {
      throw new Error('No valid response was received');
    }

    return finalResponse;
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error('unknown stream error'));
    }
    throw error;
  }
}
