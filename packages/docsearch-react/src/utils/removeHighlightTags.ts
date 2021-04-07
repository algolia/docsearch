const regexHighlightTags = /(<mark>|<\/mark>)/g;
const regexHasHighlightTags = RegExp(regexHighlightTags.source);

export function removeHighlightTags(value: string): string {
  return value && regexHasHighlightTags.test(value)
    ? value.replace(regexHighlightTags, '')
    : value;
}
