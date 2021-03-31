const regexEscapedHtml = /(<mark>|<\/mark>)/g;
const regexHasEscapedHtml = RegExp(regexEscapedHtml.source);

export function unescape(value: string): string {
  return value && regexHasEscapedHtml.test(value)
    ? value.replace(regexEscapedHtml, '')
    : value;
}
