/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { DOCSEARCH_MCP_SERVER_NAME } from '../constants.js';

const SECTION_START = '<!-- algolia-docsearch:start -->';
const SECTION_END = '<!-- algolia-docsearch:end -->';

export async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function resolveConfigPath(candidates: string[]): Promise<string> {
  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

export async function readJsonConfig(filePath: string): Promise<Record<string, unknown>> {
  let raw: string;
  try {
    raw = await readFile(filePath, 'utf-8');
  } catch {
    return {};
  }

  const stripped = stripJsonComments(raw).trim();
  if (!stripped) {
    return {};
  }

  return JSON.parse(stripped) as Record<string, unknown>;
}

export function mergeServerEntry(
  existing: Record<string, unknown>,
  configKey: string,
  entry: Record<string, unknown>,
): { alreadyExists: boolean; config: Record<string, unknown> } {
  const section = readObject(existing[configKey]);
  const alreadyExists = Object.hasOwn(section, DOCSEARCH_MCP_SERVER_NAME);

  return {
    alreadyExists,
    config: {
      ...existing,
      [configKey]: {
        ...section,
        [DOCSEARCH_MCP_SERVER_NAME]: entry,
      },
    },
  };
}

export async function writeJsonConfig(filePath: string, config: Record<string, unknown>): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(config, null, 2)}\n`, 'utf-8');
}

export function buildTomlServerBlock(entry: Record<string, unknown>): string {
  return [
    `[mcp_servers.${DOCSEARCH_MCP_SERVER_NAME}]`,
    ...Object.entries(entry).map(([key, value]) => `${key} = ${JSON.stringify(value)}`),
    '',
  ].join('\n');
}

export async function appendTomlServer(
  filePath: string,
  entry: Record<string, unknown>,
): Promise<{ alreadyExists: boolean }> {
  const block = buildTomlServerBlock(entry);
  let existing = '';
  try {
    existing = await readFile(filePath, 'utf-8');
  } catch {
    // Missing files are created below.
  }

  const sectionHeader = `[mcp_servers.${DOCSEARCH_MCP_SERVER_NAME}]`;
  const startIdx = existing.indexOf(sectionHeader);
  const alreadyExists = startIdx !== -1;
  const content = alreadyExists
    ? replaceTomlSection(existing, startIdx, sectionHeader, block)
    : appendBlock(existing, block);

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf-8');

  return { alreadyExists };
}

export async function writeRuleFile(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf-8');
}

export async function appendRuleSection(filePath: string, content: string): Promise<void> {
  let existing = '';
  try {
    existing = await readFile(filePath, 'utf-8');
  } catch {
    // Missing files are created below.
  }

  const section = `${SECTION_START}\n${content.trim()}\n${SECTION_END}`;
  const updated =
    existing.includes(SECTION_START) && existing.includes(SECTION_END)
      ? existing.replace(new RegExp(`${escapeRegExp(SECTION_START)}[\\s\\S]*?${escapeRegExp(SECTION_END)}`), section)
      : appendBlock(existing, `${section}\n`);

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, updated, 'utf-8');
}

export async function writeSkill(skillDir: string, content: string): Promise<string> {
  const skillPath = join(skillDir, DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md');
  await mkdir(dirname(skillPath), { recursive: true });
  await writeFile(skillPath, content, 'utf-8');
  return skillPath;
}

function stripJsonComments(text: string): string {
  let result = '';
  let idx = 0;

  while (idx < text.length) {
    if (text[idx] === '"') {
      const start = idx++;
      while (idx < text.length && text[idx] !== '"') {
        if (text[idx] === '\\') {
          idx++;
        }
        idx++;
      }
      result += text.slice(start, ++idx);
    } else if (text[idx] === '/' && text[idx + 1] === '/') {
      idx += 2;
      while (idx < text.length && text[idx] !== '\n') {
        idx++;
      }
    } else if (text[idx] === '/' && text[idx + 1] === '*') {
      idx += 2;
      while (idx < text.length && !(text[idx] === '*' && text[idx + 1] === '/')) {
        idx++;
      }
      idx += 2;
    } else {
      result += text[idx++];
    }
  }

  return result;
}

function readObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function replaceTomlSection(existing: string, startIdx: number, sectionHeader: string, block: string): string {
  const subSectionPrefix = `${sectionHeader.slice(0, -1)}.`;
  const rest = existing.slice(startIdx + sectionHeader.length);
  let endOffset = rest.length;
  const headerRegex = /^\[/gm;
  let match: RegExpExecArray | null;

  while ((match = headerRegex.exec(rest)) !== null) {
    const lineEnd = rest.indexOf('\n', match.index);
    const line = rest.slice(match.index, lineEnd === -1 ? undefined : lineEnd);
    if (!line.startsWith(subSectionPrefix)) {
      endOffset = match.index;
      break;
    }
  }

  const before = existing.slice(0, startIdx).replace(/\n+$/, '');
  const after = existing.slice(startIdx + sectionHeader.length + endOffset).replace(/^\n+/, '');
  return [before, block.trimEnd(), after].filter(Boolean).join('\n\n') + '\n';
}

function appendBlock(existing: string, block: string): string {
  if (!existing) {
    return block.endsWith('\n') ? block : `${block}\n`;
  }

  const separator = existing.endsWith('\n') ? '\n' : '\n\n';
  return `${existing}${separator}${block.endsWith('\n') ? block : `${block}\n`}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
