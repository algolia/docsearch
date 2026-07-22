/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import { color, symbols } from './theme.js';

const CODE_FENCE = /^```(.*)$/;
const HORIZONTAL_RULE = /^\s*([-*_]|─){3,}\s*$/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const SOURCE = /^Source:\s+(.+)$/;
const BULLET = /^(\s*)[-*]\s+(.+)$/;
const META_FIELD = /^([A-Za-z][\w]*):\s+([\s\S]*)$/;
const SECTION_LABEL = /^[A-Z][^:`]*:\s*$/;
const TABLE_ROW = /^\s*\|.*\|\s*$/;
const TABLE_SEPARATOR = /^\s*\|[\s:|-]+\|\s*$/;

const MAX_WIDTH = 88;
const RULE_WIDTH = 56;

export function renderMarkdown(text: string): string {
  const width = Math.max(40, Math.min(process.stdout.columns ?? 80, MAX_WIDTH));
  const lines = text.replace(/\n+$/, '').split('\n');
  const output: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    const fence = line.match(CODE_FENCE);
    if (fence) {
      output.push(
        inCodeBlock ? renderCodeBottom() : renderCodeTop(fence[1].trim())
      );
      inCodeBlock = !inCodeBlock;
    } else if (inCodeBlock) {
      output.push(renderCodeLine(line));
    } else {
      output.push(...renderProseLine(line, width));
    }
  }

  return `${output.join('\n')}\n`;
}

function renderProseLine(line: string, width: number): string[] {
  if (line.trim() === '') {
    return [''];
  }

  if (HORIZONTAL_RULE.test(line)) {
    return [color.dim(symbols.rule.repeat(RULE_WIDTH))];
  }

  const heading = line.match(HEADING);
  if (heading) {
    return [
      `${color.magenta(symbols.accent)} ${color.bold(color.cyan(heading[2]))}`,
    ];
  }

  const source = line.match(SOURCE);
  if (source) {
    return [
      `  ${color.dim(symbols.link)} ${color.underline(color.blue(source[1]))}`,
    ];
  }

  const bullet = line.match(BULLET);
  if (bullet) {
    return renderBullet(bullet[2], width);
  }

  if (TABLE_ROW.test(line)) {
    return [renderTableRow(line)];
  }

  if (SECTION_LABEL.test(line)) {
    return [color.bold(line)];
  }

  return wrap(line, width).map((part) => styleInline(part));
}

function renderBullet(content: string, width: number): string[] {
  const field = content.match(META_FIELD);
  if (field && !content.startsWith('`')) {
    return renderMetaField(field[1], field[2], width);
  }

  const marker = color.cyan(symbols.bullet);
  return wrap(content, width - 2).map((part, index) =>
    index === 0 ? `${marker} ${styleInline(part)}` : `  ${styleInline(part)}`
  );
}

function renderMetaField(key: string, value: string, width: number): string[] {
  if (key === 'title') {
    return [`${color.magenta(symbols.diamond)} ${color.bold(value)}`];
  }

  if (key === 'docset_id') {
    return [`  ${color.dim('id')}  ${color.cyan(value)}`];
  }

  if (/score$/i.test(key)) {
    return [renderScore(key.replace(/score$/i, ''), value)];
  }

  if (key === 'description') {
    return wrap(value, width - 2).map((part) => `  ${color.dim(part)}`);
  }

  const indent = ' '.repeat(key.length + 4);
  return wrap(value, width - key.length - 4).map((part, index) =>
    index === 0
      ? `  ${color.dim(key)}  ${styleInline(part)}`
      : `${indent}${styleInline(part)}`
  );
}

function renderScore(label: string, value: string): string {
  const score = Number(value);
  const paddedLabel = color.dim(label.padEnd(11));

  if (!Number.isFinite(score)) {
    return `  ${paddedLabel} ${value}`;
  }

  const clamped = Math.max(0, Math.min(100, score));
  const filled = Math.round((clamped / 100) * 10);
  const bar =
    symbols.scoreOn.repeat(filled) + symbols.scoreOff.repeat(10 - filled);
  const tint = scoreTint(score);

  return `  ${paddedLabel} ${tint(bar)} ${tint(String(value))}`;
}

function scoreTint(score: number): (text: string) => string {
  if (score >= 80) {
    return color.green;
  }

  if (score >= 50) {
    return color.yellow;
  }

  return color.red;
}

function renderTableRow(line: string): string {
  if (TABLE_SEPARATOR.test(line)) {
    return color.dim(symbols.rule.repeat(RULE_WIDTH));
  }

  const cells = line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => styleInline(cell.trim()));

  return `  ${cells.join(color.dim(` ${symbols.codeGutter} `))}`;
}

function renderCodeTop(language: string): string {
  const chip = language ? ` ${color.dim(language)}` : '';
  return `${color.dim(`${symbols.codeTop}${symbols.rule}`)}${chip}`;
}

function renderCodeLine(line: string): string {
  return `${color.dim(`${symbols.codeGutter} `)}${color.gray(line)}`;
}

function renderCodeBottom(): string {
  return color.dim(`${symbols.codeBottom}${symbols.rule}`);
}

function styleInline(text: string): string {
  return text
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_match, label: string, url: string) =>
        `${color.underline(color.blue(label))}${color.dim(` (${url})`)}`
    )
    .replace(/`([^`]+)`/g, (_match, code: string) => color.cyan(code))
    .replace(/\*\*([^*]+)\*\*/g, (_match, bold: string) => color.bold(bold));
}

function wrap(text: string, width: number): string[] {
  const limit = Math.max(20, width);
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (current === '') {
      current = word;
    } else if (current.length + 1 + word.length <= limit) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current !== '') {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [''];
}
