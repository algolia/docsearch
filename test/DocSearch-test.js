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
      defaultOptions = {
        indexName: 'indexName',
        apiKey: 'apiKey',
        inputSelector: '#input'
      };

      sinon.spy(DocSearch, 'checkArguments');
      sinon.stub(DocSearch, 'getInputFromSelector').returns(true);

      DocSearch.__Rewire__('algoliasearch', AlgoliaSearch);
      DocSearch.__Rewire__('autocomplete', AutoComplete);
    });

    afterEach(() => {
      DocSearch.checkArguments.restore();
      DocSearch.getInputFromSelector.restore();
      DocSearch.__ResetDependency__('algoliasearch');
      DocSearch.__ResetDependency__('autocomplete');
    });

    it('should call checkArguments', () => {
      // Given
      let options = defaultOptions;

      // When
      new DocSearch(options);

      // Then
      expect(DocSearch.checkArguments.calledOnce).toBe(true);
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
    it('should set docsearch App Id as default', () => {
      // Given
      let options = defaultOptions;

      // When
      let actual = new DocSearch(options);

      // Then
      expect(actual.appId).toEqual('BH4D9OD16A');
    });
    it('should allow overriding appId', () => {
      // Given
      let options = {...defaultOptions, appId: 'foo'};

      // When
      let actual = new DocSearch(options);

      // Then
      expect(actual.appId).toEqual('foo');
    });
    it('should pass the input element as an instance property', () => {
      // Given
      let options = defaultOptions;
      DocSearch.getInputFromSelector.returns($('<span>foo</span>'));

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
    it('should instantiate algoliasearch with the correct values', () => {
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
    it('should instantiate autocomplete.js', () => {
      // Given
      let options = {
        ...defaultOptions,
        autocompleteOptions: 'bar'
      };
      let $input = $('<input name="foo" />');
      DocSearch.getInputFromSelector.returns($input);

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

    afterEach(() => {
      if (DocSearch.getInputFromSelector.restore) {
        DocSearch.getInputFromSelector.restore();
      }
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
      sinon.stub(DocSearch, 'getInputFromSelector').returns(false);

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

  describe('getAutocompleteSource', () => {
    let client;
    let AlgoliaSearch;
    let docsearch;
    beforeEach(() => {
      client = {
        algolia: 'client',
        addAlgoliaAgent: sinon.spy(),
        search: sinon.stub().returns({
          then: sinon.spy()
        })
      };
      AlgoliaSearch = sinon.stub().returns(client);
      DocSearch.__Rewire__('algoliasearch', AlgoliaSearch);

      docsearch = new DocSearch({
        indexName: 'indexName',
        apiKey: 'apiKey',
        inputSelector: '#input',
        algoliaOptions: 'algoliaOptions'
      });
    });

    afterEach(() => {
      DocSearch.__ResetDependency__('algoliasearch');
    });

    it('returns a function', () => {
      // Given
      let actual = docsearch.getAutocompleteSource();

      // When

      // Then
      expect(actual).toBeA('function');
    });

    describe('the returned function', () => {
      it('calls the Agolia client with the correct parameters', () => {
        // Given
        let actual = docsearch.getAutocompleteSource();

        // When
        actual('query');

        // Then
        expect(client.search.calledOnce).toBe(true);
        // expect(resolvedQuery.calledOnce).toBe(true);
        let expectedArguments = {
          indexName: 'indexName',
          query: 'query',
          params: 'algoliaOptions'
        };
        expect(client.search.calledWith([expectedArguments])).toBe(true);
      });
    });
  });
});
