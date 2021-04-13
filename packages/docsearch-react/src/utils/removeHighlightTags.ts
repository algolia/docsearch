import { DocSearchHit, InternalDocSearchHit } from './../types';

const regexHighlightTags = /(<mark>|<\/mark>)/g;
const regexHasHighlightTags = RegExp(regexHighlightTags.source);

export function removeHighlightTags(
  hit: DocSearchHit | InternalDocSearchHit
): string {
  if (
    !(hit as InternalDocSearchHit).__docsearch_parent &&
    !hit._highlightResult
  ) {
    return hit.hierarchy.lvl0;
  }

  const { value } = hit._highlightResult
    ? hit._highlightResult.hierarchy.lvl0
    : (hit as InternalDocSearchHit).__docsearch_parent!._highlightResult
        .hierarchy.lvl0;

  return value && regexHasHighlightTags.test(value)
    ? value.replace(regexHighlightTags, '')
    : value;
}
