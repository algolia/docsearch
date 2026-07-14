// @vitest-environment node

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { runCli } from '../cli';
import { callDocSearchTool } from '../mcp/client';

vi.mock('../mcp/client.js', () => ({
  callDocSearchTool: vi.fn(),
}));

interface CapturedOutput {
  stderr: string;
  stdout: string;
}

function captureOutput(): CapturedOutput {
  const output: CapturedOutput = { stderr: '', stdout: '' };
  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    output.stdout += String(chunk);
    return true;
  });
  vi.spyOn(process.stderr, 'write').mockImplementation((chunk) => {
    output.stderr += String(chunk);
    return true;
  });
  return output;
}

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('runCli', () => {
  it('returns a non-zero exit for MCP tool errors while preserving JSON output', async () => {
    const result: CallToolResult = {
      content: [{ text: 'Invalid query', type: 'text' }],
      isError: true,
    };
    vi.mocked(callDocSearchTool).mockResolvedValue(result);
    const output = captureOutput();

    const exitCode = await runCli(['resolve', 'Next.js', '--json']);

    expect(exitCode).toBe(1);
    expect(JSON.parse(output.stdout)).toMatchObject({ isError: true });
    expect(output.stderr).toBe('');
  });

  it('reports MCP tool errors in human-readable mode', async () => {
    const result: CallToolResult = {
      content: [{ text: 'Invalid query', type: 'text' }],
      isError: true,
    };
    vi.mocked(callDocSearchTool).mockResolvedValue(result);
    const output = captureOutput();

    const exitCode = await runCli(['resolve', 'Next.js']);

    expect(exitCode).toBe(1);
    expect(output.stderr).toContain('Invalid query');
  });

  it('uses exit code 2 for command usage errors', async () => {
    const output = captureOutput();

    const exitCode = await runCli(['resolve', 'Next.js', '--max-results', '2']);

    expect(exitCode).toBe(2);
    expect(output.stderr).toContain('not valid for the resolve command');
    expect(callDocSearchTool).not.toHaveBeenCalled();
  });
});
