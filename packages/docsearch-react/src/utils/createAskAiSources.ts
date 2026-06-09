import type { AutocompleteSource } from '@algolia/autocomplete-core';

import type { InternalDocSearchHit } from '../types';
import type { AIMessage } from '../types/AskiAi';

import { SOURCE_IDS } from './collections';

const MAX_RECENT_CONVERSATIONS_DISPLAYED = 3;

export function buildRecentConversationSources({
  conversations,
  disableUserPersonalization,
  setMessages,
  onAskAiToggle,
}: {
  conversations: { getAll: () => unknown[] };
  disableUserPersonalization: boolean;
  setMessages: (messages: AIMessage[]) => void;
  onAskAiToggle: (toggle: boolean) => void;
}): Array<AutocompleteSource<InternalDocSearchHit & { messages?: AIMessage[] }>> {
  return [
    {
      sourceId: SOURCE_IDS.recentConversations,
      getItems(): InternalDocSearchHit[] {
        if (disableUserPersonalization) {
          return [];
        }
        return (conversations.getAll() as unknown as InternalDocSearchHit[]).slice(
          0,
          MAX_RECENT_CONVERSATIONS_DISPLAYED,
        );
      },
      onSelect({ item }): void {
        if (item.messages) {
          setMessages(item.messages);
          onAskAiToggle(true);
        }
      },
    },
  ];
}

export function buildAskAiActionSources({
  query,
  handleSelectAskAiQuestion,
}: {
  query: string;
  handleSelectAskAiQuestion: (toggle: boolean, query: string) => void;
}): Array<AutocompleteSource<InternalDocSearchHit>> {
  const emptyHierarchyHighlightResult = {
    lvl0: { value: '', matchLevel: 'none', matchedWords: [] },
    lvl1: { value: '', matchLevel: 'none', matchedWords: [] },
    lvl2: { value: '', matchLevel: 'none', matchedWords: [] },
    lvl3: { value: '', matchLevel: 'none', matchedWords: [] },
    lvl4: { value: '', matchLevel: 'none', matchedWords: [] },
    lvl5: { value: '', matchLevel: 'none', matchedWords: [] },
    lvl6: { value: '', matchLevel: 'none', matchedWords: [] },
  } satisfies InternalDocSearchHit['_highlightResult']['hierarchy'];
  const emptyHighlightResult: InternalDocSearchHit['_highlightResult'] = {
    content: { value: '', matchLevel: 'none', matchedWords: [] },
    hierarchy: emptyHierarchyHighlightResult,
    hierarchy_camel: [],
  };
  const emptySnippetResult: InternalDocSearchHit['_snippetResult'] = {
    content: { value: '', matchLevel: 'none' },
    hierarchy: emptyHierarchyHighlightResult,
    hierarchy_camel: [],
  };

  return [
    {
      sourceId: SOURCE_IDS.askAI,
      getItems(): InternalDocSearchHit[] {
        return [
          {
            type: 'askAI',
            query,
            url_without_anchor: '',
            objectID: 'ask-ai-button',
            content: null,
            url: '',
            anchor: null,
            hierarchy: {
              lvl0: 'Ask AI',
              lvl1: query,
              lvl2: null,
              lvl3: null,
              lvl4: null,
              lvl5: null,
              lvl6: null,
            },
            _highlightResult: emptyHighlightResult,
            _snippetResult: emptySnippetResult,
            __docsearch_parent: null,
          },
        ];
      },
      onSelect({ item }): void {
        if (item.type === 'askAI' && item.query) {
          handleSelectAskAiQuestion(true, item.query);
        }
      },
    },
  ];
}
