// @vitest-environment node

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

  it('supports equals syntax for value options', () => {
    const request = buildToolRequest('resolve', parseArgs(['Next.js', '--top-n=2']));

    expect(request.toolArguments).toEqual({
      query: 'Next.js',
      topN: 2,
    });
  });

  it('rejects empty docset IDs', () => {
    expect(() => buildToolRequest('query', parseArgs([',', 'search query']))).toThrow(/docset ID/i);
  });

  it('rejects options that do not belong to the command', () => {
    expect(() => buildToolRequest('resolve', parseArgs(['Next.js', '--max-results', '2']))).toThrow(
      /not valid for the resolve command/,
    );
  });

  it('rejects non-HTTP endpoints', () => {
    expect(() => buildToolRequest('resolve', parseArgs(['Next.js', '--endpoint', 'file:///tmp/mcp']))).toThrow(
      /HTTP or HTTPS/,
    );
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

  it('rejects positional setup arguments and unrelated flags', () => {
    expect(() => buildSetupRequest(parseArgs(['cursor']))).toThrow(/Unexpected setup argument/);
    expect(() => buildSetupRequest(parseArgs(['--json']))).toThrow(/not valid for the setup command/);
  });
});
