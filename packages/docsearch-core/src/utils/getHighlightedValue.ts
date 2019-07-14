import { AlgoliaHitWithRootLevels } from './formatHits';

export function getHighlightedValue(
  hit: AlgoliaHitWithRootLevels,
  property: string
): string {
  return hit[property];
}
