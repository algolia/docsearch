import { Hit, HitAttributeHighlightResult, HitHighlightResult } from '../types';

export function getHighlightedValue(hit: Hit, property: string): string {
  if (
    hit._highlightResult &&
    hit._highlightResult.hierarchy_camel &&
    (hit._highlightResult.hierarchy_camel as HitHighlightResult)[property] &&
    ((hit._highlightResult.hierarchy_camel as HitHighlightResult)[
      property
    ] as HitAttributeHighlightResult).value
  ) {
    return ((hit._highlightResult.hierarchy_camel as HitHighlightResult)[
      property
    ] as HitAttributeHighlightResult).value;
  }

  if (
    hit._highlightResult &&
    hit._highlightResult[property] &&
    (hit._highlightResult[property] as HitAttributeHighlightResult).value
  ) {
    return (hit._highlightResult[property] as HitAttributeHighlightResult)
      .value;
  }

  return hit[property];
}
