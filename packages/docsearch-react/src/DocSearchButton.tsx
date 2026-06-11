import type { DocSearchModalShortcuts } from '@docsearch/core';
import { useTheme } from '@docsearch/core/useTheme';
import React, { useEffect, useState, type JSX } from 'react';

import { getKeyboardShortcuts } from './constants/keyboardShortcuts';
import { usePlatformKeys } from './hooks/usePlatformKeys';
import { SearchIcon } from './icons/SearchIcon';
import type { DocSearchTheme } from './types';

export type ButtonTranslations = Partial<{
  buttonText: string;
  buttonAriaLabel: string;
}>;

export type DocSearchButtonProps = React.ComponentProps<'button'> & {
  theme?: DocSearchTheme;
  translations?: ButtonTranslations;
  keyboardShortcuts?: DocSearchModalShortcuts;
};

export const DocSearchButton = React.forwardRef<HTMLButtonElement, DocSearchButtonProps>(
  ({ translations = {}, keyboardShortcuts, ...props }, ref) => {
    const { buttonText = 'Search', buttonAriaLabel = 'Search' } = translations;
    const resolvedShortcuts = getKeyboardShortcuts(keyboardShortcuts);
    const { actionKeyReactsTo, actionKeyAltText, actionKeyLabel, key } = usePlatformKeys();

    useTheme({ theme: props.theme });

    const isCtrlCmdKEnabled = resolvedShortcuts['Ctrl/Cmd+K'];
    const shortcut = `${actionKeyAltText}+k`;

    return (
      <button
        type="button"
        className="DocSearch DocSearch-Button"
        aria-label={isCtrlCmdKEnabled ? `${buttonAriaLabel} (${shortcut})` : buttonAriaLabel}
        aria-keyshortcuts={isCtrlCmdKEnabled ? shortcut : undefined}
        {...props}
        ref={ref}
      >
        <span className="DocSearch-Button-Container">
          <SearchIcon />
          <span className="DocSearch-Button-Placeholder">{buttonText}</span>
        </span>

        <span className="DocSearch-Button-Keys">
          {key !== null && isCtrlCmdKEnabled && (
            <>
              <DocSearchButtonKey reactsToKey={actionKeyReactsTo}>{actionKeyLabel}</DocSearchButtonKey>
              <DocSearchButtonKey reactsToKey="k">K</DocSearchButtonKey>
            </>
          )}
        </span>
      </button>
    );
  },
);

type DocSearchButtonKeyProps = {
  reactsToKey?: string;
};

function DocSearchButtonKey({ reactsToKey, children }: React.PropsWithChildren<DocSearchButtonKeyProps>): JSX.Element {
  const [isKeyDown, setIsKeyDown] = useState(false);

  useEffect(() => {
    if (!reactsToKey) {
      return undefined;
    }

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === reactsToKey) {
        setIsKeyDown(true);
      }
    }

    function handleKeyUp(e: KeyboardEvent): void {
      if (
        e.key === reactsToKey ||
        // keyup doesn't fire when Command is held down,
        // workaround is to mark key as also released when Command is released
        // See https://stackoverflow.com/a/73419500
        e.key === 'Meta'
      ) {
        setIsKeyDown(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [reactsToKey]);

  return (
    <kbd
      className={
        isKeyDown
          ? 'DocSearch-Button-Key DocSearch-Button-Key--pressed'
          : 'DocSearch-Button-Key' + (reactsToKey === 'Ctrl' ? ' DocSearch-Button-Key--ctrl' : '')
      }
    >
      {children}
    </kbd>
  );
}
