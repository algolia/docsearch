// @vitest-environment node

import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { DOCSEARCH_MCP_SERVER_NAME } from '../../constants';
import type { SetupAgent, SetupScope } from '../agents';
import { findProjectRoot, setupDocSearch, type SetupOptions } from '../setup';

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
  const path = await mkdtemp(join(tmpdir(), 'docsearch-cli-'));
  tempDirs.push(path);
  return path;
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((path) => rm(path, { force: true, recursive: true }))
  );
});

describe('setupDocSearch', () => {
  it('installs Cursor MCP config, rule, and skill in project scope', async () => {
    const cwd = await createTempDir();
    const homeDir = await createTempDir();

    const results = await setupDocSearch({
      agents: ['cursor'],
      cwd,
      endpoint: 'https://example.com/mcp',
      env: {},
      homeDir,
      scope: 'project',
    });

    expect(results[0]).toMatchObject({
      agent: 'Cursor',
      mcpStatus: 'configured',
      ruleStatus: 'installed',
      skillStatus: 'installed',
    });

    const mcp = JSON.parse(
      await readFile(join(cwd, '.cursor', 'mcp.json'), 'utf-8')
    ) as {
      mcpServers: Record<string, { url: string }>;
    };
    expect(mcp.mcpServers[DOCSEARCH_MCP_SERVER_NAME]).toEqual({
      url: 'https://example.com/mcp',
    });

    const rule = await readFile(
      join(cwd, '.cursor', 'rules', `${DOCSEARCH_MCP_SERVER_NAME}.mdc`),
      'utf-8'
    );
    expect(rule).toContain('alwaysApply: true');
    expect(rule).toContain('algolia_docsearch_search_docs');

    const skill = await readFile(
      join(cwd, '.cursor', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
      'utf-8'
    );
    expect(skill).toMatch(/^---\nname: algolia-docsearch\ndescription:/);
    expect(skill).toContain('DocSearch MCP');
  });

  it('updates an existing Codex TOML config and shared skill idempotently', async () => {
    const cwd = await createTempDir();
    const homeDir = await createTempDir();
    const options: SetupOptions = {
      agents: ['codex'],
      cwd,
      endpoint: 'https://example.com/mcp',
      env: {},
      homeDir,
      scope: 'project' as const,
    };

    await setupDocSearch(options);
    const results = await setupDocSearch(options);

    expect(results[0]).toMatchObject({
      agent: 'Codex',
      mcpStatus: 'updated',
      ruleStatus: 'updated',
      skillStatus: 'preserved',
    });

    const config = await readFile(join(cwd, '.codex', 'config.toml'), 'utf-8');
    expect(config.match(/\[mcp_servers\.algolia-docsearch\]/g)).toHaveLength(1);
    expect(config).toContain('url = "https://example.com/mcp"');

    const agentsFile = await readFile(join(cwd, 'AGENTS.md'), 'utf-8');
    expect(agentsFile.match(/algolia-docsearch:start/g)).toHaveLength(1);

    const skill = await readFile(
      join(cwd, '.agents', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
      'utf-8'
    );
    expect(skill).toContain('Use this skill');
  });

  it('preserves user edits in dedicated rule and skill files', async () => {
    const cwd = await createTempDir();
    const homeDir = await createTempDir();
    const options: SetupOptions = {
      agents: ['cursor'],
      cwd,
      endpoint: 'https://example.com/mcp',
      env: {},
      homeDir,
      scope: 'project',
    };

    await setupDocSearch(options);
    const rulePath = join(
      cwd,
      '.cursor',
      'rules',
      `${DOCSEARCH_MCP_SERVER_NAME}.mdc`
    );
    const skillPath = join(
      cwd,
      '.cursor',
      'skills',
      DOCSEARCH_MCP_SERVER_NAME,
      'SKILL.md'
    );
    await writeFile(
      rulePath,
      `${await readFile(rulePath, 'utf-8')}\nUser rule customization.\n`
    );
    await writeFile(
      skillPath,
      `${await readFile(skillPath, 'utf-8')}\nUser skill customization.\n`
    );

    const [result] = await setupDocSearch(options);

    expect(result).toMatchObject({
      ruleStatus: 'preserved',
      skillStatus: 'preserved',
    });
    expect(await readFile(rulePath, 'utf-8')).toContain(
      'User rule customization.'
    );
    expect(await readFile(skillPath, 'utf-8')).toContain(
      'User skill customization.'
    );
  });

  it('updates an existing OpenCode JSONC config in place', async () => {
    const cwd = await createTempDir();
    const homeDir = await createTempDir();
    const configPath = join(cwd, 'opencode.jsonc');
    await writeFile(
      configPath,
      `{
  // Existing OpenCode preferences.
  "theme": "system",
}
`
    );

    const [result] = await setupDocSearch({
      agents: ['opencode'],
      cwd,
      endpoint: 'https://example.com/mcp',
      env: {},
      homeDir,
      scope: 'project',
    });

    expect(result.mcpPath).toBe(configPath);
    expect(await readFile(configPath, 'utf-8')).toContain(
      '// Existing OpenCode preferences.'
    );
    expect(await readFile(configPath, 'utf-8')).toContain(
      '"algolia-docsearch"'
    );
    await expect(
      readFile(join(cwd, 'opencode.json'), 'utf-8')
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });
});

interface AgentPathCase {
  agent: SetupAgent;
  mcp: string;
  rule: string;
  scope: SetupScope;
  skill: string;
}

const AGENT_PATH_CASES: AgentPathCase[] = [
  {
    agent: 'claude',
    mcp: '.mcp.json',
    rule: join('.claude', 'rules', `${DOCSEARCH_MCP_SERVER_NAME}.md`),
    scope: 'project',
    skill: join('.claude', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
  },
  {
    agent: 'cursor',
    mcp: join('.cursor', 'mcp.json'),
    rule: join('.cursor', 'rules', `${DOCSEARCH_MCP_SERVER_NAME}.mdc`),
    scope: 'project',
    skill: join('.cursor', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
  },
  {
    agent: 'codex',
    mcp: join('.codex', 'config.toml'),
    rule: 'AGENTS.md',
    scope: 'project',
    skill: join('.agents', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
  },
  {
    agent: 'opencode',
    mcp: 'opencode.json',
    rule: 'AGENTS.md',
    scope: 'project',
    skill: join('.agents', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
  },
  {
    agent: 'gemini',
    mcp: join('.gemini', 'settings.json'),
    rule: 'GEMINI.md',
    scope: 'project',
    skill: join('.gemini', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
  },
  {
    agent: 'claude',
    mcp: '.claude.json',
    rule: join('.claude', 'rules', `${DOCSEARCH_MCP_SERVER_NAME}.md`),
    scope: 'global',
    skill: join('.claude', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
  },
  {
    agent: 'cursor',
    mcp: join('.cursor', 'mcp.json'),
    rule: join('.cursor', 'rules', `${DOCSEARCH_MCP_SERVER_NAME}.mdc`),
    scope: 'global',
    skill: join('.cursor', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
  },
  {
    agent: 'codex',
    mcp: join('.codex', 'config.toml'),
    rule: join('.codex', 'AGENTS.md'),
    scope: 'global',
    skill: join('.agents', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
  },
  {
    agent: 'opencode',
    mcp: join('.config', 'opencode', 'opencode.json'),
    rule: join('.config', 'opencode', 'AGENTS.md'),
    scope: 'global',
    skill: join('.agents', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
  },
  {
    agent: 'gemini',
    mcp: join('.gemini', 'settings.json'),
    rule: join('.gemini', 'GEMINI.md'),
    scope: 'global',
    skill: join('.gemini', 'skills', DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md'),
  },
];

describe.each(AGENT_PATH_CASES)(
  '$agent $scope paths',
  ({ agent, mcp, rule, scope, skill }) => {
    it('writes every artifact to the expected location', async () => {
      const cwd = await createTempDir();
      const homeDir = await createTempDir();
      const [result] = await setupDocSearch({
        agents: [agent],
        cwd,
        endpoint: 'https://example.com/mcp',
        env: {},
        homeDir,
        scope,
      });
      const base = scope === 'project' ? cwd : homeDir;

      expect(result.mcpPath).toBe(join(base, mcp));
      expect(result.rulePath).toBe(join(base, rule));
      expect(result.skillPath).toBe(join(base, skill));
    });
  }
);

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
    await writeFile(
      join(root, 'pnpm-workspace.yaml'),
      'packages:\n  - packages/*\n'
    );
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

  it('still finds a VCS root when the project is outside the home directory', async () => {
    const home = await createTempDir();
    const root = await createTempDir();
    const nested = join(root, 'packages', 'app');
    await mkdir(join(root, '.git'), { recursive: true });
    await mkdir(nested, { recursive: true });

    expect(await findProjectRoot(nested, home)).toBe(root);
  });
});
