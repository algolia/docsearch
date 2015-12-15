/* eslint-env mocha */

import jsdom from 'mocha-jsdom';
import expect from 'expect';

let ddescribe = describe.only;
let xdescribe = describe.skip;
let iit = it.only;
let xit = it.skip;

describe('utils', () => {
  var utils;
  jsdom();

  before(() => {
    // We need to load utils from here as it depends on Zepto, which itself
    // needs jsdom to be called before being loaded.
    utils = require('../src/lib/utils');
  });

  describe('mergeKeyWithParent', () => {
    it('should move all subkeys to parent', () => {
      // Given
      let input = {
        name: 'foo',
        hierarchy: {
          lvl0: 'bar',
          lvl1: 'baz'
        }
      };

      // When
      let actual = utils.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual.lvl0).toEqual('bar');
      expect(actual.lvl1).toEqual('baz');
    });
    it('should delete the attribute', () => {
      // Given
      let input = {
        name: 'foo',
        hierarchy: {
          lvl0: 'bar',
          lvl1: 'baz'
        }
      };

      // When
      let actual = utils.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual.hierarchy).toEqual(undefined);
    });
    it('should overwrite key if present', () => {
      // Given
      let input = {
        name: 'foo',
        lvl0: 42,
        hierarchy: {
          lvl0: 'bar',
          lvl1: 'baz'
        }
      };

      // When
      let actual = utils.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual.lvl0).toNotEqual(42);
      expect(actual.lvl0).toEqual('bar');
    });
    it('should throw an error if no such key', () => {
      // Given
      let input = {
        name: 'foo'
      };

      // When
      expect(() => {
        utils.mergeKeyWithParent(input, 'hierarchy');
      }).toThrow(Error);
    });
    it('should throw an error if key is no an object', () => {
      // Given
      let input = {
        name: 'foo',
        hierarchy: 42
      };

      // When
      expect(() => {
        utils.mergeKeyWithParent(input, 'hierarchy');
      }).toThrow(Error);
    });
  });

  describe('groupBy', () => {
    it('group by specified key', () => {
      // Given
      let input = [
        {name: 'Tim', category: 'devs'},
        {name: 'Vincent', category: 'devs'},
        {name: 'Ben', category: 'sales'},
        {name: 'Jeremy', category: 'sales'},
        {name: 'AlexS', category: 'devs'},
        {name: 'AlexK', category: 'sales'}
      ];

      // When
      let actual = utils.groupBy(input, 'category');

      // Expect
      expect(actual).toEqual({
        devs: [
          {name: 'Tim', category: 'devs'},
          {name: 'Vincent', category: 'devs'},
          {name: 'AlexS', category: 'devs'}
        ],
        sales: [
          {name: 'Ben', category: 'sales'},
          {name: 'Jeremy', category: 'sales'},
          {name: 'AlexK', category: 'sales'}
        ]
      });
    });
    it('throw an error if key does not exist', () => {
      // Given
      let input = [
        {name: 'Tim'},
        {name: 'Vincent'},
        {name: 'Ben'},
        {name: 'Jeremy'},
        {name: 'AlexS'},
        {name: 'AlexK'}
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
      let input = {
        foo: 42,
        bar: true,
        baz: 'yep'
      };

      // Given
      let actual = utils.values(input);

      // Then
      expect(actual.length).toEqual(3);
      expect(actual).toInclude(42);
      expect(actual).toInclude(true);
      expect(actual).toInclude('yep');
    });
  });

  describe('flatten', () => {
    // flatten values
    it('should flatten array on level deep', () => {
      // Given
      let input = [1, 2, [3, 4], [5, 6]];

      // Given
      let actual = utils.flatten(input);

      // Then
      expect(actual).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('flattenAndFlagFirst', () => {
    it('should flatten all values', () => {
      // Given
      let input = {
       'devs': [
         {name: 'Tim', category: 'dev'},
         {name: 'Vincent', category: 'dev'},
         {name: 'AlexS', category: 'dev'}
       ],
       'sales': [
         {name: 'Ben', category: 'sales'},
         {name: 'Jeremy', category: 'sales'},
         {name: 'AlexK', category: 'sales'}
       ]
      };

      // When
      let actual = utils.flattenAndFlagFirst(input, 'isTop');

      // Then
      expect(actual).toEqual([
        {name: 'Tim', category: 'dev', isTop: true},
        {name: 'Vincent', category: 'dev'},
        {name: 'AlexS', category: 'dev'},
        {name: 'Ben', category: 'sales', isTop: true},
        {name: 'Jeremy', category: 'sales'},
        {name: 'AlexK', category: 'sales'}
      ]);
    });
  });

  describe('compact', () => {
    it('should clear all falsy elements from the array', () => {
      // Given
      let input = [42, false, null, undefined, '', [], 'foo'];

      // When
      let actual = utils.compact(input);

      // Then
      expect(actual).toEqual([42, [], 'foo']);
    });
  });

  describe('getHighlightedValue', () => {
    it('should return the highlighted version if exists', () => {
      // Given
      let input = {
        _highlightResult: {
          text: {
            value: '<mark>foo</mark>'
          }
        },
        text: 'foo'
      };

      // When
      let actual = utils.getHighlightedValue(input, 'text');

      // Then
      expect(actual).toEqual('<mark>foo</mark>');
    });
    it('should return the default key if no highlighted value', () => {
      // Given
      let input = {
        _highlightResult: {
          text: { }
        },
        text: 'foo'
      };

      // When
      let actual = utils.getHighlightedValue(input, 'text');

      // Then
      expect(actual).toEqual('foo');
    });
    it('should return the default key if no highlight results', () => {
      // Given
      let input = {
        text: 'foo'
      };

      // When
      let actual = utils.getHighlightedValue(input, 'text');

      // Then
      expect(actual).toEqual('foo');
    });
  });
});
