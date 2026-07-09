/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import readline from 'node:readline';

import { UsageError } from '../errors.js';
import { color, isInteractive, symbols } from '../ui/theme.js';

import type { SetupAgent, SetupScope } from './agents.js';

export class PromptCancelledError extends Error {
  constructor() {
    super('Setup cancelled.');
    this.name = 'PromptCancelledError';
  }
}

export interface AgentChoice {
  detected: boolean;
  displayName: string;
  name: SetupAgent;
}

interface ScopeChoice {
  hint: string;
  label: string;
  value: SetupScope;
}

const SCOPE_CHOICES: ScopeChoice[] = [
  { hint: 'this project only (./.cursor, ./.mcp.json, …)', label: 'Project', value: 'project' },
  { hint: 'every project (~/.cursor, ~/.codex, …)', label: 'Global', value: 'global' },
];

export function parseScopeSelection(raw: string): SetupScope {
  const normalized = raw.trim().toLowerCase();

  if (normalized === '' || normalized === '2' || normalized === 'g' || normalized === 'global') {
    return 'global';
  }

  if (normalized === '1' || normalized === 'p' || normalized === 'project') {
    return 'project';
  }

  throw new UsageError(`Unknown scope: "${raw.trim()}". Choose "project" or "global".`);
}

export function promptScope(): Promise<SetupScope> {
  if (isInteractive()) {
    return promptScopeInteractive();
  }

  return promptScopeByLine();
}

function promptScopeInteractive(): Promise<SetupScope> {
  const input = process.stdin;
  const output = process.stderr;
  let cursor = 0;
  let renderedLines = 0;

  return new Promise<SetupScope>((resolve, reject) => {
    function render(): void {
      if (renderedLines > 0) {
        output.write(`\u001B[${renderedLines}A`);
      }

      const lines = [
        `${color.magenta(symbols.diamond)} ${color.bold('Where should DocSearch be installed?')} ${color.dim('(↑↓ move · enter confirm)')}`,
        ...SCOPE_CHOICES.map((choice, index) => {
          const active = index === cursor;
          const radio = active ? color.green(symbols.checkboxOn) : color.dim(symbols.checkboxOff);
          const pointer = active ? color.cyan(symbols.pointer) : ' ';
          const label = active ? color.cyan(choice.label) : choice.label;
          return `${pointer} ${radio} ${label} ${color.dim(`— ${choice.hint}`)}`;
        }),
      ];

      output.write(`${lines.map((line) => `\u001B[K${line}`).join('\n')}\n`);
      renderedLines = lines.length;
    }

    function cleanup(): void {
      input.setRawMode(false);
      input.removeListener('keypress', onKeypress);
      output.write('\u001B[?25h');
      input.pause();
    }

    function onKeypress(_input: string, key: readline.Key | undefined): void {
      if (!key) {
        return;
      }

      if (key.name === 'up' || key.name === 'k') {
        cursor = (cursor - 1 + SCOPE_CHOICES.length) % SCOPE_CHOICES.length;
        render();
      } else if (key.name === 'down' || key.name === 'j') {
        cursor = (cursor + 1) % SCOPE_CHOICES.length;
        render();
      } else if (key.name === 'return') {
        cleanup();
        resolve(SCOPE_CHOICES[cursor].value);
      } else if (key.name === 'escape' || (key.ctrl === true && key.name === 'c')) {
        cleanup();
        output.write('\n');
        reject(new PromptCancelledError());
      }
    }

    readline.emitKeypressEvents(input);
    input.setRawMode(true);
    output.write('\u001B[?25l');
    input.on('keypress', onKeypress);
    input.resume();
    render();
  });
}

async function promptScopeByLine(): Promise<SetupScope> {
  const output = process.stderr;

  output.write(`${color.magenta(symbols.diamond)} ${color.bold('Where should DocSearch be installed?')}\n`);
  for (const [index, choice] of SCOPE_CHOICES.entries()) {
    output.write(`  ${color.cyan(String(index + 1))}. ${choice.label} ${color.dim(`— ${choice.hint}`)}\n`);
  }
  output.write(`${color.dim('Enter "project" or "global" (blank for global):')} `);

  return parseScopeSelection(await readSingleLine());
}

export function parseAgentSelection(raw: string, choices: AgentChoice[]): SetupAgent[] {
  const normalized = raw.trim().toLowerCase();

  if (normalized === '') {
    return choices.filter((choice) => choice.detected).map((choice) => choice.name);
  }

  if (normalized === 'all' || normalized === '*') {
    return choices.map((choice) => choice.name);
  }

  if (normalized === 'none') {
    return [];
  }

  const selected = new Set<SetupAgent>();

  for (const token of normalized.split(/[\s,]+/).filter(Boolean)) {
    const index = Number(token);
    if (Number.isInteger(index) && index >= 1 && index <= choices.length) {
      selected.add(choices[index - 1].name);
    } else {
      const match = choices.find((choice) => choice.name === token);
      if (!match) {
        throw new UsageError(
          `Unknown agent: "${token}". Choose a number or one of: ${choices.map((c) => c.name).join(', ')}.`,
        );
      }
      selected.add(match.name);
    }
  }

  return [...selected];
}

export function promptAgents(choices: AgentChoice[]): Promise<SetupAgent[]> {
  if (isInteractive()) {
    return promptAgentsInteractive(choices);
  }

  return promptAgentsByLine(choices);
}

function promptAgentsInteractive(choices: AgentChoice[]): Promise<SetupAgent[]> {
  const input = process.stdin;
  const output = process.stderr;
  const selected = choices.map((choice) => choice.detected);
  let cursor = 0;
  let renderedLines = 0;

  return new Promise<SetupAgent[]>((resolve, reject) => {
    function render(): void {
      if (renderedLines > 0) {
        output.write(`\u001B[${renderedLines}A`);
      }

      const lines = [
        `${color.magenta(symbols.diamond)} ${color.bold('Select agents to configure')} ${color.dim('(↑↓ move · space toggle · a all · enter confirm)')}`,
        ...choices.map((choice, index) => {
          const box = selected[index] ? color.green(symbols.checkboxOn) : color.dim(symbols.checkboxOff);
          const pointer = index === cursor ? color.cyan(symbols.pointer) : ' ';
          const name = index === cursor ? color.cyan(choice.displayName) : choice.displayName;
          const detected = choice.detected ? color.dim(' (detected)') : '';
          return `${pointer} ${box} ${name}${detected}`;
        }),
      ];

      output.write(`${lines.map((line) => `\u001B[K${line}`).join('\n')}\n`);
      renderedLines = lines.length;
    }

    function cleanup(): void {
      input.setRawMode(false);
      input.removeListener('keypress', onKeypress);
      output.write('\u001B[?25h');
      input.pause();
    }

    function onKeypress(_input: string, key: readline.Key | undefined): void {
      if (!key) {
        return;
      }

      if (key.name === 'up' || key.name === 'k') {
        cursor = (cursor - 1 + choices.length) % choices.length;
        render();
      } else if (key.name === 'down' || key.name === 'j') {
        cursor = (cursor + 1) % choices.length;
        render();
      } else if (key.name === 'space') {
        selected[cursor] = !selected[cursor];
        render();
      } else if (key.name === 'a') {
        const allSelected = selected.every(Boolean);
        selected.fill(!allSelected);
        render();
      } else if (key.name === 'return') {
        cleanup();
        resolve(choices.filter((_, index) => selected[index]).map((choice) => choice.name));
      } else if (key.name === 'escape' || (key.ctrl === true && key.name === 'c')) {
        cleanup();
        output.write('\n');
        reject(new PromptCancelledError());
      }
    }

    readline.emitKeypressEvents(input);
    input.setRawMode(true);
    output.write('\u001B[?25l');
    input.on('keypress', onKeypress);
    input.resume();
    render();
  });
}

async function promptAgentsByLine(choices: AgentChoice[]): Promise<SetupAgent[]> {
  const output = process.stderr;

  output.write(`${color.magenta(symbols.diamond)} ${color.bold('Select agents to configure')}\n`);
  for (const [index, choice] of choices.entries()) {
    const detected = choice.detected ? color.dim(' (detected)') : '';
    output.write(`  ${color.cyan(String(index + 1))}. ${choice.displayName}${detected}\n`);
  }
  output.write(`${color.dim('Enter numbers/names (comma-separated), "all", or blank for detected:')} `);

  const raw = await readSingleLine();
  return parseAgentSelection(raw, choices);
}

// A single persistent line reader shared across prompts. Reading one line at a
// time with fresh listeners loses buffered input between prompts (and can hang
// at EOF), so we buffer stdin once and hand out lines on demand.
let stdinBuffer = '';
let stdinInitialized = false;
let stdinEnded = false;
const lineResolvers: Array<(line: string) => void> = [];

function pumpLines(): void {
  while (lineResolvers.length > 0) {
    const newline = stdinBuffer.indexOf('\n');
    if (newline >= 0) {
      const line = stdinBuffer.slice(0, newline).replace(/\r$/, '');
      stdinBuffer = stdinBuffer.slice(newline + 1);
      lineResolvers.shift()?.(line);
    } else if (stdinEnded) {
      const line = stdinBuffer;
      stdinBuffer = '';
      lineResolvers.shift()?.(line);
    } else {
      break;
    }
  }

  if (lineResolvers.length === 0 && !stdinEnded) {
    process.stdin.pause();
  }
}

function initStdin(): void {
  if (stdinInitialized) {
    return;
  }

  stdinInitialized = true;
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk: string) => {
    stdinBuffer += chunk;
    pumpLines();
  });
  process.stdin.on('end', () => {
    stdinEnded = true;
    pumpLines();
  });
}

function readSingleLine(): Promise<string> {
  initStdin();

  return new Promise((resolve) => {
    lineResolvers.push(resolve);
    process.stdin.resume();
    pumpLines();
  });
}
