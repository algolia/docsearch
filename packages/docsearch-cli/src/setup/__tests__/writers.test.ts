// @vitest-environment node

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { appendTomlServer, upsertJsonServerEntry } from '../writers';

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
  const path = await mkdtemp(join(tmpdir(), 'docsearch-writers-'));
  tempDirs.push(path);
  return path;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((path) => rm(path, { force: true, recursive: true })));
});

describe('upsertJsonServerEntry', () => {
  it('preserves JSONC comments, trailing commas, and unrelated configuration', async () => {
    const cwd = await createTempDir();
    const path = join(cwd, 'opencode.jsonc');
    await writeFile(
      path,
      `{
  // Keep this comment.
  "theme": "system",
  "mcp": {
    "existing": {
      "type": "remote",
      "url": "https://example.com/mcp",
    },
  },
}
`,
    );

    await upsertJsonServerEntry(path, 'mcp', {
      enabled: true,
      type: 'remote',
      url: 'https://mcp.algolia.com/1/docsearch/mcp',
    });

    const updated = await readFile(path, 'utf-8');
    expect(updated).toContain('// Keep this comment.');
    expect(updated).toContain('"theme": "system"');
    expect(updated).toContain('"existing"');
    expect(updated).toContain('"algolia-docsearch"');
    expect(updated).toContain('"url": "https://mcp.algolia.com/1/docsearch/mcp"');
  });

  it('preserves unknown fields on an existing DocSearch entry', async () => {
    const cwd = await createTempDir();
    const path = join(cwd, 'mcp.json');
    await writeFile(
      path,
      `${JSON.stringify({
        mcpServers: {
          'algolia-docsearch': {
            headers: { 'X-Custom': 'value' },
            timeout: 15_000,
            url: 'https://old.example.com/mcp',
          },
        },
      })}\n`,
    );

    const result = await upsertJsonServerEntry(path, 'mcpServers', {
      url: 'https://mcp.algolia.com/1/docsearch/mcp',
    });
    const updated = JSON.parse(await readFile(path, 'utf-8')) as {
      mcpServers: Record<string, Record<string, unknown>>;
    };

    expect(result.alreadyExists).toBe(true);
    expect(updated.mcpServers['algolia-docsearch']).toEqual({
      headers: { 'X-Custom': 'value' },
      timeout: 15_000,
      url: 'https://mcp.algolia.com/1/docsearch/mcp',
    });
  });

  it('rejects malformed JSONC with the file path in the error', async () => {
    const cwd = await createTempDir();
    const path = join(cwd, 'broken.jsonc');
    await writeFile(path, '{ "mcp": {');

    await expect(upsertJsonServerEntry(path, 'mcp', { url: 'https://example.com' })).rejects.toThrow(path);
  });

  it('rejects an existing configuration section with the wrong shape', async () => {
    const cwd = await createTempDir();
    const path = join(cwd, 'mcp.json');
    await writeFile(path, '{ "mcpServers": [] }\n');

    await expect(upsertJsonServerEntry(path, 'mcpServers', { url: 'https://example.com' })).rejects.toThrow(
      '"mcpServers" must be an object',
    );
  });
});

describe('appendTomlServer', () => {
  it('updates known values while preserving custom keys and nested tables', async () => {
    const cwd = await createTempDir();
    const path = join(cwd, 'config.toml');
    await writeFile(
      path,
      `# [mcp_servers.algolia-docsearch]
[mcp_servers.algolia-docsearch]
url = "https://old.example.com/mcp" # Keep this comment.
enabled = false

[mcp_servers.algolia-docsearch.http_headers]
X-Custom = "value"

[mcp_servers.other]
url = "https://other.example.com/mcp"
`,
    );

    const result = await appendTomlServer(path, {
      url: 'https://mcp.algolia.com/1/docsearch/mcp',
    });
    const updated = await readFile(path, 'utf-8');

    expect(result.alreadyExists).toBe(true);
    expect(updated).toContain('# [mcp_servers.algolia-docsearch]');
    expect(updated).toContain('url = "https://mcp.algolia.com/1/docsearch/mcp" # Keep this comment.');
    expect(updated).toContain('enabled = false');
    expect(updated).toContain('[mcp_servers.algolia-docsearch.http_headers]');
    expect(updated).toContain('X-Custom = "value"');
    expect(updated).toContain('[mcp_servers.other]');
  });

  it('refuses to edit duplicate DocSearch sections', async () => {
    const cwd = await createTempDir();
    const path = join(cwd, 'config.toml');
    await writeFile(
      path,
      `[mcp_servers.algolia-docsearch]
url = "https://one.example.com"

[mcp_servers.algolia-docsearch]
url = "https://two.example.com"
`,
    );

    await expect(appendTomlServer(path, { url: 'https://example.com' })).rejects.toThrow(/duplicate/i);
  });
});
