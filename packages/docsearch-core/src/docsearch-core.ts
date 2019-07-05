import algoliasearch from 'algoliasearch/lite';

import version from './version';
import formatHits, { FormattedHits } from './utils/formatHits';
import { QueryParameters, Result } from './types';

// export { QueryParameters };

export interface OnResultOptions<THits, TContainerNode = HTMLElement> {
  containerNode?: TContainerNode;
  hits: THits;
  result: Result;
}

export interface DocSearchOptions<
  THits = FormattedHits,
  TContainerNode = HTMLElement
> {
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
   * The container node passed to the `onResult` callback.
   * It can be used to display results when they're received.
   */
  containerNode?: TContainerNode;
  /**
   * Transforms the hits before displaying them.
   *
   * @param hits The formatted hits
   */
  transformHits?(hits: FormattedHits): THits;
  /**
   * The renderer to inject the hits in the container node.
   *
   * @param options The renderer options
   */
  onResult?(options: OnResultOptions<THits, TContainerNode>): void;
}

export function withUsage(message: string) {
  return `
${message}

See: https://community.algolia.com/docsearch
`.trim();
}

function docsearch<THits extends FormattedHits, TContainerNode = HTMLElement>(
  {
    appId = 'BH4D9OD16A',
    apiKey,
    indexName,
    containerNode,
    // @ts-ignore
    transformHits = hits => hits,
    onResult = () => {},
  }: DocSearchOptions<THits, TContainerNode> = {} as DocSearchOptions<
    THits,
    TContainerNode
  >
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

  function search(searchParameters: QueryParameters = {}) {
    const { query = '', ...params } = searchParameters;

    return searchClient.search([{ indexName, query, params }]).then(results => {
      const result = results[0];
      const formattedHits = formatHits(result.hits);
      const hits = transformHits(formattedHits);

      onResult({ containerNode, hits, result });

      return result;
    });
  }

  return {
    search,
  };
}

export default docsearch;
