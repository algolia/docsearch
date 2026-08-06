import { describe, expect, it } from 'vitest';

import { isQueryEmpty } from '../isQueryEmpty';

describe('isQueryEmpty', () => {
  it.each([
    ['an omitted query', undefined],
    ['an empty query', ''],
    ['a whitespace-only query', ' \t\n '],
  ])('returns true for %s', (_, query) => {
    expect(isQueryEmpty(query)).toBe(true);
  });

  it('returns false for a query containing text', () => {
    expect(isQueryEmpty('  DocSearch  ')).toBe(false);
  });
});
