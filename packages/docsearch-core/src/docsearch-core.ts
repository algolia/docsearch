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
   * The search parameters to forward to Algolia.
   *
   * @see https://www.algolia.com/doc/api-reference/api-parameters/
   */
  searchParameters?: QueryParameters;
  /**
   * Transforms the query before sending to Algolia.
   *
   * @param query The transformed query
   */
  transformQuery?(query: string): string;
  /**
   * Transforms the hits before displaying them.
   *
   * @param hits The hits
   */
  transformHits?(hits: DocSearchHits): DocSearchHits;
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
    searchParameters = {},
    transformQuery = query => query,
    transformHits = hits => hits,
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
    searchParametersFromSearch: QueryParameters = {}
  ): Promise<{ hits: DocSearchHits; result: Result }> {
    const {
      query: rawQuery = '',
      ...userSearchParameters
    } = searchParametersFromSearch;
    const query = transformQuery(rawQuery);
    const params: QueryParameters = {
      hitsPerPage: 5,
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      ...searchParameters,
      ...userSearchParameters,
    };

    // On empty query, we don't send an unecessary request
    // because we don't want to perform any search.
    // We fake an Algolia response without hits.
    if (!query) {
      const hits = {};
      const result: Result = {
        exhaustiveNbHits: true,
        hits: [],
        hitsPerPage: params.hitsPerPage!,
        index: indexName,
        nbHits: 0,
        nbPages: 0,
        page: 0,
        params: 'query=',
        processingTimeMS: 1,
        query: '',
      };

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

          return { hits, result };
        })
    );
  }

  return {
    search,
  };
}

export default docsearch;
