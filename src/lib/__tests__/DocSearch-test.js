/* eslint no-new:0 */
/* eslint-disable max-len */
import sinon from 'sinon';
import $ from '../zepto';
import DocSearch from '../DocSearch';
/**
 * Pitfalls:
 * Whenever you call new DocSearch(), it will add the a new dropdown markup to
 * the page. Because we are clearing the document.body.innerHTML between each
 * test, it usually is not a problem.
 * Except that autocomplete.js remembers internally how many times it has been
 * called, and adds this number to classes of elements it creates.
 * DO NOT rely on any .ds-dataset-X, .ds-suggestions-X, etc classes where X is
 * a number. This will change if you add or remove tests and will break your
 * tests.
 **/

describe('DocSearch', () => {
  beforeEach(() => {
    // Note: If you edit this HTML while doing TDD with `npm run test:watch`,
    // you will have to restart `npm run test:watch` for the new HTML to be
    // updated
    document.body.innerHTML = `
    <div>
      <input id="input" name="search" />
      <span class="i-am-a-span">span span</span>
    </div>
    `;

    // We prevent the logging of expected errors
    window.console.warn = sinon.spy();

    window.location.assign = jest.fn();
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
        addAlgoliaAgent: sinon.spy(),
      };
      AlgoliaSearch = sinon.stub().returns(algoliasearch);
      autocomplete = {
        on: sinon.spy(),
      };
      AutoComplete = sinon.stub().returns(autocomplete);
      defaultOptions = {
        indexName: 'indexName',
        apiKey: 'apiKey',
        inputSelector: '#input',
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
      const options = defaultOptions;

      // When
      new DocSearch(options);

      // Then
      expect(DocSearch.checkArguments.calledOnce).toBe(true);
    });
    it('should pass main options as instance properties', () => {
      // Given
      const options = defaultOptions;

      // When
      const actual = new DocSearch(options);

      // Then
      expect(actual.indexName).toEqual('indexName');
      expect(actual.apiKey).toEqual('apiKey');
    });
    it('should set docsearch App Id as default', () => {
      // Given
      const options = defaultOptions;

      // When
      const actual = new DocSearch(options);

      // Then
      expect(actual.appId).toEqual('BH4D9OD16A');
    });
    it('should allow overriding appId', () => {
      // Given
      const options = { ...defaultOptions, appId: 'foo' };

      // When
      const actual = new DocSearch(options);

      // Then
      expect(actual.appId).toEqual('foo');
    });
    it('should allow customize algoliaOptions without loosing default options', () => {
      // Given
      const options = {
        algoliaOptions: {
          facetFilters: ['version:1.0'],
        },
        ...defaultOptions,
      };

      // When
      const actual = new DocSearch(options);

      // Then
      expect(actual.algoliaOptions).toEqual({
        hitsPerPage: 5,
        facetFilters: ['version:1.0'],
      });
    });
    it('should allow customize hitsPerPage', () => {
      // Given
      const options = {
        algoliaOptions: {
          hitsPerPage: 10,
        },
        ...defaultOptions,
      };

      // When
      const actual = new DocSearch(options);

      // Then
      expect(actual.algoliaOptions).toEqual({ hitsPerPage: 10 });
    });
    it('should pass the input element as an instance property', () => {
      // Given
      const options = defaultOptions;
      DocSearch.getInputFromSelector.returns($('<span>foo</span>'));

      // When
      const actual = new DocSearch(options);

      // Then
      const $inputs = actual.input;
      expect($inputs.text()).toEqual('foo');
      expect($inputs[0].tagName).toEqual('SPAN');
    });
    it('should pass secondary options as instance properties', () => {
      // Given
      const options = {
        ...defaultOptions,
        algoliaOptions: { anOption: 42 },
        autocompleteOptions: { anOption: 44 },
      };

      // When
      const actual = new DocSearch(options);

      // Then
      expect(typeof actual.algoliaOptions).toEqual('object');
      expect(actual.algoliaOptions.anOption).toEqual(42);
      expect(actual.autocompleteOptions).toEqual({
        debug: false,
        cssClasses: { prefix: 'ds' },
        anOption: 44,
        ariaLabel: 'search input',
      });
    });
    it('should instantiate algoliasearch with the correct values', () => {
      // Given
      const options = defaultOptions;

      // When
      new DocSearch(options);

      // Then
      expect(AlgoliaSearch.calledOnce).toBe(true);
      expect(AlgoliaSearch.calledWith('BH4D9OD16A', 'apiKey')).toBe(true);
    });
    it('should set a custom User-Agent to algoliasearch', () => {
      // Given
      const options = defaultOptions;

      // When
      new DocSearch(options);

      // Then
      expect(algoliasearch.addAlgoliaAgent.calledOnce).toBe(true);
    });
    it('should instantiate autocomplete.js', () => {
      // Given
      const options = {
        ...defaultOptions,
        autocompleteOptions: { anOption: '44' },
      };
      const $input = $('<input name="foo" />');
      DocSearch.getInputFromSelector.returns($input);

      // When
      new DocSearch(options);

      // Then
      expect(AutoComplete.calledOnce).toBe(true);
      expect(
        AutoComplete.calledWith($input, {
          anOption: '44',
          cssClasses: { prefix: 'ds' },
          debug: false,
          ariaLabel: 'search input'
        })
      ).toBe(true);
    });
    it('should listen to the selected and shown event of autocomplete', () => {
      // Given
      const options = { ...defaultOptions, handleSelected() {} };

      // When
      new DocSearch(options);

      // Then
      expect(autocomplete.on.calledTwice).toBe(true);
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
      const options = {
        indexName: 'indexName',
      };

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if no indexName defined', () => {
      // Given
      const options = {
        apiKey: 'apiKey',
      };

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if no selector matches', () => {
      // Given
      const options = {
        apiKey: 'apiKey',
        indexName: 'indexName',
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
      const selector = '.i-do-not-exist > at #all';

      // When
      const actual = getInputFromSelector(selector);

      // Then
      expect(actual).toEqual(null);
    });
    it('should return null if the matched element is not an input', () => {
      // Given
      const selector = '.i-am-a-span';

      // When
      const actual = getInputFromSelector(selector);

      // Then
      expect(actual).toEqual(null);
    });
    it('should return a Zepto wrapped element if it matches', () => {
      // Given
      const selector = '#input';

      // When
      const actual = getInputFromSelector(selector);

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
          then: sinon.spy(),
        }),
      };
      AlgoliaSearch = sinon.stub().returns(client);
      DocSearch.__Rewire__('algoliasearch', AlgoliaSearch);

      docsearch = new DocSearch({
        indexName: 'indexName',
        apiKey: 'apiKey',
        inputSelector: '#input',
      });
    });

    afterEach(() => {
      DocSearch.__ResetDependency__('algoliasearch');
    });

    it('returns a function', () => {
      // Given
      const actual = docsearch.getAutocompleteSource();

      // When

      // Then
      expect(actual).toBeInstanceOf(Function);
    });

    describe('the returned function', () => {
      it('calls the Algolia client with the correct parameters', () => {
        // Given
        const actual = docsearch.getAutocompleteSource();

        // When
        actual('query');

        // Then
        expect(client.search.calledOnce).toBe(true);
        // expect(resolvedQuery.calledOnce).toBe(true);
        const expectedArguments = {
          indexName: 'indexName',
          query: 'query',
          params: { hitsPerPage: 5 },
        };
        expect(client.search.calledWith([expectedArguments])).toBe(true);
      });
    });

    describe('when queryHook is used', () => {
      it('calls the Algolia client with the correct parameters', () => {
        // Given
        const actual = docsearch.getAutocompleteSource(
          false,
          query => `${query} modified`
        );

        // When
        actual('query');

        // Then
        expect(client.search.calledOnce).toBe(true);
        // expect(resolvedQuery.calledOnce).toBe(true);
        const expectedArguments = {
          indexName: 'indexName',
          query: 'query modified',
          params: { hitsPerPage: 5 },
        };
        expect(client.search.calledWith([expectedArguments])).toBe(true);
      });
    });
  });

  describe('handleSelected', () => {
    it('should change the location if no handleSelected specified', () => {
      // Given
      const options = {
        apiKey: 'key',
        indexName: 'foo',
        inputSelector: '#input',
      };

      // When
      const ds = new DocSearch(options);
      ds.autocomplete.trigger('autocomplete:selected', {
        url: 'https://website.com/doc/page',
      });

      return new Promise(resolve => {
        expect(window.location.assign).toHaveBeenCalledWith(
          'https://website.com/doc/page'
        );
        resolve();
      });
    });
    it('should call the custom handleSelected if defined', () => {
      // Given
      const customHandleSelected = jest.fn();
      const options = {
        apiKey: 'key',
        indexName: 'foo',
        inputSelector: '#input',
        handleSelected: customHandleSelected,
      };
      const expectedInput = expect.objectContaining({
        open: expect.any(Function),
      });
      const expectedEvent = expect.objectContaining({
        type: 'autocomplete:selected',
      });
      const expectedSuggestion = expect.objectContaining({
        url: 'https://website.com/doc/page',
      });

      // When
      const ds = new DocSearch(options);
      ds.autocomplete.trigger('autocomplete:selected', {
        url: 'https://website.com/doc/page',
      });

      return new Promise(resolve => {
        expect(customHandleSelected).toHaveBeenCalledWith(
          expectedInput,
          expectedEvent,
          expectedSuggestion
        );
        resolve();
      });
    });
    it('should prevent all clicks on links if a custom handleSelected is specified', () => {
      // Given
      const options = {
        apiKey: 'key',
        indexName: 'foo',
        inputSelector: '#input',
        handleSelected: jest.fn(),
      };

      // Building a dropdown with links inside
      const ds = new DocSearch(options);
      ds.autocomplete.trigger('autocomplete:shown');
      const dataset = $('.algolia-autocomplete');
      const suggestions = $('<div class="ds-suggestions"></div>');
      const testLink = $('<a href="#">test link</a>');
      dataset.append(suggestions);
      suggestions.append(testLink);

      // Simulating a click on the link
      const clickEvent = new $.Event('click');
      clickEvent.preventDefault = jest.fn();
      testLink.trigger(clickEvent);

      return new Promise(resolve => {
        expect(clickEvent.preventDefault).toHaveBeenCalled();
        resolve();
      });
    });
    describe('default handleSelected', () => {
      it('enterKey: should change the page', () => {
        const options = {
          apiKey: 'key',
          indexName: 'foo',
          inputSelector: '#input',
        };
        const mockSetVal = jest.fn();
        const mockInput = { setVal: mockSetVal };
        const mockSuggestion = { url: 'www.example.com' };
        const mockContext = { selectionMethod: 'enterKey' };

        new DocSearch(options).handleSelected(
          mockInput,
          undefined, // Event
          mockSuggestion,
          undefined, // Dataset
          mockContext
        );

        return new Promise(resolve => {
          expect(mockSetVal).toHaveBeenCalledWith('');
          expect(window.location.assign).toHaveBeenCalledWith(
            'www.example.com'
          );
          resolve();
        });
      });
      it('click: should not change the page', () => {
        const options = {
          apiKey: 'key',
          indexName: 'foo',
          inputSelector: '#input',
        };
        const mockSetVal = jest.fn();
        const mockInput = { setVal: mockSetVal };
        const mockContext = { selectionMethod: 'click' };

        new DocSearch(options).handleSelected(
          mockInput,
          undefined, // Event
          undefined, // Suggestion
          undefined, // Dataset
          mockContext
        );

        return new Promise(resolve => {
          expect(mockSetVal).not.toHaveBeenCalled();
          expect(window.location.assign).not.toHaveBeenCalled();
          resolve();
        });
      });
    });
  });

  describe('handleShown', () => {
    it('should add an alignment class', () => {
      // Given
      const options = {
        apiKey: 'key',
        indexName: 'foo',
        inputSelector: '#input',
      };

      // When
      const ds = new DocSearch(options);

      ds.autocomplete.trigger('autocomplete:shown');

      expect($('.algolia-autocomplete').attr('class')).toEqual(
        'algolia-autocomplete algolia-autocomplete-right'
      );
    });
  });

  describe('formatHits', () => {
    it('should not mutate the input', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(input).not.toBe(actual);
    });
    it('should set category headers to the first of each category', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'Geo-search',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
        {
          hierarchy: {
            lvl0: 'Python',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].isCategoryHeader).toEqual(true);
      expect(actual[2].isCategoryHeader).toEqual(true);
    });
    it('should group items of same category together', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
        {
          hierarchy: {
            lvl0: 'Python',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'Geo-search',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].category).toEqual('Ruby');
      expect(actual[1].category).toEqual('Ruby');
      expect(actual[2].category).toEqual('Python');
    });
    it('should mark all first elements as subcategories', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
        {
          hierarchy: {
            lvl0: 'Python',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'Geo-search',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].isSubCategoryHeader).toEqual(true);
      expect(actual[2].isSubCategoryHeader).toEqual(true);
    });
    it('should mark new subcategories as such', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: 'Foo',
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
        {
          hierarchy: {
            lvl0: 'Python',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: 'Bar',
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'Geo-search',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].isSubCategoryHeader).toEqual(true);
      expect(actual[1].isSubCategoryHeader).toEqual(false);
      expect(actual[2].isSubCategoryHeader).toEqual(true);
      expect(actual[3].isSubCategoryHeader).toEqual(true);
    });
    it('should use highlighted category and subcategory if exists', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: 'Foo',
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
          _highlightResult: {
            hierarchy: {
              lvl0: {
                value: '<mark>Ruby</mark>',
              },
              lvl1: {
                value: '<mark>API</mark>',
              },
            },
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].category).toEqual('<mark>Ruby</mark>');
      expect(actual[0].subcategory).toEqual('<mark>API</mark>');
    });

    it('should use highlighted camel if exists and matchLevel not none', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: 'Foo',
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
          _highlightResult: {
            // eslint-disable-next-line camelcase
            hierarchy_camel: {
              lvl0: {
                value: '<mark>Python</mark>',
                matchLevel: 'full',
              },
              lvl1: {
                value: '<mark>API2</mark>',
                matchLevel: 'full',
              },
            },
            hierarchy: {
              lvl0: {
                value: '<mark>Ruby</mark>',
              },
              lvl1: {
                value: '<mark>API</mark>',
              },
            },
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].category).toEqual('<mark>Python</mark>');
      expect(actual[0].subcategory).toEqual('<mark>API2</mark>');
    });
    it('should use lvl2 as title', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: 'Foo',
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].title).toEqual('Foo');
    });
    it('should use lvl1 as title if no lvl2', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].title).toEqual('API');
    });
    it('should use lvl0 as title if no lvl2 nor lvl2', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: null,
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].title).toEqual('Ruby');
    });
    it('should concatenate lvl2+ for title if more', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: 'Geo-search',
            lvl3: 'Foo',
            lvl4: 'Bar',
            lvl5: 'Baz',
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      const separator =
        '<span class="aa-suggestion-title-separator" aria-hidden="true"> › </span>';
      // Then
      expect(actual[0].title).toEqual(
        `Geo-search${separator}Foo${separator}Bar${separator}Baz`
      );
    });
    it('should concatenate highlighted elements', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: 'Geo-search',
            lvl3: 'Foo',
            lvl4: 'Bar',
            lvl5: 'Baz',
          },
          _highlightResult: {
            hierarchy: {
              lvl0: {
                value: '<mark>Ruby</mark>',
              },
              lvl1: {
                value: '<mark>API</mark>',
              },
              lvl2: {
                value: '<mark>Geo-search</mark>',
              },
              lvl3: {
                value: '<mark>Foo</mark>',
              },
              lvl4: {
                value: '<mark>Bar</mark>',
              },
              lvl5: {
                value: '<mark>Baz</mark>',
              },
            },
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      const separator =
        '<span class="aa-suggestion-title-separator" aria-hidden="true"> › </span>';
      // Then
      const expected = `<mark>Geo-search</mark>${separator}<mark>Foo</mark>${separator}<mark>Bar</mark>${separator}<mark>Baz</mark>`;
      expect(actual[0].title).toEqual(expected);
    });
    it('should add ellipsis to content', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
          content: 'foo bar',
          _snippetResult: {
            content: {
              value: 'lorem <mark>foo</mark> bar ipsum.',
            },
          },
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].text).toEqual('…lorem <mark>foo</mark> bar ipsum.');
    });
    it('should add the anchor to the url if one is set', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
          content: 'foo bar',
          url: 'http://foo.bar/',
          anchor: 'anchor',
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].url).toEqual('http://foo.bar/#anchor');
    });
    it('should not add the anchor to the url if one is set but it is already in the URL', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
          content: 'foo bar',
          url: 'http://foo.bar/#anchor',
          anchor: 'anchor',
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].url).toEqual('http://foo.bar/#anchor');
    });
    it('should just use the URL if no anchor is provided', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
          content: 'foo bar',
          url: 'http://foo.bar/',
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].url).toEqual(input[0].url);
    });
    it('should return the anchor if there is no URL', () => {
      // Given
      const input = [
        {
          hierarchy: {
            lvl0: 'Ruby',
            lvl1: 'API',
            lvl2: null,
            lvl3: null,
            lvl4: null,
            lvl5: null,
          },
          content: 'foo bar',
          anchor: 'anchor',
        },
      ];

      // When
      const actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].url).toEqual(`#${input[0].anchor}`);
    });
  });

  describe('formatUrl', () => {
    it('concatenates url and anchor', () => {
      // Given
      const input = {
        url: 'url',
        anchor: 'anchor',
      };

      // When
      const actual = DocSearch.formatURL(input);

      // Then
      expect(actual).toEqual('url#anchor');
    });

    it('returns only the url if no anchor', () => {
      // Given
      const input = {
        url: 'url',
      };

      // When
      const actual = DocSearch.formatURL(input);

      // Then
      expect(actual).toEqual('url');
    });

    it('returns the anchor if no url', () => {
      // Given
      const input = {
        anchor: 'anchor',
      };

      // When
      const actual = DocSearch.formatURL(input);

      // Then
      expect(actual).toEqual('#anchor');
    });

    it('does not concatenate if already an anchor', () => {
      // Given
      const input = {
        url: 'url#anchor',
        anchor: 'anotheranchor',
      };

      // When
      const actual = DocSearch.formatURL(input);

      // Then
      expect(actual).toEqual('url#anchor');
    });

    it('returns null if no anchor nor url', () => {
      // Given
      const input = {};

      // When
      const actual = DocSearch.formatURL(input);

      // Then
      expect(actual).toEqual(null);
    });

    it('emits a warning if no anchor nor url', () => {
      // Given
      const input = {};

      // When
      DocSearch.formatURL(input);

      // Then
      expect(window.console.warn.calledOnce).toBe(true);
    });
  });

  describe('getSuggestionTemplate', () => {
    beforeEach(() => {
      const templates = {
        suggestion: '<div></div>',
      };
      DocSearch.__Rewire__('templates', templates);
    });
    afterEach(() => {
      DocSearch.__ResetDependency__('templates');
    });
    it('should return a function', () => {
      // Given

      // When
      const actual = DocSearch.getSuggestionTemplate();

      // Then
      expect(actual).toBeInstanceOf(Function);
    });
    describe('returned function', () => {
      let Hogan;
      let render;
      beforeEach(() => {
        render = sinon.spy();
        Hogan = {
          compile: sinon.stub().returns({ render }),
        };
        DocSearch.__Rewire__('Hogan', Hogan);
      });
      it('should compile the suggestion template', () => {
        // Given

        // When
        DocSearch.getSuggestionTemplate();

        // Then
        expect(Hogan.compile.calledOnce).toBe(true);
        expect(Hogan.compile.calledWith('<div></div>')).toBe(true);
      });
      it('should call render on a Hogan template', () => {
        // Given
        const actual = DocSearch.getSuggestionTemplate();

        // When
        actual({ foo: 'bar' });

        // Then
        expect(render.calledOnce).toBe(true);
        expect(render.args[0][0]).toEqual({ foo: 'bar' });
      });
    });
  });
});
