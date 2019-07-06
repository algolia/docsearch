import { AlgoliaHitWithRootLevels } from './formatHits';

export function getHighlightedValue(
  hit: AlgoliaHitWithRootLevels,
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
