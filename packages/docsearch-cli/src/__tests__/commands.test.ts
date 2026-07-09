import { describe, expect, it } from 'vitest';

import { buildSetupRequest, buildToolRequest, parseArgs } from '../commands';
import { DEFAULT_MCP_ENDPOINT, TOOL_QUERY_DOCS, TOOL_RESOLVE_DOCSET, TOOL_SEARCH_DOCS } from '../constants';

describe('buildToolRequest', () => {
  it('maps docs to the one-shot DocSearch MCP tool', () => {
    const request = buildToolRequest(
      'docs',
      parseArgs(['Next.js', 'middleware matcher config', '--max-results', '3', '--json']),
    );

    expect(request).toEqual({
      endpoint: DEFAULT_MCP_ENDPOINT,
      json: true,
      toolName: TOOL_SEARCH_DOCS,
      toolArguments: {
        library: 'Next.js',
        query: 'middleware matcher config',
        maxResults: 3,
      },
    });
  });

  it('maps resolve to the docset resolver tool', () => {
    const request = buildToolRequest('resolve', parseArgs(['Algolia', 'InstantSearch', '--top-n', '4']));

    expect(request).toEqual({
      endpoint: DEFAULT_MCP_ENDPOINT,
      json: false,
      toolName: TOOL_RESOLVE_DOCSET,
      toolArguments: {
        query: 'Algolia InstantSearch',
        topN: 4,
      },
    });
  });

  it('maps query to explicit docset lookups', () => {
    const request = buildToolRequest(
      'query',
      parseArgs(['nextjs,react', 'server components', '--endpoint', 'https://example.com/mcp']),
    );

    expect(request).toEqual({
      endpoint: 'https://example.com/mcp',
      json: false,
      toolName: TOOL_QUERY_DOCS,
      toolArguments: {
        docsetIds: ['nextjs', 'react'],
        query: 'server components',
      },
    });
  });
});

describe('buildSetupRequest', () => {
  it('maps setup flags to selected agents and project scope', () => {
    expect(buildSetupRequest(parseArgs(['--cursor', '--claude', '--project', '--yes']))).toEqual({
      agents: ['claude', 'cursor'].sort(),
      all: false,
      endpoint: DEFAULT_MCP_ENDPOINT,
      scope: 'project',
      yes: true,
    });
  });
});
