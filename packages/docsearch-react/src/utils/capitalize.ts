export function capitalize(text: string): string {
  return `${text.charAt(0).toLocaleUpperCase()}${text.substring(1)}`;
}
