import type { AutocompleteSource } from '@algolia/autocomplete-core';

import type { StoredSearchPlugin } from '../stored-searches';
import type { InternalDocSearchHit, StoredAskAiState, SuggestedQuestionHit } from '../types';
import type { AIMessage } from '../types/AskiAi';

export const buildAskAiSources = ({
  canHandleAskAi,
  query,
  handleSelectAskAiQuestion,
}: {
  canHandleAskAi: boolean;
  query: string;
  handleSelectAskAiQuestion: (toggle: boolean, query: string, suggestedQuestion?: SuggestedQuestionHit) => void;
}): Array<AutocompleteSource<InternalDocSearchHit>> => {
  if (!canHandleAskAi) return [];

  return [
    {
      sourceId: 'askAI',
      getItems(): InternalDocSearchHit[] {
        // return a single item representing the Ask AI action
        // placeholder data matching the InternalDocSearchHit structure
        const askItem: InternalDocSearchHit = {
          type: 'askAI',
          query,
          url_without_anchor: '',
          objectID: `ask-ai-button`,
          content: null,
          url: '',
          anchor: null,
          hierarchy: {
            lvl0: 'Ask AI', // Or contextually relevant
            lvl1: query,
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
            lvl6: null,
          },
          _highlightResult: {} as any,
          _snippetResult: {} as any,
          __docsearch_parent: null,
        };
        return [askItem];
      },
      onSelect({ item }): void {
        if (item.type === 'askAI' && item.query) {
          handleSelectAskAiQuestion(true, item.query);
        }
      },
    },
  ];
};

export const buildRecentConversationsSource = ({
  canHandleAskAi,
  disableUserPersonalization,
  conversations,
  onAskAiToggle,
  setMessages,
}: {
  canHandleAskAi: boolean;
  disableUserPersonalization: boolean;
  conversations: StoredSearchPlugin<StoredAskAiState>;
  onAskAiToggle: (toggle: boolean) => void;
  setMessages: (messages: AIMessage[] | ((messages: AIMessage[]) => AIMessage[])) => void;
}): Array<AutocompleteSource<InternalDocSearchHit & { messages?: AIMessage[] }>> => {
  if (!canHandleAskAi) return [];

  return [
    {
      sourceId: 'recentConversations',
      getItems(): InternalDocSearchHit[] {
        if (disableUserPersonalization) {
          return [];
        }
        return conversations.getAll() as unknown as InternalDocSearchHit[];
      },
      onSelect({ item }): void {
        if (item.messages) {
          setMessages(item.messages as any);
          onAskAiToggle(true);
        }
      },
    },
  ];
};
