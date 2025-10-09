export interface KeyboardShortcuts {
  /**
   * Enable/disable the Ctrl/Cmd+K shortcut to toggle the search modal.
   *
   * @default true
   */
  'Ctrl/Cmd+K'?: boolean;
  /**
   * Enable/disable the / shortcut to open the search modal.
   *
   * @default true
   */
  '/'?: boolean;
}

/**
 * Default keyboard shortcuts configuration for DocSearch.
 * These values are used when no keyboardShortcuts prop is provided
 * or when specific shortcuts are not configured.
 */
export const DEFAULT_KEYBOARD_SHORTCUTS: Required<KeyboardShortcuts> = {
  'Ctrl/Cmd+K': true,
  '/': true,
} as const;

/**
 * Merges user-provided keyboard shortcuts with defaults.
 *
 * @param userShortcuts - Optional user configuration.
 * @returns Complete keyboard shortcuts configuration with defaults applied.
 */
export function useKeyboardShortcuts(userShortcuts?: KeyboardShortcuts): Required<KeyboardShortcuts> {
  return {
    ...DEFAULT_KEYBOARD_SHORTCUTS,
    ...userShortcuts,
  };
}
