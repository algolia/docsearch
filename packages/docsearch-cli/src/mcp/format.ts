import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

type TextContent = {
  text: string;
  type: 'text';
};

export function formatToolResult(result: CallToolResult, json: boolean): string {
  if (json) {
    return `${JSON.stringify(result, null, 2)}\n`;
  }

  const text = result.content
    .filter((part): part is TextContent => part.type === 'text')
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join('\n\n');

  if (text) {
    return `${text}\n`;
  }

  return `${JSON.stringify(result, null, 2)}\n`;
}
