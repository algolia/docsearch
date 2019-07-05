import algoliasearch from 'algoliasearch/lite';

import docsearchCore from './';
import pkg from '../package.json';

jest.mock('algoliasearch/lite');

const castToJestMock = (obj: any): jest.Mock => obj;

const fakeResult = {
  results: [{ hits: [] }],
};

describe('docsearch-core', () => {
  let search: any;
  let addAlgoliaAgent: any;

  beforeEach(() => {
    search = jest.fn().mockResolvedValue(fakeResult);
    addAlgoliaAgent = jest.fn();

    castToJestMock(algoliasearch).mockImplementation(() => ({
      search,
      addAlgoliaAgent,
    }));
  });

  afterEach(() => {
    castToJestMock(algoliasearch).mockReset();
  });

  describe('Usage', () => {
    test('throws without options', () => {
      const trigger = () => {
        // @ts-ignore incorrect options
        docsearchCore();
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`apiKey\` option expects a \`string\`.

See: https://community.algolia.com/docsearch"
`);
    });

    test('throws with empty options', () => {
      const trigger = () => {
        // @ts-ignore incorrect options
        docsearchCore({});
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`apiKey\` option expects a \`string\`.

See: https://community.algolia.com/docsearch"
`);
    });

    test('throws with a non-string appId', () => {
      const trigger = () => {
        // @ts-ignore incorrect options
        docsearchCore({
          appId: true,
        });
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`appId\` option expects a \`string\`.

See: https://community.algolia.com/docsearch"
`);
    });

    test('throws with a non-string apiKey', () => {
      const trigger = () => {
        // @ts-ignore incorrect options
        docsearchCore({
          apiKey: true,
        });
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`apiKey\` option expects a \`string\`.

See: https://community.algolia.com/docsearch"
`);
    });

    test('throws with a non-string indexName', () => {
      const trigger = () => {
        // @ts-ignore incorrect options
        docsearchCore({
          indexName: true,
        });
      };

      expect(trigger).toThrowErrorMatchingInlineSnapshot(`
"The \`apiKey\` option expects a \`string\`.

See: https://community.algolia.com/docsearch"
`);
    });

    test('does not throw with correct options', () => {
      const trigger = () => {
        docsearchCore({
          apiKey: 'apiKey',
          indexName: 'indexName',
        });
      };

      expect(trigger).not.toThrow();
    });
  });

  describe('Lifecycle', () => {
    test('instantiates algoliasearch with the right credentials', () => {
      const docsearchOptions = {
        appId: 'appId',
        apiKey: 'apiKey',
        indexName: 'indexName',
      };

      docsearchCore(docsearchOptions);

      expect(algoliasearch).toHaveBeenCalledTimes(1);
      expect(algoliasearch).toHaveBeenCalledWith(
        docsearchOptions.appId,
        docsearchOptions.apiKey
      );
    });

    test('sets user agents', () => {
      docsearchCore({
        apiKey: 'apiKey',
        indexName: 'indexName',
      });

      expect(addAlgoliaAgent).toHaveBeenCalledTimes(1);
      expect(addAlgoliaAgent).toHaveBeenCalledWith(
        `docsearch.js ${pkg.version}`
      );
    });

    describe('search', () => {
      test('without query propagate the search parameters to the search client', async () => {
        const docsearchIndex = docsearchCore({
          apiKey: 'apiKey',
          indexName: 'indexName',
        });

        await docsearchIndex.search();

        expect(search).toHaveBeenCalledTimes(1);
        expect(search).toHaveBeenCalledWith([
          {
            indexName: 'indexName',
            query: '',
            params: {},
          },
        ]);
      });

      test('with query propagates the search parameters to the search client', async () => {
        const docsearchIndex = docsearchCore({
          apiKey: 'apiKey',
          indexName: 'indexName',
        });

        await docsearchIndex.search({ query: 'query', hitsPerPage: 5 });

        expect(search).toHaveBeenCalledTimes(1);
        expect(search).toHaveBeenCalledWith([
          {
            query: 'query',
            indexName: 'indexName',
            params: {
              hitsPerPage: 5,
            },
          },
        ]);
      });

      test('transforms hits', async () => {
        const transformHits = jest.fn();

        const docsearchIndex = docsearchCore({
          apiKey: 'apiKey',
          indexName: 'indexName',
          transformHits,
        });

        await docsearchIndex.search({ query: 'query' });

        expect(transformHits).toHaveBeenCalledTimes(1);
        expect(transformHits).toHaveBeenCalledWith({});
      });

      test('calls `onResults`', async () => {
        const containerNode = document.createElement('div');
        const onResult = jest.fn();
        const docsearchIndex = docsearchCore({
          apiKey: 'apiKey',
          indexName: 'indexName',
          containerNode,
          onResult,
        });

        const { hits, result } = await docsearchIndex.search({
          query: 'query',
        });

        expect(onResult).toHaveBeenCalledTimes(1);
        expect(onResult).toHaveBeenCalledWith({
          containerNode,
          hits,
          result,
        });
      });
    });
  });
});
