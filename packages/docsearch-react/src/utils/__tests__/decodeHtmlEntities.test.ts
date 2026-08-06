import { describe, it, expect } from 'vitest';

import { decodeHtmlEntities } from '../decodeHtmlEntities';

describe('decodeHtmlEntities', () => {
  it('returns strings without entities unchanged', () => {
    expect(decodeHtmlEntities('plain text')).toBe('plain text');
  });

  it('decodes supported HTML entities', () => {
    expect(decodeHtmlEntities('&lt;div class=&quot;foo&quot;&gt;')).toBe(
      '<div class="foo">'
    );
    expect(decodeHtmlEntities('it&#039;s a test')).toBe("it's a test");
    expect(decodeHtmlEntities('Search &amp; Discovery')).toBe(
      'Search & Discovery'
    );
  });

  it('does not double-decode escaped entities', () => {
    expect(decodeHtmlEntities('&amp;lt;')).toBe('&lt;');
    expect(decodeHtmlEntities('&amp;amp;')).toBe('&amp;');
  });
});
