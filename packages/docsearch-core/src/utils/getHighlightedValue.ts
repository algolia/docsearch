import { DocSearchHit } from '../types';

export function getHighlightedValue(
  hit: DocSearchHit,
  property: string
): string {
  if (
    hit._highlightResult &&
    hit._highlightResult[property] &&
    hit._highlightResult[property].value
  ) {
    return hit._highlightResult[property].value;
  }

  return hit[property];
}
