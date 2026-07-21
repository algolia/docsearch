import { describe, expect, it } from 'vitest';

import { escapeHtml, sanitizeUrl, sanitizeUserInput } from '../sanitize';

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml(`<img src="x" onerror='alert(1)'>`)).toBe(
      '&lt;img src=&quot;x&quot; onerror=&#039;alert(1)&#039;&gt;',
    );
  });
});

describe('sanitizeUserInput', () => {
  it('strips tags then escapes remaining text', () => {
    expect(sanitizeUserInput('<b>hello</b> & world')).toBe('hello &amp; world');
  });
});

describe('sanitizeUrl', () => {
  it('allows http(s) and mailto URLs', () => {
    expect(sanitizeUrl('https://docsearch.algolia.com')).toBe('https://docsearch.algolia.com');
    expect(sanitizeUrl('http://example.com/path')).toBe('http://example.com/path');
    expect(sanitizeUrl('mailto:docs@example.com')).toBe('mailto:docs@example.com');
  });

  it('allows relative paths and fragments', () => {
    expect(sanitizeUrl('/docs/api')).toBe('/docs/api');
    expect(sanitizeUrl('#section')).toBe('#section');
    expect(sanitizeUrl('?q=1')).toBe('?q=1');
    expect(sanitizeUrl('./relative')).toBe('./relative');
  });

  it('blocks javascript and other unsafe schemes', () => {
    const jsAlert = `javascript${':'}alert(1)`;
    expect(sanitizeUrl(jsAlert)).toBe('');
    expect(sanitizeUrl(`JAVASCRIPT${':'}alert(1)`)).toBe('');
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('');
    expect(sanitizeUrl('//evil.example/path')).toBe('');
  });

  it('blocks schemes broken up by whitespace or control characters', () => {
    expect(sanitizeUrl(`java\tscript${':'}alert(1)`)).toBe('');
    expect(sanitizeUrl(`java\nscript${':'}alert(1)`)).toBe('');
    expect(sanitizeUrl(`java\rscript${':'}alert(1)`)).toBe('');
    expect(sanitizeUrl(`java script${':'}alert(1)`)).toBe('');
    expect(sanitizeUrl(`java\u0000script${':'}alert(1)`)).toBe('');
  });
});
