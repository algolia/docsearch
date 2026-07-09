// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { renderHelp, renderLanding, renderLogo } from '../render';

describe('renderLanding', () => {
  it('includes the logo, tagline, commands, and discovery link', () => {
    const output = renderLanding();

    expect(output).toContain('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓');
    expect(output).toContain('The open documentation search for AI agents');
    expect(output).toContain('setup');
    expect(output).toContain('docs');
    expect(output).toContain('resolve');
    expect(output).toContain('query');
    expect(output).toContain('https://docsearch.algolia.com');
  });

  it('renders the logo as multi-line art', () => {
    expect(renderLogo().trim().split('\n')).toHaveLength(21);
  });

  it('documents setup and query flags', () => {
    const output = renderHelp();

    expect(output).toContain('--all');
    expect(output).toContain('--cursor');
    expect(output).toContain('--max-results');
    expect(output).toContain('--max-docsets');
    expect(output).toContain('--top-n');
    expect(output).toContain('project + detected agents');
  });
});
