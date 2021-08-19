import { DocSearchHit, InternalDocSearchHit } from './../types';
import { getAttributeValueByPath } from './getAttributeValueByPath';

const regexHighlightTags = /(<mark>|<\/mark>)/g;
const regexHasHighlightTags = RegExp(regexHighlightTags.source);

export function removeHighlightTags(
  hit: DocSearchHit | InternalDocSearchHit
): string {
  const internalDocSearchHit = hit as InternalDocSearchHit;

  if (!internalDocSearchHit.__docsearch_parent && !hit._highlightResult) {
    return hit.hierarchy.lvl0;
  }

  const value: string =
    getAttributeValueByPath(
      hit._highlightResult ? hit : internalDocSearchHit.__docsearch_parent,
      ['_highlightResult', 'hierarchy', 'lvl0', 'value']
    ) || '';

  return value && regexHasHighlightTags.test(value)
    ? value.replace(regexHighlightTags, '')
    : value;
}
