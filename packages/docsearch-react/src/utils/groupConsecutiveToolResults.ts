import type {
  AIMessagePart,
  AggregatedToolCallPart,
  SearchOutputPart,
} from '../types/AskiAi';

import { getSearchToolQueries, isSearchOutputPart } from './ai';

/**
 * Groups consecutive search tool invocation result parts together. Both the
 * `searchIndex` tool and the Algolia MCP search tools (`algolia_search_index`
 * and `algolia_search_index_*`) are aggregated. Empty or falsy queries are
 * ignored.
 */
export function groupConsecutiveToolResults(
  parts: AIMessagePart[]
): Array<AggregatedToolCallPart | AIMessagePart> {
  const aggregatedParts: Array<AggregatedToolCallPart | AIMessagePart> = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (isSearchOutputPart(part)) {
      // build list of consecutive result queries
      const queries: string[] = [];
      let singleQueryPart: SearchOutputPart | undefined;
      let j = i;
      while (j < parts.length) {
        const candidate = parts[j];
        if (isSearchOutputPart(candidate)) {
          const queriesForPart = getSearchToolQueries(candidate);
          queries.push(...queriesForPart);

          // eslint-disable-next-line max-depth
          if (queriesForPart.length > 0) {
            singleQueryPart = candidate;
          }
          j++;
        } else {
          break;
        }
      }

      if (queries.length > 1) {
        aggregatedParts.push({ type: 'aggregated-tool-call', queries });
      } else if (queries.length === 1 && singleQueryPart) {
        // only one valid query, push the original part so rendering remains unchanged
        aggregatedParts.push(singleQueryPart);
      }

      i = j - 1; // skip processed items
    } else {
      aggregatedParts.push(part);
    }
  }

  return aggregatedParts;
}
