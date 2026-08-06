import type { TextUIPart } from 'ai';

import type { StoredAskAiState } from '../types';
import type {
  AggregatedToolCallPart,
  AIMessage,
  AIMessagePart,
  AIToolPart,
  AlgoliaMCPSearchOutputPart,
  SearchIndexOutputPart,
  SearchOutputPart,
  SearchToolPart,
  ToolCalls,
} from '../types/AskiAi';

import {
  isTokenOutputLimitError,
  readStringField,
  resolvePromptBlockingError,
} from './askAiBlockingMatchers';
import { sanitizeUrl, sanitizeUserInput } from './sanitize';

export interface ExtractedLink {
  url: string;
  title?: string;
}

// utility to extract links (markdown and bare urls) from a string
export function extractLinksFromMessage(
  message: AIMessage | null
): ExtractedLink[] {
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
      const url = sanitizeUrl(match[2]);

      if (url && !seen.has(url)) {
        seen.add(url);
        links.push({ url, title: title || undefined });
      }
    }

    // Get all "plain" links e.g. https://algolia.com/doc
    const plainUrls = cleanText.matchAll(plainLinkRegex);

    for (const match of plainUrls) {
      // Strip any extra punctuation
      const cleanUrl = sanitizeUrl(match[0].replace(/[.,;:!?]+$/, ''));

      if (cleanUrl && !seen.has(cleanUrl)) {
        seen.add(cleanUrl);
        links.push({ url: cleanUrl });
      }
    }
  });

  return links;
}

export const buildDummyAskAiHit = (
  query: string,
  messages: AIMessage[],
  chatId?: string
): StoredAskAiState => {
  const textPart = messages[0].parts.find((part) => part.type === 'text');
  const sanitizedText = textPart?.text ? sanitizeUserInput(textPart.text) : '';

  return {
    query,
    objectID: sanitizedText,
    chatId,
    messages,
    type: 'askAI',
    anchor: 'stored',
    // dummy content to make it a valid hit
    // this is useful to show it among other hits
    content: null,
    hierarchy: {
      lvl0: 'askAI',
      lvl1: sanitizedText, // use first message as hit name (sanitized to prevent XSS)
      lvl2: new Date().toISOString(),
      lvl3: null,
      lvl4: null,
      lvl5: null,
      lvl6: null,
    },
    url: '',
    url_without_anchor: '',
  };
};

// answers can interleave text with tool calls, so join every text part
// instead of stopping at the first one
// see https://github.com/algolia/docsearch/issues/2782
export const getMessageContent = (message: AIMessage | null): string =>
  (message?.parts ?? [])
    .filter((part): part is TextUIPart => part.type === 'text')
    .map((part) => part.text)
    .join('\n\n');

/** Helper function to check if an error reports the conversation depth limit. */
export function isThreadDepthError(error?: Error): boolean {
  if (!error) return false;

  return /(?:ai-217|conversation\s+depth)/i.test(error.message ?? '');
}

export function isAskAiPromptBlockingError(error?: Error): boolean {
  return Boolean(
    error &&
    (isThreadDepthError(error) || resolvePromptBlockingError(error).blocking)
  );
}

export function isAgentStudioTokenOutputLimitError(error?: Error): boolean {
  return isTokenOutputLimitError(error);
}

export function showAskAiBlockingBannerNewConversationLink(
  error?: Error
): boolean {
  if (!error || isThreadDepthError(error)) {
    return true;
  }

  return resolvePromptBlockingError(error).showNewConversationLink;
}

function extractAgentStudioErrorFieldMessage(raw: string): string | undefined {
  let value = raw.trim();

  for (let iteration = 0; iteration < 10 && value; iteration++) {
    try {
      const parsed: unknown = JSON.parse(value);

      if (typeof parsed === 'string') {
        value = parsed.trim();
        continue;
      }

      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const record = parsed as Record<string, unknown>;
        const message = readStringField(record, 'message');
        const error = readStringField(record, 'error');

        if (message) {
          return message;
        }

        if (error) {
          return error;
        }
      }

      const fieldMatch =
        /"message"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(value) ??
        /"error"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(value);

      return fieldMatch?.[1]
        ?.replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .trim();
    } catch {
      if (value.includes('\\"')) {
        value = value.replace(/\\"/g, '"').replace(/\\\\/g, '\\').trim();
        continue;
      }

      return undefined;
    }
  }

  return undefined;
}

export function getAskAiBlockingBannerMessage(
  error?: Error
): string | undefined {
  if (!error) {
    return undefined;
  }

  const extracted = extractAgentStudioErrorFieldMessage(error.message ?? '');
  const isCodeOnlyThreadDepthError =
    isThreadDepthError(error) &&
    (/^\s*AI-217\s*$/i.test(error.message) ||
      (/^\s*\{.*\}\s*$/.test(error.message) && !extracted));

  if (isCodeOnlyThreadDepthError) {
    return undefined;
  }

  const message = (
    extracted ?? error.message.replace(/\s*\(AI-\d{3}\)\s*$/i, '')
  ).trim();

  if (message && !(message.startsWith('{') && message.endsWith('}'))) {
    return message;
  }

  if (isAgentStudioTokenOutputLimitError(error)) {
    return 'Could not complete response due to token output limits';
  }

  return undefined;
}

export const EMPTY_TOOLS: Readonly<ToolCalls> = Object.freeze({});

export function isAIToolPart(
  part: AggregatedToolCallPart | AIMessagePart
): part is AIToolPart {
  return part.type.startsWith('tool-');
}

export function isSearchToolPart(part: AIToolPart): part is SearchToolPart {
  return (
    part.type === 'tool-searchIndex' ||
    part.type === 'tool-algolia_search_index' ||
    part.type.startsWith('tool-algolia_search_index_')
  );
}

export function isSearchIndexOutputPart(
  part: AIMessagePart
): part is SearchIndexOutputPart {
  return part.type === 'tool-searchIndex' && part.state === 'output-available';
}

export function isAlgoliaMCPSearchOutputPart(
  part: AIMessagePart
): part is AlgoliaMCPSearchOutputPart {
  return (
    isAIToolPart(part) &&
    (part.type === 'tool-algolia_search_index' ||
      part.type.startsWith('tool-algolia_search_index_')) &&
    part.state === 'output-available'
  );
}

export function isSearchOutputPart(
  part: AIMessagePart
): part is SearchOutputPart {
  return (
    isAIToolPart(part) &&
    isSearchToolPart(part) &&
    part.state === 'output-available'
  );
}

export function sanitizeMessagesForRequest(messages: AIMessage[]): AIMessage[] {
  let sanitizedMessages: AIMessage[] | undefined;

  messages.forEach((message, index) => {
    // Filter out `data-*` part types since Agent Studio does not currently support them on the request
    const parts = message.parts.filter(
      (part) => !part.type.startsWith('data-')
    );

    if (parts.length === message.parts.length) {
      sanitizedMessages?.push(message);
      return;
    }

    if (!sanitizedMessages) {
      sanitizedMessages = messages.slice(0, index);
    }

    sanitizedMessages.push({
      ...message,
      parts,
    });
  });

  return sanitizedMessages ?? messages;
}

export function getAgentPromptSuggestions(parts: AIMessagePart[]): string[] {
  const suggestionsPart = parts.find(
    (part) => part.type === 'data-suggestions'
  );

  if (!suggestionsPart) return [];

  return suggestionsPart.data.suggestions;
}

export function getSearchToolQueries(part: SearchToolPart): string[] {
  if (part.state !== 'input-available' && part.state !== 'output-available') {
    return [];
  }

  if (part.type === 'tool-searchIndex') {
    const query = (part.output?.query ?? part.input?.query ?? '').trim();
    return query ? [query] : [];
  }

  if ('queries' in part.input && Array.isArray(part.input.queries)) {
    return part.input.queries.map(({ query }) => query.trim()).filter(Boolean);
  }

  // There could be older stored MCP search tool calls,
  // we should parse it's input properly
  if ('query' in part.input && typeof part.input.query === 'string') {
    const query = part.input.query.trim();
    return query ? [query] : [];
  }

  return [];
}
