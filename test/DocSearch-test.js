/* eslint-env mocha */
/* eslint no-new:0 */

import jsdom from 'mocha-jsdom';
import expect from 'expect';
import sinon from 'sinon';
// import fixtures from 'node-fixtures';

describe('DocSearch', () => {
  let DocSearch;
  let $;
  jsdom({useEach: true});

  beforeEach(() => {
    // We need a DOM to be ready before importing Zepto
    // We need to load DocSearch from here as it depends on Zepto, which itself
    // needs jsdom to be called before being loaded.
    DocSearch = require('../src/lib/DocSearch.js');
    $ = require('npm-zepto');

    // Note: If you edit this HTML while doing TDD with `npm run test:watch`,
    // you will have to restart `npm run test:watch` for the new HTML to be
    // updated
    document.body.innerHTML = `
    <div>
      <input id="input" name="search" />
      <span class="i-am-a-span">span span</span>
    </div>
    `;
  });

  describe('constructor', () => {
    let AlgoliaSearch;
    let algoliasearch;
    let AutoComplete;
    let autocomplete;
    let checkArguments;
    let getInputFromSelector;
    let checkArgumentsInitial;
    let getInputFromSelectorInitial;
    let defaultOptions;

    beforeEach(() => {
      algoliasearch = {
        algolia: 'client',
        addAlgoliaAgent: sinon.spy()
      };
      AlgoliaSearch = sinon.stub().returns(algoliasearch);
      autocomplete = {
        on: sinon.spy()
      };
      AutoComplete = sinon.stub().returns(autocomplete);

      checkArgumentsInitial = DocSearch.checkArguments;
      checkArguments = sinon.spy();
      getInputFromSelectorInitial = DocSearch.getInputFromSelector;
      getInputFromSelector = sinon.stub();
      defaultOptions = {
        indexName: 'indexName',
        apiKey: 'apiKey',
        inputSelector: '#input'
      };

      DocSearch.checkArguments = checkArguments;
      DocSearch.getInputFromSelector = getInputFromSelector;

      DocSearch.__Rewire__('algoliasearch', AlgoliaSearch);
      DocSearch.__Rewire__('autocomplete', AutoComplete);
    });

    afterEach(() => {
      // Cleanup the stubs on static methods
      DocSearch.checkArguments = checkArgumentsInitial;
      DocSearch.getInputFromSelector = getInputFromSelectorInitial;
    });

    it('should call checkArguments', () => {
      // Given
      let options = defaultOptions;

      // When
      new DocSearch(options);

      // Then
      expect(checkArguments.calledOnce).toBe(true);
    });
    it('should pass main options as instance properties', () => {
      // Given
      let options = defaultOptions;

      // When
      let actual = new DocSearch(options);

      // Then
      expect(actual.indexName).toEqual('indexName');
      expect(actual.apiKey).toEqual('apiKey');
    });
    it('should pass the input element as an instance property', () => {
      // Given
      let options = defaultOptions;
      getInputFromSelector.returns($('<span>foo</span>'));

      // When
      let actual = new DocSearch(options);

      // Then
      let $input = actual.input;
      expect($input.text()).toEqual('foo');
      expect($input[0].tagName).toEqual('SPAN');
    });
    it('should pass secondary options as instance properties', () => {
      // Given
      let options = {
        ...defaultOptions,
        algoliaOptions: 'algoliaOptions',
        autocompleteOptions: 'autocompleteOptions'
      };

      // When
      let actual = new DocSearch(options);

      // Then
      expect(actual.algoliaOptions).toEqual('algoliaOptions');
      expect(actual.autocompleteOptions).toEqual('autocompleteOptions');
    });
    it('should instanciate algoliasearch with the correct values', () => {
      // Given
      let options = defaultOptions;

      // When
      new DocSearch(options);

      // Then
      expect(AlgoliaSearch.calledOnce).toBe(true);
      expect(AlgoliaSearch.calledWith('BH4D9OD16A', 'apiKey')).toBe(true);
    });
    it('should set a custom User-Agent to algoliasearch', () => {
      // Given
      let options = defaultOptions;

      // When
      new DocSearch(options);

      // Then
      expect(algoliasearch.addAlgoliaAgent.calledOnce).toBe(true);
    });
    it('should instanciate autocomplete.js', () => {
      // Given
      let options = {
        ...defaultOptions,
        autocompleteOptions: 'bar'
      };
      let $input = $('<input name="foo" />');
      getInputFromSelector.returns($input);

      // When
      new DocSearch(options);

      // Then
      expect(AutoComplete.calledOnce).toBe(true);
      expect(AutoComplete.calledWith($input, 'bar')).toBe(true);
    });
    it('should listen to the selected event of autocomplete', () => {
      // Given
      let options = defaultOptions;

      // When
      new DocSearch(options);

      // Then
      expect(autocomplete.on.calledOnce).toBe(true);
      expect(autocomplete.on.calledWith('autocomplete:selected')).toBe(true);
    });
  });

  describe('checkArguments', () => {
    let checkArguments;
    beforeEach(() => {
      checkArguments = DocSearch.checkArguments;
    });

    it('should throw an error if no apiKey defined', () => {
      // Given
      let options = {
        indexName: 'indexName'
      };

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if no indexName defined', () => {
      // Given
      let options = {
        apiKey: 'apiKey'
      };

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if no selector matches', () => {
      // Given
      let options = {
        apiKey: 'apiKey',
        indexName: 'indexName'
      };
      let getInputFromSelector = sinon.stub().returns(false);
      DocSearch.prototype.getInputFromSelector = getInputFromSelector;

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Error:/);
    });
  });

  describe('getInputFromSelector', () => {
    let getInputFromSelector;
    beforeEach(() => {
      getInputFromSelector = DocSearch.getInputFromSelector;
    });

    it('should return null if no element matches the selector', () => {
      // Given
      let selector = '.i-do-not-exist > at #all';

      // When
      let actual = getInputFromSelector(selector);

      // Then
      expect(actual).toEqual(null);
    });
    it('should return null if the matched element is not an input', () => {
      // Given
      let selector = '.i-am-a-span';

      // When
      let actual = getInputFromSelector(selector);

      // Then
      expect(actual).toEqual(null);
    });
    it('should return a Zepto wrapped element if it matches', () => {
      // Given
      let selector = '#input';

      // When
      let actual = getInputFromSelector(selector);

      // Then
      expect($.zepto.isZ(actual)).toBe(true);
    });
  });
});
