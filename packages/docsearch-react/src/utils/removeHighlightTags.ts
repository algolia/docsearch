import type { DocSearchHit, InternalDocSearchHit } from '../types';

const regexHighlightTags = /(<mark>|<\/mark>)/g;

export function removeHighlightTags(
  hit: DocSearchHit | InternalDocSearchHit
): string {
  const highlightedValue =
    ('__docsearch_parent' in hit
      ? hit.__docsearch_parent?._highlightResult?.hierarchy?.lvl0?.value
      : hit._highlightResult?.hierarchy?.lvl0?.value) ?? hit.hierarchy.lvl0;

  return highlightedValue.replace(regexHighlightTags, '');
}
