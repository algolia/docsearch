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

import { sanitizeUserInput } from './sanitize';

export interface ExtractedLink {
  url: string;
  title?: string;
}

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

export const getMessageContent = (message: AIMessage | null): TextUIPart | undefined =>
  message?.parts.find((part) => part.type === 'text');

/**
 * Helper function to check if error is a thread depth error (AI-217).
 */
export function isThreadDepthError(error?: Error): boolean {
  if (!error) return false;

  return error.message?.includes('AI-217') || false;
}

export const EMPTY_TOOLS: Readonly<ToolCalls> = Object.freeze({});

export function isAIToolPart(part: AggregatedToolCallPart | AIMessagePart): part is AIToolPart {
  return part.type.startsWith('tool-');
}

export function isSearchToolPart(part: AIToolPart): part is SearchToolPart {
  return (
    part.type === 'tool-searchIndex' ||
    part.type === 'tool-algolia_search_index' ||
    part.type.startsWith('tool-algolia_search_index_')
  );
}

export function isSearchIndexOutputPart(part: AIMessagePart): part is SearchIndexOutputPart {
  return part.type === 'tool-searchIndex' && part.state === 'output-available';
}

export function isAlgoliaMCPSearchOutputPart(part: AIMessagePart): part is AlgoliaMCPSearchOutputPart {
  return (
    isAIToolPart(part) &&
    (part.type === 'tool-algolia_search_index' || part.type.startsWith('tool-algolia_search_index_')) &&
    part.state === 'output-available'
  );
}

export function isSearchOutputPart(part: AIMessagePart): part is SearchOutputPart {
  return isAIToolPart(part) && isSearchToolPart(part) && part.state === 'output-available';
}
