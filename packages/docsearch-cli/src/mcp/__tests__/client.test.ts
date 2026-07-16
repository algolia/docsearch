// @vitest-environment node
/* eslint-disable max-classes-per-file -- SDK constructors are represented by minimal test doubles. */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { callDocSearchTool } from '../client';

const mocks = vi.hoisted(() => ({
  callTool: vi.fn(),
  close: vi.fn(),
  connect: vi.fn(),
  listTools: vi.fn(),
}));

vi.mock('@modelcontextprotocol/sdk/client/index.js', () => ({
  Client: class {
    callTool = mocks.callTool;
    close = mocks.close;
    connect = mocks.connect;
    listTools = mocks.listTools;
  },
}));

vi.mock('@modelcontextprotocol/sdk/client/streamableHttp.js', () => ({
  StreamableHTTPClientTransport: class {},
}));

beforeEach(() => {
  mocks.connect.mockResolvedValue(undefined);
  mocks.close.mockResolvedValue(undefined);
  mocks.listTools.mockResolvedValue({
    tools: [{ name: 'algolia_docsearch_resolve_docset' }],
  });
  mocks.callTool.mockResolvedValue({
    content: [{ text: 'result', type: 'text' }],
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('callDocSearchTool', () => {
  it('applies request timeouts and closes the client', async () => {
    await callDocSearchTool({
      endpoint: 'https://example.com/mcp',
      toolArguments: { query: 'Next.js' },
      toolName: 'algolia_docsearch_resolve_docset',
    });

    expect(mocks.listTools).toHaveBeenCalledWith(undefined, {
      timeout: 30_000,
    });
    expect(mocks.callTool).toHaveBeenCalledWith(
      {
        arguments: { query: 'Next.js' },
        name: 'algolia_docsearch_resolve_docset',
      },
      undefined,
      { timeout: 30_000 }
    );
    expect(mocks.close).toHaveBeenCalledOnce();
  });

  it('closes the client when connection fails', async () => {
    mocks.connect.mockRejectedValue(new Error('connection failed'));

    await expect(
      callDocSearchTool({
        endpoint: 'https://example.com/mcp',
        toolArguments: {},
        toolName: 'algolia_docsearch_resolve_docset',
      })
    ).rejects.toThrow('connection failed');

    expect(mocks.close).toHaveBeenCalledOnce();
  });
});
