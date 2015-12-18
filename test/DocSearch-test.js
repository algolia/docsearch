/* eslint-env mocha */

import jsdom from 'mocha-jsdom';
import expect from 'expect';
import fixtures from 'node-fixtures';

describe('DocSearch', () => {
  let docSearch;
  let $;
  jsdom({useEach: true});


  beforeEach(() => {
    // We need a DOM to be ready before importing Zepto
    docSearch = require('../index.js');
    $ = require('npm-zepto');

    // Note: If you edit this HTML while doing TDD with `npm run test:watch`,
    // you will have to restart `npm run test:watch` for the new HTML to be
    // updated
    document.body.innerHTML = '<div><input id="input" name="input-name" /></div>';
  });

  describe('checkArguments', () => {
    it('should throw an error if no apiKey defined', () => {
      // Given
      let input = {
        indexName: 'indexName'
      };

      // When
      expect(() => {
        docSearch(input);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if no indexName defined', () => {
      // Given
      let input = {
        apiKey: 'apiKey'
      };

      // When
      expect(() => {
        docSearch(input);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if no input element matches the selector in the page', () => {
      // Given
      let input = {
        apiKey: 'apiKey',
        indexName: 'indexName',
        inputSelector: '#unknown-input'
      };

      // When
      expect(() => {
        docSearch(input);
      }).toThrow(/^Error:/);
    });
    it('should pass apiKey and indexName as properties of the instance', () => {
      // Given
      let input = {
        apiKey: 'apiKey',
        indexName: 'indexName',
        inputSelector: '#input'
      };

      // When
      let actual = docSearch(input);

      // Then
      expect(actual.apiKey).toEqual('apiKey');
      expect(actual.indexName).toEqual('indexName');
    });
    it('should pass the matching input as property of the input', () => {
      // Given
      let input = {
        apiKey: 'apiKey',
        indexName: 'indexName',
        inputSelector: '#input'
      };

      // When
      let actual = docSearch(input);

      // Then
      expect($(actual.input).attr('name')).toEqual('input-name');
    });
    it('should pass options as properties of the input', () => {
      // Given
      let input = {
        apiKey: 'apiKey',
        indexName: 'indexName',
        inputSelector: '#input',
        algoliaOptions: {name: 'foo'},
        autocompleteOptions: {name: 'bar'}
      };

      // When
      let actual = docSearch(input);

      // Then
      expect(actual.algoliaOptions.name).toEqual('foo');
      expect(actual.autocompleteOptions.name).toEqual('bar');
    });
  });
});
