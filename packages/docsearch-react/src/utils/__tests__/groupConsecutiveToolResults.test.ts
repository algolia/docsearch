import { describe, it, expect } from 'vitest';

import type { AIMessagePart } from '../../types/AskiAi';
import { groupConsecutiveToolResults } from '../groupConsecutiveToolResults';

function searchIndexPart(query: string): AIMessagePart {
  const part: AIMessagePart = {
    type: 'tool-searchIndex',
    toolCallId: `searchIndex-${query}`,
    state: 'output-available',
    input: { query },
    output: { query, hits: [] },
  };

  return part;
}

function mcpSearchPart(
  query: string,
  type: `tool-algolia_search_index${string}` = 'tool-algolia_search_index'
): AIMessagePart {
  const part: AIMessagePart = {
    type,
    toolCallId: `${type}-${query}`,
    state: 'output-available',
    input: { query, index: 'docs' },
    output: { hits: [] },
  };

  return part;
}

function textPart(text: string): AIMessagePart {
  const part: AIMessagePart = { type: 'text', text };

  return part;
}

describe('groupConsecutiveToolResults', () => {
  it('aggregates consecutive algolia_search_index MCP calls', () => {
    const parts = [mcpSearchPart('foo'), mcpSearchPart('bar')];

    expect(groupConsecutiveToolResults(parts)).toEqual([
      { type: 'aggregated-tool-call', queries: ['foo', 'bar'] },
    ]);
  });

  it('aggregates consecutive algolia_search_index_* MCP calls', () => {
    const parts = [
      mcpSearchPart('foo', 'tool-algolia_search_index_custom'),
      mcpSearchPart('bar', 'tool-algolia_search_index_custom'),
    ];

    expect(groupConsecutiveToolResults(parts)).toEqual([
      { type: 'aggregated-tool-call', queries: ['foo', 'bar'] },
    ]);
  });

  it('does not aggregate custom tools that only share the algolia_search_index prefix', () => {
    const parts = [
      mcpSearchPart('foo', 'tool-algolia_search_indexer'),
      mcpSearchPart('bar', 'tool-algolia_search_indexer'),
    ];

    expect(groupConsecutiveToolResults(parts)).toEqual(parts);
  });

  it('aggregates mixed searchIndex and MCP search calls together', () => {
    const parts = [
      searchIndexPart('foo'),
      mcpSearchPart('bar'),
      searchIndexPart('baz'),
    ];

    expect(groupConsecutiveToolResults(parts)).toEqual([
      { type: 'aggregated-tool-call', queries: ['foo', 'bar', 'baz'] },
    ]);
  });

  it('returns the original part for a single MCP search call', () => {
    const part = mcpSearchPart('foo');

    expect(groupConsecutiveToolResults([part])).toEqual([part]);
  });

  it('returns the valid MCP search part when a single valid query follows an empty query', () => {
    const validPart = mcpSearchPart('foo');
    const parts = [mcpSearchPart(''), validPart];

    expect(groupConsecutiveToolResults(parts)).toEqual([validPart]);
  });

  it('ignores empty or whitespace-only MCP queries when aggregating', () => {
    const parts = [
      mcpSearchPart('foo'),
      mcpSearchPart(''),
      mcpSearchPart('   '),
      mcpSearchPart('bar'),
    ];

    expect(groupConsecutiveToolResults(parts)).toEqual([
      { type: 'aggregated-tool-call', queries: ['foo', 'bar'] },
    ]);
  });

  it('preserves non-search parts and breaks grouping', () => {
    const text = textPart('hello');
    const parts = [mcpSearchPart('foo'), text, mcpSearchPart('bar')];

    expect(groupConsecutiveToolResults(parts)).toEqual([
      mcpSearchPart('foo'),
      text,
      mcpSearchPart('bar'),
    ]);
  });
});
