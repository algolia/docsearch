export interface DocSearchModalShortcuts {
  /**
   * Enable/disable the Ctrl/Cmd+K shortcut to toggle the DocSearch modal.
   *
   * @default true
   */
  'Ctrl/Cmd+K'?: boolean;
  /**
   * Enable/disable the / shortcut to open the DocSearch modal.
   *
   * @default true
   */
  '/'?: boolean;
}

export interface SidepanelShortcuts {
  /**
   * Enable/disable the Ctrl/Cmd+I shortcut to toggle the DocSearch sidepanel.
   *
   * @default true
   */
  'Ctrl/Cmd+I'?: boolean;
}

export type KeyboardShortcuts = DocSearchModalShortcuts & SidepanelShortcuts;

/**
 * Default keyboard shortcuts configuration for DocSearch.
 * These values are used when no keyboardShortcuts prop is provided
 * or when specific shortcuts are not configured.
 */
export const DEFAULT_KEYBOARD_SHORTCUTS: Required<KeyboardShortcuts> = {
  'Ctrl/Cmd+K': true,
  '/': true,
  'Ctrl/Cmd+I': true,
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
