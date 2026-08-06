import { describe, expect, it, vi } from 'vitest';

import { buildAskAiActionSources } from '../createAskAiSources';

const searchClient = {
  search: vi.fn(),
} as any;

describe('buildAskAiActionSources', () => {
  it('returns only the Ask AI action when prompt suggestions are disabled', async () => {
    const handleSelectAskAiQuestion = vi.fn();
    const sources = await buildAskAiActionSources({
      query: 'How do I install DocSearch?',
      handleSelectAskAiQuestion,
      searchClient,
    });

    expect(searchClient.search).not.toHaveBeenCalled();
    expect(sources[0].getItems({} as any)).toMatchObject([
      {
        objectID: 'ask-ai-button',
        query: 'How do I install DocSearch?',
      },
    ]);
  });

  it('requests and returns prompt suggestions after the Ask AI action', async () => {
    searchClient.search.mockResolvedValue({
      results: [
        {
          hits: [
            { objectID: 'prompt-1', prompt: 'How do I configure DocSearch?' },
            { objectID: 'prompt-2', prompt: 'How do I add facets?' },
          ],
        },
      ],
    });

    const sources = await buildAskAiActionSources({
      query: 'configure',
      handleSelectAskAiQuestion: vi.fn(),
      promptSuggestionsOptions: {
        indexName: 'prompt-suggestions',
        hitsPerPage: 2,
      },
      searchClient,
    });

    expect(searchClient.search).toHaveBeenCalledWith({
      requests: [
        {
          query: 'configure',
          indexName: 'prompt-suggestions',
          hitsPerPage: 2,
          attributesToRetrieve: ['prompt'],
        },
      ],
    });
    expect(sources[0].getItems({} as any)).toMatchObject([
      { objectID: 'ask-ai-button', query: 'configure' },
      { objectID: 'prompt-1', query: 'How do I configure DocSearch?' },
      { objectID: 'prompt-2', query: 'How do I add facets?' },
    ]);
  });

  it('selects a prompt suggestion as the Ask AI query', async () => {
    searchClient.search.mockResolvedValue({
      results: [
        {
          hits: [
            { objectID: 'prompt-1', prompt: 'How do I configure DocSearch?' },
          ],
        },
      ],
    });
    const handleSelectAskAiQuestion = vi.fn();
    const sources = await buildAskAiActionSources({
      query: 'configure',
      handleSelectAskAiQuestion,
      promptSuggestionsOptions: { indexName: 'prompt-suggestions' },
      searchClient,
    });
    const [, suggestion] = (await sources[0].getItems({} as any)) as any[];

    sources[0].onSelect?.({ item: suggestion } as any);

    expect(handleSelectAskAiQuestion).toHaveBeenCalledWith(
      true,
      'How do I configure DocSearch?'
    );
  });

  it('keeps the Ask AI action when prompt suggestion retrieval fails', async () => {
    searchClient.search.mockRejectedValue(new Error('Network error'));

    const sources = await buildAskAiActionSources({
      query: 'configure',
      handleSelectAskAiQuestion: vi.fn(),
      promptSuggestionsOptions: { indexName: 'prompt-suggestions' },
      searchClient,
    });

    expect(sources[0].getItems({} as any)).toMatchObject([
      { objectID: 'ask-ai-button', query: 'configure' },
    ]);
  });
});
