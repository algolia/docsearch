import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const CLI_NAME = 'docsearch';
export const CLI_VERSION = readPackageVersion();
export const DEFAULT_MCP_ENDPOINT = 'https://mcp.algolia.com/1/docsearch/mcp';
export const DOCSEARCH_MCP_SERVER_NAME = 'algolia-docsearch';

export const TOOL_SEARCH_DOCS = 'algolia_docsearch_search_docs';
export const TOOL_RESOLVE_DOCSET = 'algolia_docsearch_resolve_docset';
export const TOOL_QUERY_DOCS = 'algolia_docsearch_query_docs';

function readPackageVersion(): string {
  const currentDirectory = dirname(fileURLToPath(import.meta.url));
  const packageJson = JSON.parse(readFileSync(join(currentDirectory, '..', 'package.json'), 'utf-8')) as {
    version?: string;
  };

  return packageJson.version ?? '0.0.0';
}
