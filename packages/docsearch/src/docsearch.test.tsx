import docsearchCore from 'docsearch-core';
import docsearchRenderer from 'docsearch-renderer-downshift';

import docsearch from './docsearch';

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
    test('throws for container without options', () => {
      const trigger = () => {
        // @ts-ignore incompatible options
        docsearch();
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`container\` option expects a \`string\` or an \`HTMLElement\`.

See: https://community.algolia.com/docsearch"
`);
    });

    test('throws for container with empty options', () => {
      const options = {};

      const trigger = () => {
        // @ts-ignore incompatible options
        docsearch(options);
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`container\` option expects a \`string\` or an \`HTMLElement\`.

See: https://community.algolia.com/docsearch"
`);
    });

    test('throws without container', () => {
      const options = {
        container: undefined,
      };

      const trigger = () => {
        // @ts-ignore incompatible options
        docsearch(options);
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`container\` option expects a \`string\` or an \`HTMLElement\`.

See: https://community.algolia.com/docsearch"
`);
    });
  });

  describe('Lifecycle', () => {
    test('forwards options to docsearch-core', () => {
      const container = document.createElement('div');
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
        container,
        ...docsearchCoreOptions,
      });

      expect(docsearchCore).toHaveBeenCalledTimes(1);
      expect(docsearchCore).toHaveBeenCalledWith(docsearchCoreOptions);
    });

    test('forwards options to docsearch-renderer-downshift', () => {
      const container = document.createElement('div');
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
        container,
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
