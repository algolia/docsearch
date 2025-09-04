import type { AIMessagePart } from '../types/AskiAi';

export interface AggregatedToolCallPart {
  type: 'aggregated-tool-call';
  queries: string[];
}

/**
 * Groups consecutive `searchIndex` tool invocation result parts together.
 * Empty or falsy queries are ignored.
 */
export function groupConsecutiveToolResults(parts: AIMessagePart[]): Array<AggregatedToolCallPart | AIMessagePart> {
  const aggregatedParts: Array<AggregatedToolCallPart | AIMessagePart> = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (part.type === 'tool-searchIndex' && part.state === 'output-available') {
      // build list of consecutive result queries
      const queries: string[] = [];
      let j = i;
      while (j < parts.length) {
        const candidate: any = parts[j];
        if (
          candidate?.type === 'tool-invocation' &&
          candidate.toolInvocation?.toolName === 'searchIndex' &&
          candidate.toolInvocation?.state === 'result'
        ) {
          const q = (candidate.toolInvocation?.args?.query || '').trim();
          // eslint-disable-next-line max-depth
          if (q) {
            queries.push(q);
          }
          j++;
        } else {
          break;
        }
      }

      if (queries.length > 1) {
        aggregatedParts.push({ type: 'aggregated-tool-call', queries });
      } else if (queries.length === 1) {
        // only one valid query, push the original part so rendering remains unchanged
        aggregatedParts.push(part);
      }

      i = j - 1; // skip processed items
    } else {
      aggregatedParts.push(part);
    }
  }

  return aggregatedParts;
}
