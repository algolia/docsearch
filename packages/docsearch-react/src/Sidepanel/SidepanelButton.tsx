import type { SidepanelShortcuts } from '@docsearch/core';
import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';

import { SparklesIcon } from '../icons';
import { ACTION_KEY_APPLE, ACTION_KEY_DEFAULT, isAppleDevice } from '../utils';

export type SidepanelButtonTranslations = Partial<{
  /**
   * Text to be displayed when button has variant: `inline`.
   *
   * @default 'Ask AI'
   **/
  buttonText: string;
  /**
   * Aria label text for the button.
   *
   * @default 'Ask AI'
   **/
  buttonAriaLabel: string;
}>;

export type ButtonVariant = 'floating' | 'inline';

export type SidepanelButtonProps = {
  /**
   * Variant of the button positioning and styling.
   *
   * - `inline` displays the button inline where rendered, with extra text
   * - `floating` displays the button floating in bottom right of screen with just icon.
   *
   * @default 'floating'
   **/
  variant?: ButtonVariant;
  /**
   * Translations specific to the Sidepanel button.
   **/
  translations?: SidepanelButtonTranslations;
  /**
   * Configuration for keyboard shortcuts. Allows enabling/disabling specific shortcuts.
   *
   * @default `{ 'Ctrl/Cmd+I': true }`
   */
  keyboardShortcuts?: SidepanelShortcuts;
};

type Props = React.ComponentProps<'button'> & SidepanelButtonProps;

export const SidepanelButton = ({
  variant = 'floating',
  keyboardShortcuts,
  translations = {},
  ...props
}: Props): JSX.Element => {
  const { buttonText = 'Ask AI', buttonAriaLabel = 'Ask AI' } = translations;
  const [key, setKey] = useState<typeof ACTION_KEY_APPLE | typeof ACTION_KEY_DEFAULT | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      isAppleDevice() ? setKey(ACTION_KEY_APPLE) : setKey(ACTION_KEY_DEFAULT);
    }
  }, []);

  const actionKeyAltText = key === ACTION_KEY_DEFAULT ? 'Control' : 'Meta';
  const isCtrlCmdIEnabled = keyboardShortcuts?.['Ctrl/Cmd+I'] !== false;
  const shortcut = `${actionKeyAltText}+i`;

  return (
    <button
      className={`DocSearch-SidepanelButton ${variant}`}
      type="button"
      aria-label={isCtrlCmdIEnabled ? `${buttonAriaLabel} (${shortcut})` : buttonAriaLabel}
      aria-keyshortcuts={isCtrlCmdIEnabled ? shortcut : undefined}
      {...props}
    >
      {variant !== 'floating' && buttonText}
      <SparklesIcon />
    </button>
  );
};
