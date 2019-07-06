import algoliasearch from 'algoliasearch/lite';
import { DocSearchHits, QueryParameters, Result } from 'docsearch.js-types';

import version from './version';
import formatHits from './utils/formatHits';

export interface OnResultOptions {
  hits: DocSearchHits;
  result: Result;
}

export interface DocSearchCoreOptions {
  /**
   * The Algolia application identifier.
   *
   * It needs to be specified only if you run DocSearch
   * on your own.
   *
   * @defaults `"BH4D9OD16A"`
   */
  appId?: string;
  /**
   * Your Algolia search API key.
   */
  apiKey: string;
  /**
   * Your Algolia index name.
   */
  indexName: string;
  /**
   * Transforms the hits before displaying them.
   *
   * @param hits The formatted hits
   */
  transformHits?(hits: DocSearchHits): DocSearchHits;
  /**
   * The renderer to inject the hits in the container node.
   *
   * @param options The renderer options
   */
  onResult?(options: OnResultOptions): void;
}

export function withUsage(message: string) {
  return `
${message}

See: https://community.algolia.com/docsearch
`.trim();
}

function docsearch(
  {
    appId = 'BH4D9OD16A',
    apiKey,
    indexName,
    transformHits = hits => hits,
    onResult = () => {},
  }: DocSearchCoreOptions = {} as DocSearchCoreOptions
) {
  if (typeof appId !== 'string') {
    throw new Error(withUsage('The `appId` option expects a `string`.'));
  }

  if (typeof apiKey !== 'string') {
    throw new Error(withUsage('The `apiKey` option expects a `string`.'));
  }

  if (typeof indexName !== 'string') {
    throw new Error(withUsage('The `indexName` option expects a `string`.'));
  }

  const searchClient = algoliasearch(appId, apiKey);

  (searchClient as any).addAlgoliaAgent(`docsearch.js ${version}`);

  function search(
    searchParameters: QueryParameters = {}
  ): Promise<{ hits: DocSearchHits; result: Result }> {
    const { query = '', ...userParams } = searchParameters;
    const params: QueryParameters = {
      hitsPerPage: 5,
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      ...userParams,
    };

    // On empty query, we don't send an unecessary request
    // because we don't want to perform any search.
    // We fake an Algolia response without hits.
    if (!query) {
      const hits = {};
      const result: Result = {
        exhaustiveNbHits: true,
        hits: [],
        hitsPerPage: searchParameters.hitsPerPage || 5,
        index: indexName,
        nbHits: 0,
        nbPages: 0,
        page: 0,
        params: 'query=',
        processingTimeMS: 1,
        query: '',
      };

      onResult({ hits, result });

      return Promise.resolve({ hits, result });
    }

    return (
      searchClient
        // @ts-ignore `aroundLatLngViaIP` is mistyped (should be a boolean)
        .search([{ indexName, query, params }])
        .then(({ results }) => {
          const result = results[0];
          const formattedHits = formatHits(result.hits);
          const hits = transformHits(formattedHits);

          onResult({ hits, result });

          return { hits, result };
        })
    );
  }

  return {
    search,
  };
}

export default docsearch;
