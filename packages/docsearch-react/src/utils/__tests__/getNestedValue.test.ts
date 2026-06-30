import { describe, expect, it } from 'vitest';

import { getNestedValue } from '../getNestedValue';

const TEST_ITEM = {
  hierarchy: {
    lvl0: 'Test',
    lvl1: 'Another test',
  },
  source: {
    page: {
      title: 'Test Page',
    },
  },
  type: 'content',
  tags: ['guide', 'framework', 'latest'],
};

describe('getNestedValue', () => {
  it('returns top level value', () => {
    const result = getNestedValue(TEST_ITEM, 'type');

    expect(result).toEqual('content');
  });

  it('returns nested value', () => {
    const result = getNestedValue(TEST_ITEM, 'hierarchy.lvl1');

    expect(result).toEqual('Another test');
  });

  it('returns deeply nested value', () => {
    const result = getNestedValue(TEST_ITEM, 'source.page.title');

    expect(result).toEqual('Test Page');
  });

  it('returns value at an array index', () => {
    let result = getNestedValue(TEST_ITEM, 'tags[1]');

    expect(result).toEqual('framework');

    result = getNestedValue(TEST_ITEM, 'tags.2');

    expect(result).toEqual('latest');
  });

  it('returns undefined for no found value', () => {
    let result = getNestedValue(TEST_ITEM, 'noop');

    expect(result).toBeUndefined();

    result = getNestedValue(TEST_ITEM, 'hierarchy.lvl100');

    expect(result).toBeUndefined();

    result = getNestedValue(TEST_ITEM, 'tags[10]');

    expect(result).toBeUndefined();
  });
});
