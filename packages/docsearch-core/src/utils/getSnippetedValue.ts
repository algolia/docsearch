import { Hit, HitAttributeSnippetResult } from '../types';

export function getSnippetedValue(hit: Hit, property: string): string {
  if (
    !hit._snippetResult ||
    !hit._snippetResult[property] ||
    !(hit._snippetResult[property] as HitAttributeSnippetResult).value
  ) {
    return hit[property];
  }

  const snippet = (hit._snippetResult[property] as HitAttributeSnippetResult)
    .value;

  return [
    snippet[0] !== snippet[0].toUpperCase() && '…',
    snippet,
    ['.', '!', '?'].indexOf(snippet[snippet.length - 1]) === -1 && '…',
  ]
    .filter(Boolean)
    .join('');
}
