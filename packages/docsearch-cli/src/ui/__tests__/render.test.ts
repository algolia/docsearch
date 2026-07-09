import { describe, expect, it } from 'vitest';

import { renderLanding, renderLogo } from '../render';

describe('renderLanding', () => {
  it('includes the logo, tagline, commands, and discovery link', () => {
    const output = renderLanding();

    expect(output).toContain('@@@@@@@@@@@@@@@@@@@@@');
    expect(output).toContain('The open documentation search for AI agents');
    expect(output).toContain('setup');
    expect(output).toContain('docs');
    expect(output).toContain('resolve');
    expect(output).toContain('query');
    expect(output).toContain('https://docsearch.algolia.com');
  });

  it('renders the logo as multi-line art', () => {
    expect(renderLogo().trim().split('\n').length).toBeGreaterThan(20);
  });
});
