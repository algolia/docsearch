// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { renderMarkdown } from '../markdown';

describe('renderMarkdown', () => {
  it('renders headings, sources, bullets, and dividers as plain text when color is disabled', () => {
    const input = [
      'Searched docsets:',
      '',
      '### Configure props',
      '',
      'Source: https://example.com/docs',
      '',
      '- `apiKey`: Your key.',
      '- Read the [configuration guide](https://example.com/config).',
      '--------------------------------',
    ].join('\n');

    const output = renderMarkdown(input);

    expect(output).toContain('Configure props');
    expect(output).toContain('https://example.com/docs');
    expect(output).toContain('apiKey');
    expect(output).toContain('https://example.com/config');
    expect(output).not.toContain('###');
    expect(output).toMatch(/─{10,}/);
  });

  it('renders resolve metadata as a card with a score bar', () => {
    const input = [
      '- title: Next.js Docs',
      '- docset_id: repo/vercel/next.js',
      '- description: Official documentation.',
      '- trustScore: 100',
    ].join('\n');

    const output = renderMarkdown(input);

    expect(output).toContain('Next.js Docs');
    expect(output).toContain('repo/vercel/next.js');
    expect(output).toContain('trust');
    expect(output).toContain('100');
    expect(output).toMatch(/[▰▱#-]{10}/);
  });

  it('keeps code fences as a bordered block without backticks', () => {
    const input = ['```ts', 'const x = 1;', '```'].join('\n');

    const output = renderMarkdown(input);

    expect(output).toContain('const x = 1;');
    expect(output).not.toContain('```');
  });
});
