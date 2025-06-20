import type { Message } from '@ai-sdk/react';

import type { StoredAskAiState } from '../types';

// utility to extract links (markdown and bare urls) from a string
export function extractLinksFromText(text: string): Array<{ url: string; title?: string }> {
  // match [title](url) and bare urls
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const urlRegex = /https?:\/\/[^\s)]+/g;
  const links: Array<{ url: string; title?: string }> = [];
  const seen = new Set<string>();

  // extract markdown links first
  let match;
  while ((match = markdownLinkRegex.exec(text)) !== null) {
    let url = match[2];
    const title = match[1];
    // trim trailing punctuation
    url = url.replace(/[).,;!?]+$/, '');
    if (!seen.has(url)) {
      links.push({ url, title });
      seen.add(url);
    }
  }

  // extract bare urls
  while ((match = urlRegex.exec(text)) !== null) {
    let url = match[0];
    url = url.replace(/[).,;!?]+$/, '');
    if (!seen.has(url)) {
      links.push({ url });
      seen.add(url);
    }
  }

  return links;
}

export const buildDummyAskAiHit = (query: string, messages: Message[]): StoredAskAiState => ({
  query,
  objectID: messages[0].content,
  messages,
  type: 'askAI',
  anchor: 'stored',

  // dummy content to make it a valid hit
  // this is useful to show it among other hits
  content: null,
  hierarchy: {
    lvl0: 'askAI',
    lvl1: messages[0].content, // use first message as hit name
    lvl2: null,
    lvl3: null,
    lvl4: null,
    lvl5: null,
    lvl6: null,
  },
  url: '',
  url_without_anchor: '',
});
