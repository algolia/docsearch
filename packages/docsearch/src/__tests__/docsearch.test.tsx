import docsearchCore from 'docsearch-core';
import docsearchRenderer from 'docsearch-renderer-downshift';

import docsearch from '../docsearch';

jest.mock('docsearch-core');
jest.mock('docsearch-renderer-downshift');

const castToJestMock = (obj: any): jest.Mock => obj;

describe('docsearch', () => {
  let search: jest.Mock;

  beforeEach(() => {
    search = jest.fn();

    castToJestMock(docsearchCore).mockImplementation(() => ({
      search,
    }));
  });

  afterEach(() => {
    castToJestMock(docsearchCore).mockReset();
    castToJestMock(docsearchRenderer).mockReset();
  });

  describe('Usage', () => {
    test('throws for inputSelector without options', () => {
      const trigger = () => {
        // @ts-ignore incompatible options
        docsearch();
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`inputSelector\` option expects a \`string\` or an \`HTMLElement\`.

See: https://community.algolia.com/docsearch"
`);
    });

    test('throws for inputSelector with empty options', () => {
      const options = {};

      const trigger = () => {
        // @ts-ignore incompatible options
        docsearch(options);
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`inputSelector\` option expects a \`string\` or an \`HTMLElement\`.

See: https://community.algolia.com/docsearch"
`);
    });

    test('throws without inputSelector', () => {
      const options = {
        inputSelector: undefined,
      };

      const trigger = () => {
        // @ts-ignore incompatible options
        docsearch(options);
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`inputSelector\` option expects a \`string\` or an \`HTMLElement\`.

See: https://community.algolia.com/docsearch"
`);
    });
  });

  describe('Lifecycle', () => {
    test('forwards options to docsearch-core', () => {
      const inputSelector = document.createElement('div');
      const appId = 'appId';
      const apiKey = 'apiKey';
      const indexName = 'indexName';
      const searchParameters = { filters: 'lang:en' };
      const transformQuery = jest.fn();
      const transformHits = jest.fn();
      const docsearchCoreOptions = {
        appId,
        apiKey,
        indexName,
        searchParameters,
        transformQuery,
        transformHits,
      };

      docsearch({
        inputSelector,
        ...docsearchCoreOptions,
      });

      expect(docsearchCore).toHaveBeenCalledTimes(1);
      expect(docsearchCore).toHaveBeenCalledWith(docsearchCoreOptions);
    });

    test('forwards options to docsearch-renderer-downshift', () => {
      const inputSelector = document.createElement('div');
      const onItemSelect = jest.fn();
      const onItemHighlight = jest.fn();
      const docsearchRendererOptions = {
        placeholder: 'Search',
        stalledSearchDelay: 600,
        onItemSelect,
        onItemHighlight,
        search,
      };

      docsearch({
        inputSelector,
        ...docsearchRendererOptions,
      });

      expect(docsearchRenderer).toHaveBeenCalledTimes(1);
      expect(docsearchRenderer).toHaveBeenCalledWith(
        {
          ...docsearchRendererOptions,
          children: [],
        },
        expect.any(Object)
      );
    });
  });
});
