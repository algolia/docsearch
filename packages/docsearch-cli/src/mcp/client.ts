/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { CLI_NAME, CLI_VERSION } from '../constants.js';

const MCP_REQUEST_TIMEOUT_MS = 30_000;

export interface CallDocSearchToolOptions {
  endpoint: string;
  toolArguments: Record<string, unknown>;
  toolName: string;
}

export async function callDocSearchTool({
  endpoint,
  toolArguments,
  toolName,
}: CallDocSearchToolOptions): Promise<CallToolResult> {
  const client = new Client({
    name: CLI_NAME,
    version: CLI_VERSION,
  });
  const transport = new StreamableHTTPClientTransport(new URL(endpoint));

  try {
    await client.connect(transport);

    const { tools } = await client.listTools(undefined, {
      timeout: MCP_REQUEST_TIMEOUT_MS,
    });
    if (!tools.some((tool) => tool.name === toolName)) {
      throw new Error(`DocSearch MCP tool "${toolName}" is not available at ${endpoint}.`);
    }

    const result = await client.callTool(
      {
        name: toolName,
        arguments: toolArguments,
      },
      undefined,
      {
        timeout: MCP_REQUEST_TIMEOUT_MS,
      },
    );
    if (!('content' in result)) {
      throw new Error(`DocSearch MCP tool "${toolName}" returned an unsupported result shape.`);
    }

    return result as CallToolResult;
  } finally {
    await client.close();
  }
}
