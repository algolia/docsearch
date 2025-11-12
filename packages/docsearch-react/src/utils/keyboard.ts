export const ACTION_KEY_DEFAULT = 'Ctrl';
export const ACTION_KEY_APPLE = '⌘';

export function isAppleDevice(): boolean {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}
