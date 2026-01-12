import type { TextUIPart } from 'ai';

import type { StoredAskAiState } from '../types';
import type { AIMessage } from '../types/AskiAi';

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

export const buildDummyAskAiHit = (
  query: string,
  messages: AIMessage[],
  conversationStarterIndex: number = 0,
): StoredAskAiState => {
  const textPart = messages[conversationStarterIndex].parts.find((part) => part.type === 'text');
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

/**
 * Helper function to check if error is a thread depth error (AI-217).
 */
export function isThreadDepthError(error?: Error): boolean {
  if (!error) return false;

  return error.message?.includes('AI-217') || false;
}
