import type { AutocompleteSource } from '@algolia/autocomplete-core';
import type { SearchResponse } from 'algoliasearch/lite';

import type { DocSearchTransformClient } from '../DocSearch';
import type { PromptSuggestions } from '../DocSearchAI';
import type { InternalDocSearchHit } from '../types';
import type { AIMessage, PromptSuggestion } from '../types/AskiAi';

import { SOURCE_IDS } from './collections';

const MAX_RECENT_CONVERSATIONS_DISPLAYED = 3;

const EMPTY_RESULT_CONTENT = {
  value: '',
  matchLevel: 'none',
  matchedWords: [],
} satisfies InternalDocSearchHit['_highlightResult']['content'];
const EMPTY_HIERARCHY_HIGHLIGHT_RESULT = {
  lvl0: EMPTY_RESULT_CONTENT,
  lvl1: EMPTY_RESULT_CONTENT,
  lvl2: EMPTY_RESULT_CONTENT,
  lvl3: EMPTY_RESULT_CONTENT,
  lvl4: EMPTY_RESULT_CONTENT,
  lvl5: EMPTY_RESULT_CONTENT,
  lvl6: EMPTY_RESULT_CONTENT,
} satisfies InternalDocSearchHit['_highlightResult']['hierarchy'];
const EMPTY_HIGHLIGHT_RESULT: InternalDocSearchHit['_highlightResult'] = {
  content: EMPTY_RESULT_CONTENT,
  hierarchy: EMPTY_HIERARCHY_HIGHLIGHT_RESULT,
  hierarchy_camel: [],
};
const EMPTY_SNIPPET_RESULT: InternalDocSearchHit['_snippetResult'] = {
  content: EMPTY_RESULT_CONTENT,
  hierarchy: EMPTY_HIERARCHY_HIGHLIGHT_RESULT,
  hierarchy_camel: [],
};

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
}): Array<
  AutocompleteSource<InternalDocSearchHit & { messages?: AIMessage[] }>
> {
  return [
    {
      sourceId: SOURCE_IDS.recentConversations,
      getItems(): InternalDocSearchHit[] {
        if (disableUserPersonalization) {
          return [];
        }
        return (
          conversations.getAll() as unknown as InternalDocSearchHit[]
        ).slice(0, MAX_RECENT_CONVERSATIONS_DISPLAYED);
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

function createAskAiHit({
  query,
  objectID,
  lvl0,
}: {
  query: string;
  objectID: string;
  lvl0: string;
}): InternalDocSearchHit {
  return {
    type: 'askAI',
    query,
    url_without_anchor: '',
    objectID,
    content: null,
    url: '',
    anchor: null,
    hierarchy: {
      lvl0,
      lvl1: query,
      lvl2: null,
      lvl3: null,
      lvl4: null,
      lvl5: null,
      lvl6: null,
    },
    _highlightResult: EMPTY_HIGHLIGHT_RESULT,
    _snippetResult: EMPTY_SNIPPET_RESULT,
    __docsearch_parent: null,
  };
}

async function getPromptSuggestions({
  query,
  indexName,
  searchClient,
  hitsPerPage = 3,
}: {
  query: string;
  indexName: string;
  searchClient: DocSearchTransformClient;
  hitsPerPage?: number;
}): Promise<InternalDocSearchHit[]> {
  try {
    const { results } = await searchClient.search<PromptSuggestion>({
      requests: [
        {
          query,
          indexName,
          hitsPerPage,
          attributesToRetrieve: ['prompt'],
        },
      ],
    });

    const res = results[0] as SearchResponse<PromptSuggestion>;

    return res.hits.map((hit) =>
      createAskAiHit({
        query: hit.prompt,
        objectID: hit.objectID,
        lvl0: 'Prompt Suggestions',
      })
    );
    // NOTE: Not checking the exception here and just returning empty array since this isn't the hot path
  } catch {
    return [];
  }
}

export async function buildAskAiActionSources({
  query,
  handleSelectAskAiQuestion,
  promptSuggestionsOptions,
  searchClient,
}: {
  query: string;
  handleSelectAskAiQuestion: (toggle: boolean, query: string) => void;
  promptSuggestionsOptions?: PromptSuggestions;
  searchClient: DocSearchTransformClient;
}): Promise<Array<AutocompleteSource<InternalDocSearchHit>>> {
  const promptSuggestions = promptSuggestionsOptions
    ? await getPromptSuggestions({
        query,
        indexName: promptSuggestionsOptions.indexName,
        hitsPerPage: promptSuggestionsOptions.hitsPerPage,
        searchClient,
      })
    : [];

  return [
    {
      sourceId: SOURCE_IDS.askAI,
      getItems(): InternalDocSearchHit[] {
        return [
          createAskAiHit({ query, objectID: 'ask-ai-button', lvl0: 'Ask AI' }),
          ...promptSuggestions,
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
