// @vitest-environment node

import { describe, expect, it } from 'vitest';

import type { AgentChoice } from '../prompt';
import {
  parseAgentSelection,
  parseScopeSelection,
  PromptCancelledError,
} from '../prompt';

const CHOICES: AgentChoice[] = [
  { detected: true, displayName: 'Cursor', name: 'cursor' },
  { detected: false, displayName: 'Claude Code', name: 'claude' },
  { detected: false, displayName: 'Codex', name: 'codex' },
];

describe('parseAgentSelection', () => {
  it('defaults blank input to detected agents only', () => {
    expect(parseAgentSelection('', CHOICES)).toEqual(['cursor']);
  });

  it('selects every agent for "all"', () => {
    expect(parseAgentSelection('all', CHOICES)).toEqual([
      'cursor',
      'claude',
      'codex',
    ]);
  });

  it('selects nothing for "none"', () => {
    expect(parseAgentSelection('none', CHOICES)).toEqual([]);
  });

  it('parses a mix of numbers and names without duplicates', () => {
    expect(parseAgentSelection('1, claude, 2', CHOICES)).toEqual([
      'cursor',
      'claude',
    ]);
  });

  it('rejects unknown tokens', () => {
    expect(() => parseAgentSelection('9', CHOICES)).toThrow(/Unknown agent/);
    expect(() => parseAgentSelection('vim', CHOICES)).toThrow(/Unknown agent/);
  });
});

describe('parseScopeSelection', () => {
  it('defaults blank input to project', () => {
    expect(parseScopeSelection('')).toBe('project');
  });

  it('accepts numbers, letters, and names', () => {
    expect(parseScopeSelection('1')).toBe('project');
    expect(parseScopeSelection('p')).toBe('project');
    expect(parseScopeSelection('Project')).toBe('project');
    expect(parseScopeSelection('2')).toBe('global');
    expect(parseScopeSelection('g')).toBe('global');
    expect(parseScopeSelection('GLOBAL')).toBe('global');
  });

  it('rejects unknown scope input', () => {
    expect(() => parseScopeSelection('workspace')).toThrow(/Unknown scope/);
  });
});

describe('PromptCancelledError', () => {
  it('preserves the intended process exit code', () => {
    expect(new PromptCancelledError().exitCode).toBe(0);
    expect(new PromptCancelledError(130).exitCode).toBe(130);
  });
});
