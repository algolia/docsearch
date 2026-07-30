/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import {
  access,
  mkdir,
  readFile,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { dirname, join } from 'node:path';

import {
  applyEdits,
  modify,
  parse,
  printParseErrorCode,
  type FormattingOptions,
  type ParseError,
} from 'jsonc-parser';

import { DOCSEARCH_MCP_SERVER_NAME } from '../constants.js';
import { UsageError } from '../errors.js';

const SECTION_START = '<!-- algolia-docsearch:start -->';
const SECTION_END = '<!-- algolia-docsearch:end -->';

export async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (isMissingFileError(error)) {
      return false;
    }
    throw error;
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

export async function upsertJsonServerEntry(
  filePath: string,
  configKey: string,
  entry: Record<string, unknown>
): Promise<{ alreadyExists: boolean }> {
  const existing = await readTextFile(filePath);
  const source = existing.trim() === '' ? '{}\n' : existing;
  const errors: ParseError[] = [];
  const parsed = parse(source, errors, {
    allowTrailingComma: true,
    disallowComments: false,
  }) as unknown;

  if (errors.length > 0) {
    const firstError = errors[0];
    throw new UsageError(
      `Cannot update ${filePath}: invalid JSON/JSONC (${printParseErrorCode(firstError.error)} at offset ${firstError.offset}).`
    );
  }
  if (!isPlainObject(parsed)) {
    throw new UsageError(
      `Cannot update ${filePath}: the configuration root must be an object.`
    );
  }

  const section = parsed[configKey];
  if (section !== undefined && !isPlainObject(section)) {
    throw new UsageError(
      `Cannot update ${filePath}: "${configKey}" must be an object.`
    );
  }

  const serverEntry = section?.[DOCSEARCH_MCP_SERVER_NAME];
  if (serverEntry !== undefined && !isPlainObject(serverEntry)) {
    throw new UsageError(
      `Cannot update ${filePath}: "${configKey}.${DOCSEARCH_MCP_SERVER_NAME}" must be an object.`
    );
  }

  const alreadyExists = serverEntry !== undefined;
  const mergedEntry = {
    ...serverEntry,
    ...entry,
  };
  const edits = modify(
    source,
    [configKey, DOCSEARCH_MCP_SERVER_NAME],
    mergedEntry,
    {
      formattingOptions: inferFormatting(source),
    }
  );
  const updated = ensureFinalNewline(applyEdits(source, edits));

  await writeFileAtomic(filePath, updated);
  return { alreadyExists };
}

export function buildTomlServerBlock(entry: Record<string, unknown>): string {
  return [
    `[mcp_servers.${DOCSEARCH_MCP_SERVER_NAME}]`,
    ...Object.entries(entry).map(
      ([key, value]) => `${key} = ${JSON.stringify(value)}`
    ),
    '',
  ].join('\n');
}

export async function appendTomlServer(
  filePath: string,
  entry: Record<string, unknown>
): Promise<{ alreadyExists: boolean }> {
  const existing = await readTextFile(filePath);
  const block = buildTomlServerBlock(entry);
  const sectionHeader = `[mcp_servers.${DOCSEARCH_MCP_SERVER_NAME}]`;
  const headerRegex = new RegExp(
    `^${escapeRegExp(sectionHeader)}[ \\t]*$`,
    'gm'
  );
  const matches = [...existing.matchAll(headerRegex)];
  if (matches.length > 1) {
    throw new UsageError(
      `Cannot update ${filePath}: duplicate ${sectionHeader} sections.`
    );
  }

  const alreadyExists = matches.length === 1;
  const content = alreadyExists
    ? mergeTomlSection(existing, matches[0], entry, filePath)
    : appendBlock(existing, block);

  await writeFileAtomic(filePath, content);
  return { alreadyExists };
}

export async function writeRuleFile(
  filePath: string,
  content: string
): Promise<{ alreadyExists: boolean }> {
  const alreadyExists = await pathExists(filePath);
  if (!alreadyExists) {
    await writeFileAtomic(filePath, content);
  }
  return { alreadyExists };
}

export async function appendRuleSection(
  filePath: string,
  content: string
): Promise<void> {
  const existing = await readTextFile(filePath);
  const hasStart = existing.includes(SECTION_START);
  const hasEnd = existing.includes(SECTION_END);
  if (hasStart !== hasEnd) {
    throw new UsageError(
      `Cannot update ${filePath}: incomplete DocSearch managed section.`
    );
  }

  const section = `${SECTION_START}\n${content.trim()}\n${SECTION_END}`;
  const updated =
    hasStart && hasEnd
      ? existing.replace(
          new RegExp(
            `${escapeRegExp(SECTION_START)}[\\s\\S]*?${escapeRegExp(SECTION_END)}`
          ),
          section
        )
      : appendBlock(existing, `${section}\n`);

  await writeFileAtomic(filePath, updated);
}

export async function writeSkill(
  skillDir: string,
  content: string
): Promise<{ alreadyExists: boolean; path: string }> {
  const skillPath = join(skillDir, DOCSEARCH_MCP_SERVER_NAME, 'SKILL.md');
  const alreadyExists = await pathExists(skillPath);
  if (!alreadyExists) {
    await writeFileAtomic(skillPath, content);
  }
  return { alreadyExists, path: skillPath };
}

function mergeTomlSection(
  existing: string,
  headerMatch: RegExpMatchArray,
  entry: Record<string, unknown>,
  filePath: string
): string {
  const startIdx = headerMatch.index;
  if (startIdx === undefined) {
    throw new UsageError(
      `Cannot update ${filePath}: failed to locate the DocSearch MCP section.`
    );
  }

  const lineBreak = existing.includes('\r\n') ? '\r\n' : '\n';
  const headerEnd = startIdx + headerMatch[0].length;
  const rest = existing.slice(headerEnd);
  const nextHeader = /^[ \t]*\[[^\]\r\n]+\][ \t]*(?:#.*)?$/m.exec(rest);
  const endIdx =
    nextHeader?.index === undefined
      ? existing.length
      : headerEnd + nextHeader.index;
  const lines = existing
    .slice(startIdx, endIdx)
    .replace(/\s+$/, '')
    .split(/\r?\n/);

  for (const [key, value] of Object.entries(entry)) {
    const keyRegex = new RegExp(`^(\\s*)${escapeRegExp(key)}\\s*=`);
    const matchingLines = lines
      .map((line, index) => ({ index, match: keyRegex.exec(line) }))
      .filter((candidate) => candidate.match !== null);

    if (matchingLines.length > 1) {
      throw new UsageError(
        `Cannot update ${filePath}: duplicate "${key}" values in the DocSearch MCP section.`
      );
    }

    const replacement = `${key} = ${toTomlValue(value, filePath)}`;
    const matchingLine = matchingLines[0];
    if (matchingLine?.match) {
      const comment = readTomlInlineComment(lines[matchingLine.index]);
      lines[matchingLine.index] =
        `${matchingLine.match[1]}${replacement}${comment}`;
    } else {
      lines.push(replacement);
    }
  }

  const mergedSection = `${lines.join(lineBreak)}${lineBreak}`;
  return ensureFinalNewline(
    `${existing.slice(0, startIdx)}${mergedSection}${existing.slice(endIdx)}`
  );
}

function toTomlValue(value: unknown, filePath: string): string {
  if (
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    typeof value === 'number'
  ) {
    return JSON.stringify(value);
  }

  throw new UsageError(
    `Cannot update ${filePath}: unsupported TOML value in the DocSearch MCP configuration.`
  );
}

function readTomlInlineComment(line: string): string {
  let quote: '"' | "'" | undefined;
  let escaped = false;

  for (let index = 0; index < line.length; index++) {
    const character = line[index];
    if (escaped) {
      escaped = false;
    } else if (quote === '"' && character === '\\') {
      escaped = true;
    } else if (quote && character === quote) {
      quote = undefined;
    } else if (!quote && (character === '"' || character === "'")) {
      quote = character;
    } else if (!quote && character === '#') {
      const whitespace = line.slice(0, index).match(/[ \t]*$/)?.[0] ?? '';
      return `${whitespace || ' '}${line.slice(index)}`;
    }
  }

  return '';
}

function appendBlock(existing: string, block: string): string {
  const lineBreak = existing.includes('\r\n') ? '\r\n' : '\n';
  const normalizedBlock = block.replace(/\r?\n/g, lineBreak);
  if (!existing) {
    return normalizedBlock.endsWith(lineBreak)
      ? normalizedBlock
      : `${normalizedBlock}${lineBreak}`;
  }

  const separator = existing.endsWith(lineBreak)
    ? lineBreak
    : `${lineBreak}${lineBreak}`;
  return `${existing}${separator}${
    normalizedBlock.endsWith(lineBreak)
      ? normalizedBlock
      : `${normalizedBlock}${lineBreak}`
  }`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function inferFormatting(source: string): FormattingOptions {
  const lineBreak = source.includes('\r\n') ? '\r\n' : '\n';
  const indentation = source.match(/^[ \t]+(?=")/m)?.[0];
  const insertSpaces = indentation?.includes('\t') !== true;

  return {
    eol: lineBreak,
    insertSpaces,
    tabSize: insertSpaces ? (indentation?.length ?? 2) : 1,
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function ensureFinalNewline(content: string): string {
  if (content.endsWith('\n')) {
    return content;
  }
  return `${content}\n`;
}

async function readTextFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, 'utf-8');
  } catch (error) {
    if (isMissingFileError(error)) {
      return '';
    }
    throw error;
  }
}

async function writeFileAtomic(
  filePath: string,
  content: string
): Promise<void> {
  const targetPath = await resolveExistingPath(filePath);
  await mkdir(dirname(targetPath), { recursive: true });

  let mode: number | undefined;
  try {
    mode = (await stat(targetPath)).mode % 0o1000;
  } catch (error) {
    if (!isMissingFileError(error)) {
      throw error;
    }
  }

  const tempPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(tempPath, content, {
      encoding: 'utf-8',
      mode,
    });
    await rename(tempPath, targetPath);
  } finally {
    await rm(tempPath, { force: true });
  }
}

async function resolveExistingPath(filePath: string): Promise<string> {
  try {
    return await realpath(filePath);
  } catch (error) {
    if (isMissingFileError(error)) {
      return filePath;
    }
    throw error;
  }
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
