// @vitest-environment node

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { describe, expect, it } from 'vitest';

import { formatToolResult } from '../format';

describe('formatToolResult', () => {
  it('prints text content for normal output', () => {
    const result: CallToolResult = {
      content: [
        { type: 'text', text: 'First result' },
        { type: 'text', text: 'Second result' },
      ],
    };

    expect(formatToolResult(result, false)).toBe(
      'First result\n\nSecond result\n'
    );
  });

  it('prints the raw result for JSON output', () => {
    const result: CallToolResult = {
      content: [{ type: 'text', text: 'Result' }],
    };

    expect(formatToolResult(result, true)).toBe(
      `${JSON.stringify(result, null, 2)}\n`
    );
  });
});
