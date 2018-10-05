import utils from '../utils';

describe('utils', () => {
  describe('mergeKeyWithParent', () => {
    it('should move all subkeys to parent', () => {
      // Given
      const input = {
        name: 'foo',
        hierarchy: {
          lvl0: 'bar',
          lvl1: 'baz',
        },
      };

      // When
      const actual = utils.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual.lvl0).toEqual('bar');
      expect(actual.lvl1).toEqual('baz');
    });
    it('should delete the attribute', () => {
      // Given
      const input = {
        name: 'foo',
        hierarchy: {
          lvl0: 'bar',
          lvl1: 'baz',
        },
      };

      // When
      const actual = utils.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual.hierarchy).toEqual(undefined);
    });

    it('should overwrite key if present', () => {
      // Given
      const input = {
        name: 'foo',
        lvl0: 42,
        hierarchy: {
          lvl0: 'bar',
          lvl1: 'baz',
        },
      };

      // When
      const actual = utils.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual.lvl0).not.toEqual(42);
      expect(actual.lvl0).toEqual('bar');
    });
    it('should do nothing if no such key', () => {
      // Given
      const input = {
        name: 'foo',
      };

      // When
      const actual = utils.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual).toBe(input);
    });
    it('should throw an error if key is no an object', () => {
      // Given
      const input = {
        name: 'foo',
        hierarchy: 42,
      };

      // When
      const actual = utils.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual).toBe(input);
    });
  });

  describe('groupBy', () => {
    it('group by specified key', () => {
      // Given
      const input = [
        { name: 'Tim', category: 'devs' },
        { name: 'Vincent', category: 'devs' },
        { name: 'Ben', category: 'sales' },
        { name: 'Jeremy', category: 'sales' },
        { name: 'AlexS', category: 'devs' },
        { name: 'AlexK', category: 'sales' },
        { name: 'AlexK', category: 'constructor' },
      ];

      // When
      const actual = utils.groupBy(input, 'category');

      // Expect
      expect(actual).toEqual({
        constructor: [{ category: 'constructor', name: 'AlexK' }],
        devs: [
          { name: 'Tim', category: 'devs' },
          { name: 'Vincent', category: 'devs' },
          { name: 'AlexS', category: 'devs' },
        ],
        sales: [
          { name: 'Ben', category: 'sales' },
          { name: 'Jeremy', category: 'sales' },
          { name: 'AlexK', category: 'sales' },
        ],
      });
    });
    it('group by key considering lowercase forms', () => {
      // Given
      const input = [
        { name: 'Tim', category: 'devs' },
        { name: 'Vincent', category: 'DeVs' },
      ];

      // When
      const actual = utils.groupBy(input, 'category');

      // Expect
      expect(actual).toEqual({
        devs: [
          { name: 'Tim', category: 'devs' },
          { name: 'Vincent', category: 'DeVs' },
        ],
      });
    });
    it('throw an error if key does not exist', () => {
      // Given
      const input = [
        { name: 'Tim' },
        { name: 'Vincent' },
        { name: 'Ben' },
        { name: 'Jeremy' },
        { name: 'AlexS' },
        { name: 'AlexK' },
      ];

      // When
      expect(() => {
        utils.groupBy(input, 'category');
      }).toThrow(Error);
    });
  });

  describe('values', () => {
    it('should extract all values', () => {
      // Given
      const input = {
        foo: 42,
        bar: true,
        baz: 'yep',
      };

      // Given
      const actual = utils.values(input);

      // Then
      expect(actual).toEqual([42, true, 'yep']);
    });
  });

  describe('flatten', () => {
    // flatten values
    it('should flatten array on level deep', () => {
      // Given
      const input = [1, 2, [3, 4], [5, 6]];

      // Given
      const actual = utils.flatten(input);

      // Then
      expect(actual).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('flattenAndFlagFirst', () => {
    it('should flatten all values', () => {
      // Given
      const input = {
        devs: [
          { name: 'Tim', category: 'dev' },
          { name: 'Vincent', category: 'dev' },
          { name: 'AlexS', category: 'dev' },
        ],
        sales: [
          { name: 'Ben', category: 'sales' },
          { name: 'Jeremy', category: 'sales' },
          { name: 'AlexK', category: 'sales' },
        ],
      };

      // When
      const actual = utils.flattenAndFlagFirst(input, 'isTop');

      // Then
      expect(actual).toEqual([
        { name: 'Tim', category: 'dev', isTop: true },
        { name: 'Vincent', category: 'dev', isTop: false },
        { name: 'AlexS', category: 'dev', isTop: false },
        { name: 'Ben', category: 'sales', isTop: true },
        { name: 'Jeremy', category: 'sales', isTop: false },
        { name: 'AlexK', category: 'sales', isTop: false },
      ]);
    });
  });

  describe('compact', () => {
    it('should clear all falsy elements from the array', () => {
      // Given
      const input = [42, false, null, undefined, '', [], 'foo'];

      // When
      const actual = utils.compact(input);

      // Then
      expect(actual).toEqual([42, [], 'foo']);
    });
  });

  describe('getHighlightedValue', () => {
    it('should return the highlighted version if exists', () => {
      // Given
      const input = {
        _highlightResult: {
          text: {
            value: '<mark>foo</mark>',
          },
        },
        text: 'foo',
      };

      // When
      const actual = utils.getHighlightedValue(input, 'text');

      // Then
      expect(actual).toEqual('<mark>foo</mark>');
    });
    it('should return the default key if no highlighted value', () => {
      // Given
      const input = {
        _highlightResult: {
          text: {},
        },
        text: 'foo',
      };

      // When
      const actual = utils.getHighlightedValue(input, 'text');

      // Then
      expect(actual).toEqual('foo');
    });
    it('should return the default key if no highlight results', () => {
      // Given
      const input = {
        text: 'foo',
      };

      // When
      const actual = utils.getHighlightedValue(input, 'text');

      // Then
      expect(actual).toEqual('foo');
    });
  });

  describe('getSnippetedValue', () => {
    it('should return the key value if no snippet returned', () => {
      // Given
      const input = {
        text: 'Foo',
      };

      // When
      const actual = utils.getSnippetedValue(input, 'text');

      // Then
      expect(actual).toEqual('Foo');
    });
    it('should return the key value if no snippet for this key', () => {
      // Given
      const input = {
        _snippetResult: {
          content: {
            value: '<mark>Bar</mark>',
          },
        },
        text: 'Foo',
        content: 'Bar',
      };

      // When
      const actual = utils.getSnippetedValue(input, 'text');

      // Then
      expect(actual).toEqual('Foo');
    });
    it('should add ellipsis at the start if snippet does not start with a capital letter', () => {
      // Given
      const input = {
        _snippetResult: {
          text: {
            value: 'this is the <mark>end</mark> of a sentence.',
          },
        },
        text: 'this is the end of a sentence.',
      };

      // When
      const actual = utils.getSnippetedValue(input, 'text');

      // Then
      expect(actual).toEqual('…this is the <mark>end</mark> of a sentence.');
    });
    it('should add ellipsis at the end if snippet does not end with a terminal point', () => {
      // Given
      const input = {
        _snippetResult: {
          text: {
            value: 'This is an <mark>finished</mark> sentence',
          },
        },
        text: 'This is an <mark>finished</mark> sentence',
      };

      // When
      const actual = utils.getSnippetedValue(input, 'text');

      // Then
      expect(actual).toEqual('This is an <mark>finished</mark> sentence…');
    });
  });

  describe('deepClone', () => {
    it('should create an object with the exact same value', () => {
      // Given
      const input = {
        foo: {
          bar: 'baz',
        },
      };

      // When
      const actual = utils.deepClone(input);

      // Then
      expect(actual.foo.bar).toEqual('baz');
    });
    it('should not change the initial object', () => {
      // Given
      const input = {
        foo: {
          bar: 'baz',
        },
      };

      // When
      const actual = utils.deepClone(input);
      input.foo.bar = 42;

      // Then
      expect(input.foo.bar).toEqual(42);
      expect(actual.foo.bar).not.toEqual(42);
      expect(actual.foo.bar).toEqual('baz');
    });
  });
});
