/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';

import { DOCSEARCH_MCP_SERVER_NAME } from '../constants.js';

import {
  getAgent,
  getAllAgents,
  type AgentConfig,
  type PathContext,
  type SetupAgent,
  type SetupScope,
} from './agents.js';
import type { AgentChoice } from './prompt.js';
import { getRuleContent, getSkillContent } from './templates.js';
import {
  appendRuleSection,
  appendTomlServer,
  pathExists,
  resolveConfigPath,
  upsertJsonServerEntry,
  writeRuleFile,
  writeSkill,
} from './writers.js';

export interface SetupOptions {
  agents: SetupAgent[];
  cwd?: string;
  endpoint: string;
  env?: NodeJS.ProcessEnv;
  homeDir?: string;
  scope: SetupScope;
}

export interface SetupResult {
  agent: string;
  mcpPath: string;
  mcpStatus: string;
  rulePath: string;
  ruleStatus: string;
  skillPath: string;
  skillStatus: string;
}

export function createPathContext(overrides: Partial<PathContext> = {}): PathContext {
  return {
    cwd: overrides.cwd ?? process.cwd(),
    env: overrides.env ?? process.env,
    homeDir: overrides.homeDir ?? homedir(),
  };
}

// Version control roots are the canonical project root: they match how Cursor,
// Claude Code, Codex, etc. resolve project config (from the repo/workspace top).
const VCS_MARKERS = ['.git', '.hg', '.svn'];

// Markers that only exist at the true repo root, so they beat a nested
// package.json when locating a monorepo root without VCS metadata.
const ROOT_MARKERS = [
  'pnpm-workspace.yaml',
  'bun.lock',
  'bun.lockb',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  'go.work',
  'deno.json',
  'deno.jsonc',
  'turbo.json',
  'nx.json',
  'lerna.json',
];

// Walks up from `startDir` (never crossing `homeDir` or the filesystem root)
// and returns the best project root. Falls back to `startDir` when nothing is
// found, so a directory-less invocation still installs into the current folder.
export async function findProjectRoot(startDir: string, homeDir: string): Promise<string> {
  const start = resolve(startDir);
  const home = resolve(homeDir);
  const stopBeforeHome = start !== home && isPathWithin(start, home);
  let vcsRoot: string | undefined;
  let rootMarkerDir: string | undefined;
  let topmostPackage: string | undefined;

  let dir = start;
  let reachedFileSystemRoot = false;
  while (!reachedFileSystemRoot) {
    if (stopBeforeHome && dir === home) {
      break;
    }
    if (vcsRoot === undefined && (await hasAnyMarker(dir, VCS_MARKERS))) {
      vcsRoot = dir;
    }
    if (rootMarkerDir === undefined && (await hasAnyMarker(dir, ROOT_MARKERS))) {
      rootMarkerDir = dir;
    }
    if (await pathExists(join(dir, 'package.json'))) {
      topmostPackage = dir;
    }

    const parent = dirname(dir);
    reachedFileSystemRoot = parent === dir;
    dir = parent;
  }

  return vcsRoot ?? rootMarkerDir ?? topmostPackage ?? start;
}

async function hasAnyMarker(dir: string, markers: string[]): Promise<boolean> {
  const found = await Promise.all(markers.map((marker) => pathExists(join(dir, marker))));
  return found.some(Boolean);
}

function isPathWithin(path: string, parent: string): boolean {
  const pathFromParent = relative(parent, path);
  return (
    pathFromParent !== '..' &&
    !pathFromParent.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) &&
    !isAbsolute(pathFromParent)
  );
}

export async function setupDocSearch(options: SetupOptions): Promise<SetupResult[]> {
  const context = createPathContext({
    cwd: options.cwd,
    env: options.env,
    homeDir: options.homeDir,
  });
  const results: SetupResult[] = [];

  for (const agentName of options.agents) {
    results.push(
      await setupAgent(getAgent(agentName, context), {
        endpoint: options.endpoint,
        scope: options.scope,
      }),
    );
  }

  return results;
}

export async function detectAgents(scope: SetupScope, context: PathContext): Promise<SetupAgent[]> {
  const detected: SetupAgent[] = [];
  const allAgents = getAllAgents(context);

  for (const agent of Object.values(allAgents)) {
    const paths = scope === 'global' ? agent.detect.globalPaths : agent.detect.projectPaths;
    for (const path of paths) {
      if (await pathExists(path)) {
        detected.push(agent.name);
        break;
      }
    }
  }

  return detected;
}

export function buildAgentChoices(context: PathContext, detected: SetupAgent[]): AgentChoice[] {
  const detectedSet = new Set(detected);

  return Object.values(getAllAgents(context)).map((agent) => ({
    detected: detectedSet.has(agent.name),
    displayName: agent.displayName,
    name: agent.name,
  }));
}

async function setupAgent(agent: AgentConfig, options: { endpoint: string; scope: SetupScope }): Promise<SetupResult> {
  const mcpPath = await installMcpConfig(agent, options.endpoint, options.scope);
  const rulePath = await installRule(agent, options.scope);
  const skill = await writeSkill(agent.skill.dir(options.scope), getSkillContent());

  return {
    agent: agent.displayName,
    mcpPath: mcpPath.path,
    mcpStatus: mcpPath.alreadyExists ? 'updated' : 'configured',
    rulePath: rulePath.path,
    ruleStatus: rulePath.status,
    skillPath: skill.path,
    skillStatus: skill.alreadyExists ? 'preserved' : 'installed',
  };
}

async function installMcpConfig(
  agent: AgentConfig,
  endpoint: string,
  scope: SetupScope,
): Promise<{ alreadyExists: boolean; path: string }> {
  const candidates = scope === 'global' ? agent.mcp.globalPaths : agent.mcp.projectPaths;
  const mcpPath = await resolveConfigPath(candidates);
  const entry = agent.mcp.buildEntry(endpoint);

  if (mcpPath.endsWith('.toml')) {
    const result = await appendTomlServer(mcpPath, entry);
    return { alreadyExists: result.alreadyExists, path: mcpPath };
  }

  const result = await upsertJsonServerEntry(mcpPath, agent.mcp.configKey, entry);
  return { alreadyExists: result.alreadyExists, path: mcpPath };
}

async function installRule(agent: AgentConfig, scope: SetupScope): Promise<{ path: string; status: string }> {
  const content = getRuleContent(agent.name);

  if (agent.rule.kind === 'file') {
    const rulePath = join(agent.rule.dir(scope), agent.rule.filename);
    const result = await writeRuleFile(rulePath, content);
    return { path: rulePath, status: result.alreadyExists ? 'preserved' : 'installed' };
  }

  const rulePath = agent.rule.file(scope);
  const existed = await pathExists(rulePath);
  await appendRuleSection(rulePath, content);
  return { path: rulePath, status: existed ? 'updated' : 'installed' };
}

export { DOCSEARCH_MCP_SERVER_NAME };
