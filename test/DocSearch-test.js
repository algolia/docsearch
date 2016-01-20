/* eslint-env mocha */
/* eslint no-new:0 */

import jsdom from 'mocha-jsdom';
import expect from 'expect';
import sinon from 'sinon';
import {waitForAndRun} from './helpers';

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

  describe('handleSelected', () => {
    it('should change the location', (done) => {
      // Given
      const options = {
        apiKey: 'key',
        indexName: 'foo',
        inputSelector: '#input'
      };

      // When
      let ds = new DocSearch(options);
      ds.autocomplete.trigger('autocomplete:selected', {url: 'https://website.com/doc/page'});

      // Then asynchronously
      waitForAndRun(() => {
        // escape as soon as the URL has changed
        return window.location.href !== 'about:blank';
      }, () => {
        // then
        expect(window.location.href).toEqual('https://website.com/doc/page');
        done();
      }, 100);
    });
  });

  describe('formatHits', () => {
    it('should not mutate the input', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(input).toNotBe(actual);
    });
    it('should set category headers to the first of each category', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'Geo-search',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Python',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].isCategoryHeader).toEqual(true);
      expect(actual[2].isCategoryHeader).toEqual(true);
    });
    it('should group items of same category together', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Python',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'Geo-search',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].category).toEqual('Ruby');
      expect(actual[1].category).toEqual('Ruby');
      expect(actual[2].category).toEqual('Python');
    });
    it('should mark all first elements as subcategories', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Python',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'Geo-search',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].isSubCategoryHeader).toEqual(true);
      expect(actual[2].isSubCategoryHeader).toEqual(true);
    });
    it('should mark new subcategories as such', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Foo',
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Python',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Bar',
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'Geo-search',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].isSubCategoryHeader).toEqual(true);
      expect(actual[1].isSubCategoryHeader).toEqual(false);
      expect(actual[2].isSubCategoryHeader).toEqual(true);
      expect(actual[3].isSubCategoryHeader).toEqual(true);
    });
    it('should use highlighted category and subcategory if exists', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Foo',
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        _highlightResult: {
          hierarchy: {
            lvl0: {
              value: '<mark>Ruby</mark>'
            },
            lvl1: {
              value: '<mark>API</mark>'
            }
          }
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].category).toEqual('<mark>Ruby</mark>');
      expect(actual[0].subcategory).toEqual('<mark>API</mark>');
    });
    it('should use lvl2 as title', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Foo',
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].title).toEqual('Foo');
    });
    it('should use lvl1 as title if no lvl2', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].title).toEqual('API');
    });
    it('should use lvl0 as title if no lvl2 nor lvl2', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: null,
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].title).toEqual('Ruby');
    });
    it('should concatenate lvl2+ for title if more', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Geo-search',
          lvl3: 'Foo',
          lvl4: 'Bar',
          lvl5: 'Baz'
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].title).toEqual('Geo-search › Foo › Bar › Baz');
    });
    it('should concatenate highlighted elements', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Geo-search',
          lvl3: 'Foo',
          lvl4: 'Bar',
          lvl5: 'Baz'
        },
        _highlightResult: {
          hierarchy: {
            lvl0: {
              value: '<mark>Ruby</mark>'
            },
            lvl1: {
              value: '<mark>API</mark>'
            },
            lvl2: {
              value: '<mark>Geo-search</mark>'
            },
            lvl3: {
              value: '<mark>Foo</mark>'
            },
            lvl4: {
              value: '<mark>Bar</mark>'
            },
            lvl5: {
              value: '<mark>Baz</mark>'
            }
          }
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      let expected = '<mark>Geo-search</mark>' +
        ' › <mark>Foo</mark>' +
        ' › <mark>Bar</mark>' +
        ' › <mark>Baz</mark>';
      expect(actual[0].title).toEqual(expected);
    });
    it('should add ellipsis to content', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        content: 'foo bar',
        _snippetResult: {
          content: {
            value: 'lorem <mark>foo</mark> bar ipsum.'
          }
        }
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].text).toEqual('…lorem <mark>foo</mark> bar ipsum.');
    });
    it('should add the anchor to the url if one is set', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        content: 'foo bar',
        url: 'http://foo.bar/',
        anchor: 'anchor'
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].url).toEqual('http://foo.bar/#anchor');
    });
    it('should not add the anchor to the url if one is set but it is already in the URL', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        content: 'foo bar',
        url: 'http://foo.bar/#anchor',
        anchor: 'anchor'
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].url).toEqual('http://foo.bar/#anchor');
    });
    it('should just use the URL if no anchor is provided', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        content: 'foo bar',
        url: 'http://foo.bar/'
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].url).toEqual(input[0].url);
    });
    it('should return the anchor if there is no URL', () => {
      // Given
      let input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        content: 'foo bar',
        anchor: 'anchor'
      }];

      // When
      let actual = DocSearch.formatHits(input);

      // Then
      expect(actual[0].url).toEqual('#' + input[0].anchor);
    });
  });

  describe('getSuggestionTemplate', () => {
    beforeEach(() => {
      let templates = {
        suggestion: '<div></div>'
      };
      DocSearch.__Rewire__('templates', templates);
    });
    afterEach(() => {
      DocSearch.__ResetDependency__('templates');
    });
    it('should return a function', () => {
      // Given

      // When
      let actual = DocSearch.getSuggestionTemplate();

      // Then
      expect(actual).toBeA('function');
    });
    describe('returned function', () => {
      let Hogan;
      let render;
      beforeEach(() => {
        render = sinon.spy();
        Hogan = {
          compile: sinon.stub().returns({render})
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
        let actual = DocSearch.getSuggestionTemplate();

        // When
        actual('foo');

        // Then
        expect(render.calledOnce).toBe(true);
        expect(render.calledWith('foo')).toBe(true);
      });
    });
  });
});
