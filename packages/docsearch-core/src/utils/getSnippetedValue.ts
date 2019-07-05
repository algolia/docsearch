import { DocSearchHit } from '../types';

export function getSnippetedValue(hit: DocSearchHit, property: string): string {
  if (
    !(
      hit._snippetResult &&
      hit._snippetResult[property] &&
      hit._snippetResult[property].value
    )
  ) {
    return hit[property];
  }

  const snippet = hit._snippetResult[property].value;

  return [
    snippet[0] !== snippet[0].toUpperCase() && '…',
    snippet,
    ['.', '!', '?'].indexOf(snippet[snippet.length - 1]) === -1 && '…',
  ]
    .filter(Boolean)
    .join('');
}
