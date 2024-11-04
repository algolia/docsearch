import type { DocSearchHit, InternalDocSearchHit } from '../types';

const regexHighlightTags = /(<mark>|<\/mark>)/g;
const regexHasHighlightTags = RegExp(regexHighlightTags.source);

export function removeHighlightTags(hit: DocSearchHit | InternalDocSearchHit): string {
  const internalDocSearchHit = hit as InternalDocSearchHit;

  if (!internalDocSearchHit.__docsearch_parent && !hit._highlightResult) {
    return hit.hierarchy.lvl0;
  }

  const lvl0 = internalDocSearchHit.__docsearch_parent
    ? internalDocSearchHit.__docsearch_parent?._highlightResult?.hierarchy?.lvl0
    : hit._highlightResult?.hierarchy?.lvl0;

  if (!lvl0) {
    return hit.hierarchy.lvl0;
  }

  return lvl0.value && regexHasHighlightTags.test(lvl0.value) ? lvl0.value.replace(regexHighlightTags, '') : lvl0.value;
}
