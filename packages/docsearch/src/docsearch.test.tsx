import docsearchCore from 'docsearch-core';

import docsearch from './docsearch';

jest.mock('docsearch-core');

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
    test('forwards the option to docsearch-core', () => {
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
  });
});
