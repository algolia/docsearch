import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { DOCSEARCH_MCP_SERVER_NAME } from '../../constants';
import { findProjectRoot, setupDocSearch, type SetupOptions } from '../setup';

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
  const path = await mkdtemp(join(tmpdir(), 'docsearch-cli-'));
  tempDirs.push(path);
  return path;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((path) => rm(path, { force: true, recursive: true })));
});

describe('setupDocSearch', () => {
  it('installs Cursor MCP config, rule, and skill in project scope', async () => {
    const cwd = await createTempDir();
    const homeDir = await createTempDir();

    const results = await setupDocSearch({
      agents: ['cursor'],
      all: false,
      cwd,
      endpoint: 'https://example.com/mcp',
      env: {},
      homeDir,
      scope: 'project',
      yes: true,
    });

    expect(results[0]).toMatchObject({
      agent: 'Cursor',
      mcpStatus: 'configured',
      ruleStatus: 'installed',
      skillStatus: 'installed',
    });

    const mcp = JSON.parse(await readFile(join(cwd, '.cursor', 'mcp.json'), 'utf-8')) as {
      mcpServers: Record<string, { url: string }>;
    };
    expect(mcp.mcpServers[DOCSEARCH_MCP_SERVER_NAME]).toEqual({
      url: 'https://example.com/mcp',
    });

    const rule = await readFile(join(cwd, '.cursor', 'rules', `${DOCSEARCH_MCP_SERVER_NAME}.mdc`), 'utf-8');
    expect(rule).toContain('alwaysApply: true');
    expect(rule).toContain('algolia_docsearch_search_docs');

    const skill = await readFile(join(cwd, '.cursor', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'), 'utf-8');
    expect(skill).toContain('DocSearch MCP');
  });

  it('updates an existing Codex TOML config and shared skill idempotently', async () => {
    const cwd = await createTempDir();
    const homeDir = await createTempDir();
    const options: SetupOptions = {
      agents: ['codex'],
      all: false,
      cwd,
      endpoint: 'https://example.com/mcp',
      env: {},
      homeDir,
      scope: 'project' as const,
      yes: true,
    };

    await setupDocSearch(options);
    const results = await setupDocSearch(options);

    expect(results[0]).toMatchObject({
      agent: 'Codex',
      mcpStatus: 'updated',
      ruleStatus: 'updated',
      skillStatus: 'installed',
    });

    const config = await readFile(join(cwd, '.codex', 'config.toml'), 'utf-8');
    expect(config.match(/\[mcp_servers\.algolia-docsearch\]/g)).toHaveLength(1);
    expect(config).toContain('url = "https://example.com/mcp"');

    const agentsFile = await readFile(join(cwd, 'AGENTS.md'), 'utf-8');
    expect(agentsFile.match(/algolia-docsearch:start/g)).toHaveLength(1);

    const skill = await readFile(join(cwd, '.agents', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'), 'utf-8');
    expect(skill).toContain('Use this skill');
  });
});

describe('findProjectRoot', () => {
  it('walks up to the nearest VCS root', async () => {
    const home = await createTempDir();
    const root = join(home, 'repo');
    const nested = join(root, 'packages', 'app', 'src');
    await mkdir(join(root, '.git'), { recursive: true });
    await mkdir(nested, { recursive: true });

    expect(await findProjectRoot(nested, home)).toBe(root);
  });

  it('prefers a repo-root marker over a nested package.json when there is no VCS', async () => {
    const home = await createTempDir();
    const root = join(home, 'repo');
    const pkg = join(root, 'packages', 'app');
    await mkdir(pkg, { recursive: true });
    await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n');
    await writeFile(join(root, 'package.json'), '{}');
    await writeFile(join(pkg, 'package.json'), '{}');

    expect(await findProjectRoot(pkg, home)).toBe(root);
  });

  it('falls back to the start directory when nothing is found', async () => {
    const home = await createTempDir();
    const start = join(home, 'loose', 'dir');
    await mkdir(start, { recursive: true });

    expect(await findProjectRoot(start, home)).toBe(start);
  });

  it('does not cross the home directory', async () => {
    const home = await createTempDir();
    const start = join(home, 'project');
    await mkdir(start, { recursive: true });
    // A .git in home must not be picked up.
    await mkdir(join(home, '.git'), { recursive: true });

    expect(await findProjectRoot(start, home)).toBe(start);
  });
});
