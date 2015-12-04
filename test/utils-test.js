/* eslint-env mocha */

import jsdom from 'mocha-jsdom';
import expect from 'expect';

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
});
